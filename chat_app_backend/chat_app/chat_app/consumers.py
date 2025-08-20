from channels.generic.websocket import WebsocketConsumer

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from chats.models import Message, Chat
from chats.serializers import MessageSerializer
from django.contrib.auth import get_user_model

from .utils import ChatBot, is_bot_chat

# https://channels.readthedocs.io/en/latest/tutorial/part_3.html

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
        action = data.get('action', 'create')
        message = None
        if action == 'create':
            message = await self.create_message(data)            
        elif action == 'edit':
            message = await self.edit_message(data)
        elif action == 'delete':
            message = await self.delete_message(data)
        else:
            print(f"Unknown action: {action}")
            return
        if message:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message.to_dict()
                }
            )
        # if the bot chat is in the conversation 
        bot_chat = await is_bot_chat(data['chat'])
        if bot_chat:
            bot = ChatBot(thread_id=str(self.chat_id))
            bot_response = bot.answer(data['body'])
            
            bot_message_data = {
                'user_sender': "bot",
                'chat': data['chat'],
                'body': bot_response
            }
            bot_message = await self.create_message(bot_message_data)
            if bot_message:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': bot_message.to_dict()
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

    @database_sync_to_async
    def edit_message(self, data):
        User = get_user_model()
        user = User.objects.get(username=data['user_sender'])
        message = Message.objects.get(pk=data['message_id'])
        new_body = data['body']
        serializer = MessageSerializer()
        validated_data = {
            'message': message,
            'body': new_body,
            'user_sender': user,
            'is_edited': True
        }
        updated_message_dict = serializer.update(validated_data)
        message.refresh_from_db()
        return message

    @database_sync_to_async
    def delete_message(self, data):
        User = get_user_model()
        user = User.objects.get(username=data['user_sender'])
        message = Message.objects.get(pk=data['message_id'])
        serializer = MessageSerializer()
        validated_data = {
            'message': message,
            'is_eliminated': True,
            'user_sender': user
        }
        eliminated_message_dict = serializer.eliminate(validated_data)
        message.refresh_from_db()
        return message