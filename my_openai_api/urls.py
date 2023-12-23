from django.urls import path
from .views import gpt_message, create_md_remote, create_assistance_thread

urlpatterns = [
    path('gpt_message/', gpt_message, name='gpt_message'),
    path('create_md_remote/', create_md_remote, name='create_md_remote'),
    path('create_assistance_thread/', create_assistance_thread, name='create_assistance_thread'),
]
