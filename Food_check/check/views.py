
import json
import logging
import time
from django.http import HttpResponseNotAllowed, JsonResponse
from django.shortcuts import render
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
import wikipediaapi
from googlesearch import search
# import requests

# Logging declaration
logger = logging.getLogger(__name__)

# Timestamp and version
timestamp = int(timezone.now().timestamp())
version = int(time.time())

def get_wikipedia_paragraph(page_title):
    wiki_wiki = wikipediaapi.Wikipedia(language='en', user_agent='Your-User-Agent-Name/0.1')
    
    # Get the page
    logger.info(f"Getting information about {page_title}")
    page = wiki_wiki.page(page_title)
    
    # Check if the page exists
    logger.info("Checking if the Page exists.")
    if not page.exists():
        paragraph = "Data not found."
        return paragraph

    # Get the first paragraph
    logger.info("Getting Summary.")
    paragraph = page.summary

    return paragraph

# Create your views here.
def check(request):
    logger.info("Rendering check.html file...")
    csrf_token = get_token(request)
    context = {
        'timestamp': timestamp,
        'version': version,
        'csrf_token': csrf_token
    }
    return render(request, 'check.html', context)

def data(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))  # Parse JSON data from request body
        item = data.get('item')
        logger.info(f'Received request to get info about: {item}')
        data = get_wikipedia_paragraph(item)
        time.sleep(10)
        logger.info(f'Received data about item: {data}')
        logger.info("Retrieved data from Wikipedia...")
        return JsonResponse({'success': True, 'data': data})
    


def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})

@csrf_exempt
def receive_data(request):
    if request.method == 'POST':
        logger.info('Received POST request')
        try:
            data = json.loads(request.body.decode('utf-8'))  # Parse JSON data from request body
            item = data.get('item')
            logger.info(f'Received request to get info about: {item}')
            data = get_wikipedia_paragraph(item)
            time.sleep(10)
            logger.info(f'Received data about item: {data}')
            logger.info("Retrieved data from Wikipedia...")
            return JsonResponse({'success': True, 'data': data})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON'}, status=400)
    else:
        return HttpResponseNotAllowed(['POST'])
