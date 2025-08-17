from channels.generic.websocket import WebsocketConsumer

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from chats.models import Message, Chat
from chats.serializers import MessageSerializer
from django.contrib.auth import get_user_model
from django.db import transaction


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f'chat_{self.chat_id}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        
        # with transaction.atomic():
        message = await self.create_message(data)
        print(f"message created - {message}")
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message.to_dict()
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event['message']))

    @database_sync_to_async
    def create_message(self, data):
        User = get_user_model()
        user = User.objects.get(username=data['user_sender'])
        chat = Chat.objects.get(pk=data['chat'])
        return Message.objects.create(
            chat=chat,
            user_sender=user,
            body=data['body'],
            is_edited=False,
            is_eliminated=False
        )