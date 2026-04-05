# apps/dashboard/admin.py

from django.contrib import admin

# The dashboard app has no models to register.
# It only contains views that aggregate AIExtraction,
# Indicator, and Narrative data.
# All underlying models are registered in their respective app admin files.