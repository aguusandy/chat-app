from django.contrib import admin
from .models import Chat, ChatParticipant, Message, State, MessageState, MessageAttachment


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ('chat_id', 'chat_name', 'chat_uuid', 'date_created', 'is_eliminated', 'date_eliminated')
    list_filter = ('is_eliminated', 'date_created', 'date_eliminated')
    search_fields = ('chat_name', 'chat_uuid')
    readonly_fields = ('chat_id', 'chat_uuid', 'date_created')
    ordering = ('-date_created',)
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('chat_name',)
        }),
        ('Estado', {
            'fields': ('is_eliminated', 'date_eliminated')
        }),
    )


@admin.register(ChatParticipant)
class ChatParticipantAdmin(admin.ModelAdmin):
    list_display = ('chat_par_id', 'user', 'chat', 'date_joined')
    list_filter = ('date_joined', 'chat')
    search_fields = ('user__username', 'user__email', 'chat__chat_name')
    readonly_fields = ('chat_par_id', 'date_joined')
    ordering = ('-date_joined',)
    
    fieldsets = (
        ('Información del Participante', {
            'fields': ('user', 'chat')
        }),
    )


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('message_id', 'user_sender', 'chat', 'body', 'date_send', 'is_edited', 'is_eliminated')
    list_filter = ('is_edited', 'is_eliminated', 'date_send', 'chat')
    search_fields = ('body', 'user_sender__username', 'chat__chat_name')
    readonly_fields = ('message_id', 'message_uuid', 'date_send')
    ordering = ('-date_send',)
    
    fieldsets = (
        ('Información del Mensaje', {
            'fields': ('body',)
        }),
        ('Relaciones', {
            'fields': ('chat', 'user_sender')
        }),
        ('Estado', {
            'fields': ('is_edited', 'is_eliminated')
        }),
    )


@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ('state_id', 'description')
    search_fields = ('description',)
    ordering = ('state_id',)
    readonly_fields = ('state_id',)
    
    fieldsets = (
        ('Información del Estado', {
            'fields': ('description',)
        }),
    )


@admin.register(MessageState)
class MessageStateAdmin(admin.ModelAdmin):
    list_display = ('message_state_id', 'state', 'message', 'date_updated')
    list_filter = ('state', 'date_updated')
    search_fields = ('message__body', 'state__description')
    readonly_fields = ('message_state_id', 'date_updated')
    ordering = ('-date_updated',)
    
    fieldsets = (
        ('Información del Estado del Mensaje', {
            'fields': ('state', 'message')
        }),
        ('Contenido', {
            'fields': ('last_body',)
        }),
    )


@admin.register(MessageAttachment)
class MessageAttachmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'message', 'file_type', 'date_uploaded')
    list_filter = ('file_type', 'date_uploaded')
    search_fields = ('message__body', 'file_url')
    readonly_fields = ('id', 'date_uploaded')
    ordering = ('-date_uploaded',)
    
    fieldsets = (
        ('Información del Archivo', {
            'fields': ('message', 'file_url', 'file_type')
        }),
    )
