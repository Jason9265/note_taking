# note_taking/urls.py

from django.urls import path
from .views import NoteListCreateAPIView, NoteDetailAPIView, TagListCreateAPIView, TagDetailAPIView

urlpatterns = [
    path('notes/', NoteListCreateAPIView.as_view(), name='note-list'),
    path('notes/<int:pk>/', NoteDetailAPIView.as_view(), name='note-detail'),
    path('tags/', TagListCreateAPIView.as_view(), name='tag-list'),
    path('/<int:pk>/', TagDetailAPIView.as_view(), name='tag-detail'),
]
