# apps/programs/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('programs', views.ProgramViewSet, basename='programs')
router.register('grants', views.GrantViewSet, basename='grants')
router.register('indicators', views.IndicatorViewSet, basename='indicators')

urlpatterns = [path('', include(router.urls))]