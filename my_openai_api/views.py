import os
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from openai import OpenAI
from note_taking.models import Note, Tag

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
file_path = os.path.join(os.path.dirname(__file__), 'files')


@api_view(['POST'])
def create_md_remote(request):
    selectedTag = request.data.get('selectedTag', '')
    final_file_path = os.path.join(file_path, 'test.md')

    # generate .md file
    if selectedTag == 'All':
        notes = Note.objects.all()
    else:
        notes = Note.objects.filter(tags__name=selectedTag)

    # Format notes into Markdown and write
    md_content = "\n\n".join(f"## {note.title}\n{note.content}" for note in notes)
    with open(final_file_path, 'w') as md_file:
        md_file.write(md_content)

    try:
        # upload .md file
        file = client.files.create(
            file=open(final_file_path, "rb"),
            purpose='assistants'
        )

        return JsonResponse({
            'response': 'ok',
            'selectedTag': selectedTag,
            'file_id': file.id
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
def create_assistance_thread(request):
    instruction = request.data
    file_id = request.data

    # Call OpenAI API
    try:
        # create Assistant
        assistant = client.beta.assistants.create(
            instructions=instruction,
            model="gpt-3.5-turbo-1106",
            tools=[{"type": "retrieval"}],
            file_ids=file_id
        )

        # create Thread
        thread = client.beta.threads.create()

        return JsonResponse({'response': 'ok'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
def gpt_message(request):

    # Call OpenAI API
    try:
        # create Message
        message = client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content="I need to solve the equation `3x + 11 = 14`. Can you help me?"
        )
        return JsonResponse({'response': 'ok'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
def gpttest_view(request):
    try:
        # assistant = client.beta.assistants.create(
        #     name="Math Tutor",
        #     instructions="You are a personal math tutor. Write and run code to answer math questions",
        #     tools=[{"type": "code_interpreter"}],
        #     model="gpt-3.5-turbo-1106"
        # )

        # thread = client.beta.threads.create()

        # message = client.beta.threads.messages.create(
        #     thread_id=thread.id,
        #     role="user",
        #     content="I need to solve the equation `3x + 11 = 14`. Can you help me?"
        # )
        
        # # run = client.beta.threads.runs.create(
        # #     thread_id=thread.id,
        # #     assistant_id=assistant.id,
        # #     instructions="Please address the user as Jane Doe."
        # # )
        # # run = client.beta.threads.runs.retrieve(
        # #     thread_id=thread.id,
        #     #  run_id=run.id
        # #     )
        
        # # messages = client.beta.threads.messages.list(
        # #     thread_id=thread.id
        # #     )
        
        # print(thread)
        
        return JsonResponse({"message": "done"})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
