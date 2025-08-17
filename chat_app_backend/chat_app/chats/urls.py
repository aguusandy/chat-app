from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (ChatViewSet, MessageViewSet)


app_name = 'chat'

router = DefaultRouter()

router.register('messages', MessageViewSet, basename='messages')
router.register('', ChatViewSet, basename='chats')

urlpatterns = [
    path('', include(router.urls)),
]