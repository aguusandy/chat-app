from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (FilesUserViewSet)


app_name = 'chat'

router = DefaultRouter()

router.register('', FilesUserViewSet, basename='')

urlpatterns = [
    path('', include(router.urls)),
]