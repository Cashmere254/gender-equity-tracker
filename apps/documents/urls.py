# apps/documents/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.DocumentUploadView.as_view(), name='document_upload'),
    path('narratives/', views.NarrativeListView.as_view(), name='narrative_list'),
]