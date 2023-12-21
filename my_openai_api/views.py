from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
import openai

@api_view(['POST'])
def gpt_view(request):
    # Extract content and instructions from POST data
    content = request.data.get('content', '')
    instructions = request.data.get('instructions', '')

    # Call OpenAI API
    try:
        openai.api_key = 'your_openai_api_key'
        response = openai.Completion.create(
            engine="gpt-3.5-turbo",
            prompt=f"{content}\n\n{instructions}",
            max_tokens=150
        )
        return JsonResponse({'response': response.choices[0].text.strip()})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
