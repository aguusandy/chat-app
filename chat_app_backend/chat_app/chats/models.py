from django.db import models
from django.contrib.auth.models import User
import uuid
from datetime import datetime, timedelta

# Create your models here.

class Chat(models.Model):
    chat_id = models.AutoField(primary_key=True)
    chat_uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    date_created = models.DateTimeField(auto_now_add=True)
    is_eliminated = models.BooleanField(default=False, blank=True, null=True)
    date_eliminated = models.DateTimeField(blank=True, null=True)
    chat_name = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'chat'
        
    def __str__(self):
        return f"Chat {self.chat_name}"
    
    @property
    def get_messages(self):
        """Returns messages for this chat excluding is_eliminated = True"""
        messages = Message.objects.filter(chat=self).exclude(is_eliminated=True)
        return messages
    
    @property
    def get_all_messages(self):
        """Returns all messages for this chat, this include the eliminated messages"""
        messages = Message.objects.filter(chat=self)
        return messages
    
    @property
    def get_participants(self):
        """Returns all the user that participates in the chat"""
        participants = ChatParticipant.objects.filter(chat=self)
        return participants
    
    def to_dict(self) -> dict:
        '''
        Convert the model to dict
        '''
        return {
            'chat_id': self.chat_id,
            'chat_uuid': self.chat_uuid, 
            'date_created': self.date_created.strftime("%d/%m/%Y %H:%M") if self.date_created else None,
            'chat_name': self.chat_name,
            'is_eliminated': self.is_eliminated or False, 
            'date_eliminated': self.date_eliminated.strftime("%d/%m/%Y %H:%M") if self.date_eliminated else None,
        }
    

class ChatParticipant(models.Model):
    chat_par_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=False, blank=False, related_name='users_participant')
    chat = models.ForeignKey(Chat, on_delete=models.PROTECT, null=False, blank=False, related_name='chat_participant')
    date_joined = models.DateTimeField(auto_now_add=True, editable=False)

    class Meta:
        db_table = 'chat_participants'

    def __str__(self):
        return f"Participant {self.user.username} - Chat {self.chat.chat_name}"
    
    def to_dict(self) -> dict:
        '''
        Convert the model to dict
        '''
        return {
            'chat_par_id': self.chat_par_id,
            'user': { 'username': self.user.username, 'user_id': self.user.id }, 
            'chat': self.chat.chat_id,
            'date_joined': self.date_joined.strftime("%d/%m/%Y %H:%M") if self.date_joined else None,
        }


class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    message_uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    chat = models.ForeignKey(Chat, on_delete=models.PROTECT, null=False, blank=False, related_name='messages_chat')
    user_sender = models.ForeignKey(User, on_delete=models.PROTECT, null=False, blank=False, related_name='messages_user' )
    body = models.CharField(max_length=500, blank=False, null=False)
    date_send = models.DateTimeField(auto_now_add=True, editable=False)
    is_edited = models.BooleanField(default=False, null=True, blank=True)
    is_eliminated = models.BooleanField(default=False, null=True, blank=True)

    class Meta: 
        db_table = 'messages'
    
    def __str__(self):
        return f"Message of {self.user_sender.username} at {self.date_send}: {self.body}"
    
    def to_dict(self) -> dict:
        '''
        Convert the model to dict
        '''
        return {
            'message_id': self.message_id,
            'message_uuid': self.message_uuid, 
            'chat_id': self.chat.chat_id,
            'user_sender': self.user_sender.username,
            'body': self.body,
            'date_send': self.date_send.strftime("%d/%m/%Y %H:%M") if self.date_send else None,
            'is_edited': self.is_edited or False, 
            'is_eliminated': self.is_eliminated or False,
        }
    

class State(models.Model):
    state_id = models.AutoField(primary_key=True)
    description = models.CharField(max_length=128, null=False, blank=False)

    class Meta:
        db_table = 'states_messages'

    def __str__(self):
        return self.description
    

class MessageState(models.Model):
    message_state_id = models.AutoField(primary_key=True)
    state = models.ForeignKey(State, on_delete=models.PROTECT, blank=False, null=False, related_name='states_message')
    message = models.ForeignKey(Message, on_delete=models.PROTECT, blank=False, null=False, related_name='message_states')
    date_updated = models.DateTimeField(auto_now_add=True)
    last_body = models.CharField(max_length=500, editable=False, null=True, blank=True)

    class Meta:
        db_table = 'messages_states'

    def __str__(self):
        return f"State {self.state.description} of Message {self.message.message_id}"
    

class MessageAttachment(models.Model):
    id = models.AutoField(primary_key=True)
    message = models.ForeignKey(Message, on_delete=models.PROTECT, null=False, blank=True, related_name='message_attachments')
    file_url = models.TextField(null=False, blank=False)
    file_type = models.TextField(null=False, blank=False)
    date_uploaded = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'messages_attachments'

    def __str__(self):
        return f"file of the message {self.message.message_id}: {self.file_url}"