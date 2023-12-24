import os
import datetime
import time
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from openai import OpenAI
from note_taking.models import Note

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
file_path = os.path.join(os.path.dirname(__file__), 'files')


@api_view(['POST'])
def create_md_remote(request):
    selectedTag = request.data.get('selectedTag', '')
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M")
    final_file_path = os.path.join(file_path, f'note_{timestamp}.md')

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
    instruction = request.data.get('instructions')
    file_id = request.data.get('fileId')

    try:
        # create Assistant
        assistant = client.beta.assistants.create(
            instructions=instruction,
            model="gpt-4-1106-preview",
            tools=[{"type": "retrieval"}],
            file_ids=[file_id, file_id]
        )

        # create Thread
        thread = client.beta.threads.create()

        return JsonResponse({
            'response': 'ok',
            'assistant_id': assistant.id,
            'thread_id': thread.id,
            'file_id': file_id
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
def gpt_message(request):
    thread_id = request.data.get('threadId')
    assistant_id = request.data.get('assistantId')
    instruction = request.data.get('instructions')
    content = request.data.get('content')

    try:
        # create Message
        message = client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=content,
        )

        # run
        run = client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=assistant_id,
            instructions=instruction
        )

        run_completed = False
        while not run_completed:
            # Sleep for a short period to avoid rate limiting
            time.sleep(5)
            # Check the status of the run
            run_status = client.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run.id
            )
            if run_status.status == 'completed':
                run_completed = True
            elif run_status.status == 'failed':
                return JsonResponse({'error': 'Run failed'}, status=500)
        
        # view message
        messages = client.beta.threads.messages.list(
            thread_id=thread_id
        )
        extracted_data = []
        for thread_message in messages.data:
            if thread_message.content and len(thread_message.content) > 0 and hasattr(thread_message.content[0], 'text'):
                value = thread_message.content[0].text.value
                role = thread_message.role
                extracted_data.append({'value': value, 'role': role})
        result = extracted_data[0].get('value')
        return JsonResponse({
            'response': 'ok',
            'thread_id': thread_id,
            'result': result,
            'messages': extracted_data,
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
