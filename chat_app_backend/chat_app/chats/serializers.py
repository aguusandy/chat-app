

#  from apps.historia_clinica.estudios.models import
import re
from datetime import datetime
import random
import os

from django.db import transaction
from django.conf import settings

from rest_framework import serializers


from django.contrib.auth.models import User

from .models import Chat, ChatParticipant, Message, MessageState, State


class ChatSerializer(serializers.Serializer):
    chat_id = serializers.IntegerField(allow_null=True, required=False)
    chat_uuid = serializers.UUIDField(allow_null=True, required=False)
    date_created = serializers.DateTimeField(allow_null=True, required=False)
    is_eliminated = serializers.BooleanField(allow_null=True, required=False)
    date_eliminated = serializers.DateTimeField(allow_null=True, required=False)
    chat_name = serializers.CharField(allow_null=True, required=False)

    participants = serializers.ListField(child=serializers.DictField(), allow_empty=True, allow_null=True, required=False)
    
    def __init__(self, chat_id=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if chat_id:
            try:
                chat = Chat.objects.get(chat_id=chat_id)
                self.instance = chat
            except Chat.DoesNotExist:
                pass

    def validate(self, data:dict) -> dict:
        chat_id = data.get('chat_id', None)
        participants = data.get('participants', None)
        chat_participants = data.get('chat_participants', None)
        is_eliminated = data.get('is_eliminated', None)

        if participants is None or participants == []:
            raise serializers.ValidationError({'participants': "To create a Chat there must be some users."})
        
        participants_ids = [variable.get("user_id") for variable in participants] if participants else []
        participants_validated = []
        for participant_id in participants_ids:
            participants_validated.append(User.objects.get(pk=participant_id))
        
        if chat_id is not None:
            chat = Chat.objects.get(pk=chat_id)
            if chat is not None:            
                raise serializers.ValidationError({'chat_id': "The chat with this id is already created."})
            
            if is_eliminated is not None and chat.is_eliminated:
                raise serializers.ValidationError({'is_eliminated': "The chat is already eliminated."})

        if chat_participants is not None:
            chat_participants_ids = [variable.get("chat_par_id") for variable in chat_participants] if chat_participants else []

            chat_participants_validated = []
            if chat_participants_ids != []:
                for par_id in chat_participants_ids:
                    chat_participant = ChatParticipant.objects.get(pk=par_id)
                    if chat_participant is not None:
                        chat_participants_validated.append(chat_participant)
                
                if chat_participants_validated == []:
                    raise serializers.ValidationError({'participants': "To create a Chat there must be some validated users."})
        

        validated_data = {
            'chat': chat if chat is not None else None,
            'chat_participants_validated': chat_participants_validated if chat_participants_validated is not None else None,
            'participants_validated': participants_validated,
            'is_eliminated': is_eliminated,            
        }

        return validated_data
    

    def create(self, validated_data: dict) -> dict:
        participants = validated_data.get('participants_validated',None)
        chat_name = validated_data.get('chat_name', f"Chat of {', '.join([participant.user.username for participant in participants])}")

        with transaction.atomic():
            ''' 
                Create the Chat first, after the ChatParticipants
            '''
            chat = Chat.objects.create(
                is_eliminated = False,
                chat_name=chat_name
            )

            for participant in participants:
                data = {'user_id': participant.pk, 'chat_id': chat.pk}
                serializer = ChatParticipantSerializer(data=data)
                if serializer.is_valid():
                    data_created = serializer.create(validated_data=serializer.validated_data)                

        return chat.to_dict()

    
    def update(self, validated_data: dict) -> dict:
        chat = validated_data.get('chat', None)
        participants = validated_data.get('participants', None)
        chat_participants = validated_data.get('chat_participants', None)
        chat_name = validated_data.get('chat_name', None)
        
        if chat.is_eliminated == True:
            raise serializers.ValidationError({'chat_id': "The chat can't be updated because is already eliminated."})
        
        with transaction.atomic():
            if chat_name is not None:
                chat.chat_name = chat_name if chat.chat_name != chat_name else chat_name

            chat.save()

            for participant in participants:
                data = {'user_id': participant.pk, 'chat_id': chat.pk}
                serializer = ChatParticipantSerializer(data=data)
                if serializer.is_valid():
                    data_created = serializer.update(validated_data=serializer.validated_data)   
        return chat.to_dict()

    def eliminate(self, validated_data: Chat):
        chat = validated_data.get('chat', None)
        is_eliminated = validated_data.get('chat', None)

        if chat.is_eliminated == True:
            raise serializers.ValidationError({'chat_id': "The chat can't be eliminated because is already eliminated."})
        
        with transaction.atomic():
            chat.is_eliminated = True
            chat.date_eliminated = datetime.now()

            chat.save()
        return chat.to_dict()

    
    def to_representation(self, instance: Chat):
        representation = super().to_representation(instance)

        try:
            messages_data = instance.get_messages
            messages = [message.to_dict() for message in messages_data]
        except Exception as e:
            messages = []

        try:
            participants_data = instance.get_participants
            participants = [participant.to_dict() for participant in participants_data]
        except Exception as e:
            participants = []

        representation.update({
            'participants': participants,
            'messages': messages,            
        })

        return representation
    

class ChatParticipantSerializer(serializers.Serializer):
    chat_par_id = serializers.IntegerField(allow_null=True, required=False)
    user = serializers.IntegerField(allow_null=True, required=False)
    chat = serializers.IntegerField(allow_null=True, required=False)
    date_joined = serializers.DateTimeField(allow_null=True, required=False)

    def __init__(self, chat_par_id=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        if chat_par_id:
            try:
                chat_parts = ChatParticipant.objects.get(pk=chat_par_id)
                self.instance = chat_parts
            except ChatParticipant.DoesNotExist:
                pass

    def validate(self, data: dict) -> dict:
        user = data.get('user_id', None)
        chat = data.get('chat_id', None)

        if user is None:
            raise serializers.ValidationError({'user': "To create a Chat there must be some users."})
        
        user = User.objects.get(pk=user)
        if user is None:            
            raise serializers.ValidationError({'user': "The user field is not validated."})
        
        if chat is None:            
            raise serializers.ValidationError({'chat': "The chat is a required field, can't be null."})

        chat = Chat.objects.get(pk=chat)
        if chat is None:            
            raise serializers.ValidationError({'chat': "The chat field is not validated."})
        
        if chat.is_eliminated:
            raise serializers.ValidationError({'is_eliminated': "The chat is already eliminated."})

        validated_data = {
            'chat_validated': chat if chat is not None else None,
            'user_validated': user if user is not None else None
        }

        return validated_data
    

    def create(self, validated_data: dict) -> dict:
        chat_validated = validated_data.get('chat_validated',None)
        user_validated = validated_data.get('user_validated',None)

        with transaction.atomic():
            ''' 
                Create the Chat first, after the ChatParticipants
            '''
            chat_participant = ChatParticipant.objects.create(
                user=user_validated,
                chat=chat_validated
            )                

        return chat_participant.to_dict()
    
    def update(self, validated_data: dict) -> dict:
        user_id = validated_data.get('user_id', None)
        chat_id = validated_data.get('chat_id', None)

        if user_id is None:
            raise serializers.ValidationError({'user_id': "To update the parcipitand the user_id is required."})
        
        if chat_id is None:
            raise serializers.ValidationError({'chat_id': "To update the parcipitand the chat_id is required."})

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({'user': "The user doesn't exist or wasn't found."})

        try:
            chat = Chat.objects.get(pk=chat_id)
        except Chat.DoesNotExist:
            raise serializers.ValidationError({'chat': "The chat doesn't exist or wasn't found."})

        if chat.is_eliminated:
            raise serializers.ValidationError({'chat': "The chat can't be updated because is eliminated."})

        chat_participant = ChatParticipant.objects.filter(user=user, chat=chat).first()
        if chat_participant:
            chat_participant.delete()
            return {'detail': 'The participant was eliminated succesfully from the chat.'}
        else:
            chat_participant = ChatParticipant.objects.create(user=user, chat=chat)
            return chat_participant.to_dict()
    
    

class MessageSerializer(serializers.Serializer):
    message_id = serializers.IntegerField(allow_null=True, required=False)
    message_uuid = serializers.UUIDField(allow_null=True, required=False)
    chat = serializers.IntegerField(allow_null=True, required=False)
    user_sender = serializers.IntegerField(allow_null=True, required=False)
    body = serializers.CharField(allow_null=True, required=False)
    date_send = serializers.DateTimeField(allow_null=True, required=False)
    is_edited = serializers.BooleanField(allow_null=True, required=False)
    is_eliminated = serializers.BooleanField(allow_null=True, required=False)

    def __init__(self, message_id=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if message_id:
            try:
                message = Message.objects.get(message_id=message_id)
                self.instance = message
            except Message.DoesNotExist:
                pass

    def validate(self, data:dict) -> dict:
        message_id = data.get('message_id', None)
        message_uuid = data.get('message_uuid', None)
        chat = data.get('chat', None)
        user_sender = data.get('user_sender', None)
        body = data.get('body', None)
        is_edited = data.get('is_edited', None)
        is_eliminated = data.get('is_eliminated', None)

        if chat is None:
            raise serializers.ValidationError({'chat': "To send a message is needed a chat."})
        else:
            chat = Chat.objects.get(pk=chat)
        
        if user_sender is None:
            raise serializers.ValidationError({'user_sender': "To send a message is needed a user."})
        else:
            user_sender = User.objects.get(pk=user_sender)
        
        chat_participant = ChatParticipant.objects.get(chat=chat,user=user_sender)
        
        if chat_participant is None:
            raise serializers.ValidationError({'not_allowed': "The user has no permission to send messages in this chat."})
        
        if body is None:
            raise serializers.ValidationError({'body': "Empty messages are not allowed. Please type a text."})
        
        if message_id is not None:
            message = Message.objects.get(pk=message_id)
            if message is not None:            
                raise serializers.ValidationError({'message_id': "The message with this id is already sended."})
            
            if message.is_eliminated:
                raise serializers.ValidationError({'is_eliminated': "The message is already eliminated."})
        

        validated_data = {
            'chat': chat if chat is not None else None,
            'user_sender': user_sender if user_sender is not None else None,
            'body': body,
            'is_edited': is_edited if is_edited is not None else None,
            'is_eliminated': is_eliminated if is_eliminated is not None else None,
            'message': message if message is not None else None
        }

        return validated_data
    

    def create(self, validated_data: dict) -> dict:
        chat = validated_data.get('chat',None)
        user_sender = validated_data.get('user_sender',None)
        body = validated_data.get('body',None)

        with transaction.atomic():
            ''' 
                Creating the message
            '''
            message = Message.objects.create(
                chat=chat,
                user_sender=user_sender,
                body=body,
                is_edited=False,
                is_eliminated=False
            )
            
            message_state = MessageState.objects.create(
                state = State.objects.get(pk=1),
                message = message
            )       

        return message.to_dict()
    
    def update(self, validated_data: dict) -> dict:
        message = validated_data.get('message', None)
        body = validated_data.get('body',None)
        user_sender = validated_data.get('user_sender',None)
        is_edited = validated_data.get('is_edited', None)

        if message is None: 
            raise serializers.ValidationError({'message': "The message wasn't found or doesn't exists."})
        
        if message.user_sender != user_sender:
            raise serializers.ValidationError({'message': "Only the user that created the message can update it."})
        
        with transaction.atomic():
            if is_edited == True:
                message_state = MessageState.objects.create(
                    state = State.objects.get(pk=2),
                    message = message,
                    last_body = message.body
                )
                message.is_edited = True
                message.body = body
            message.save()

        return message.to_dict()
    
    def eliminate(self, validated_data: dict) -> dict:
        message = validated_data.get('message', None)
        is_eliminated = validated_data.get('is_eliminated', None)
        user_sender = validated_data.get('user_sender',None)

        if message is None: 
            raise serializers.ValidationError({'message': "The message wasn't found or doesn't exists."})
        
        if message.is_eliminated == True and is_eliminated == True:
            raise serializers.ValidationError({'message': "The message is eliminated and can't be update."})
        
        if message.user_sender != user_sender:
            raise serializers.ValidationError({'message': "Only the user that created the message can update it."})
        
        with transaction.atomic():
            if is_eliminated == True:
                message_state = MessageState.objects.create(
                    state = State.objects.get(pk=3),
                    message = message,
                    last_body = message.body
                )
                message.is_eliminated = True
                message.save()
        return message.to_dict()

    
    def to_representation(self, instance: Chat):
        representation = super().to_representation(instance)

        try:
            messages_data = instance.get_messages
            messages = [message.to_dict() for message in messages_data]
        except Exception as e:
            messages = []

        try:
            participants_data = instance.get_participants
            participants = [participant.to_dict() for participant in participants_data]
        except Exception as e:
            participants = []

        representation.update({
            'participants': participants,
            'messages': messages,            
        })

        return representation
    