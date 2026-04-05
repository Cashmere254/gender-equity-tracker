# apps/reports/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.ReportListView.as_view(), name='report_list'),
    path('save/', views.ReportSaveView.as_view(), name='report_save'),
    path('<uuid:report_id>/export-docx/', views.ReportExportDocxView.as_view(), name='report_export_docx'),
]