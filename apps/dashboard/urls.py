# apps/dashboard/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('kpi-summary/', views.KPISummaryView.as_view(), name='kpi_summary'),
]