from django.urls import path
from .views import gpt_view

urlpatterns = [
    path('gpt', gpt_view, name='gpt_api'),
]
