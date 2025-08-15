from django.shortcuts import render

from django.http.response import FileResponse

from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, JSONParser

from .models import Chat, ChatParticipant

from .serializers import ChatSerializer, MessageSerializer


class ChatViewSet(viewsets.ViewSet):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, JSONParser]

    def retrieve(self, request, pk=None):
        '''
            Return the individual chat with the information about it.
            This information includes, the participants (users), messages and their attachments
            Endpoint: /chats/{pk}

        '''
        chat_id = pk

        try:
            serializer = self.serializer_class(chat_id=chat_id)
            data = serializer.data

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(f"Error {e}", status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        '''
            Return all chat that the participate the user
            Endpoint: /chats

        '''
        user_chats = Chat.objects.filter(
            chat_participant__user=request.user
        ).exclude(is_eliminated=True)
    
        serialized_chats = []
        for chat in user_chats:
            serializer = self.serializer_class(instance=chat)
            serialized_chats.append(serializer.data)
        
        return Response({ 'chats':serialized_chats }, status=status.HTTP_200_OK)

    def create(self, request):
        """
            Endpoint that recibes the chat name and the list of users that will participate of the chat
            The request.user is added to the list
        """
        try:
            chat_name = request.data.get('chat_name', None)
            participants = request.data.get('participants', None)
            user = request.user

            participants.append({'user_id': user.pk})

            data = {
                'chat_name': chat_name,
                'participants': participants,
            }
            print(f"data: {data}")

            serialized = ChatSerializer(data=data)
            if serialized.is_valid():
                print(f"valitated data {serialized.validated_data}")
                data_create = serialized.create(validated_data=serialized.validated_data)
                return Response({"status": "Chat created succesfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"detail": "Failed at the moment of creation.", "error": serialized.errors}, status=status.HTTP_400_BAD_REQUEST)
        except serializers.ValidationError as a:
            return Response({'detail': "Failed processing the data.", 'error': a.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response( {'detail': "Failed processing the peticion ", 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(methods=['POST'], detail=True, url_path='eliminate_chat', url_name='eliminate_chat')
    def eliminate_chat(self, request, pk=None):
        """
            Endpoint that recibes the chat id and deleted logically setting the flad 'is_eliminated'
        """
        chat_id = pk
        try:
            is_eliminated = request.data.get('is_eliminated', None)
            data = {
                'chat_id': chat_id,
                'is_eliminated': is_eliminated
            }
            serialized = self.serializer_class(data=data)
            if serialized.is_valid():
                data_eliminated = serialized.eliminate(validated_data=serialized.validated_data)
                return Response({"status": "Chat deleted succesfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(f"Error {e}", status=status.HTTP_400_BAD_REQUEST)
    
    
    @action(methods=['POST'], detail=True, url_path='upload_participants', url_name='upload_participants')
    def upload_participants(self, request, pk=None):
        """
            Endpoint that recibes the chat id and the list of users that will participate of the chat
            the serializers will loop in that list, and remove the user is this was in the list before or
            add is this wasn't in the list
        """
        chat_id = pk
        try:
            chat_name = request.data.get('chat_name', None)
            participants = request.data.get('participants', None)
            user = request.user
            data = {
                'chat_id': chat_id,
                'chat_name': chat_name,
                'participants': participants,
            }

            serialized = self.serializer_class(data=data)
            if serialized.is_valid():
                print(f"serialized: {serialized.validated_data}")
                data_updated = serialized.update(validated_data=serialized.validated_data)
                return Response({"status": "Chat updated succesfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"detail": "Failed at the moment of creation.", "error": serialized.errors}, status=status.HTTP_400_BAD_REQUEST)
        except serializers.ValidationError as a:
            return Response({'detail': "Failed processing the data.", 'error': a.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response( {'detail': "Failed processing the peticion ", 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # @action(methods=['GET'], detail=True, url_path='files', url_name='files')
    # def files(self, request, pk=None):
    #     return None
    

class MessageViewSet(viewsets.ViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, pk=None):
        '''
            Return the individual message with the information about it.
        '''
        message_id = pk

        try:
            serializer = self.serializer_class(message_id=message_id)
            data = serializer.data

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(f"Error {e}", status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        """
            Endpoint that recibes the body of the message, the chat and the user who send the message
        """
        try:
            chat = request.data.get('chat', None)
            body = request.data.get('body', None)
            user = request.user

            data = {
                'chat': chat,
                'user_sender': user,
                'body': body,
            }

            serialized = MessageSerializer(data=data)

            if serialized.is_valid():
                data_create = serialized.create(validated_data=serialized.validated_data)
                return Response({"status": "Message sended succesfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"detail": "Failed at the moment of creation.", "error": serialized.errors}, status=status.HTTP_400_BAD_REQUEST)
        except serializers.ValidationError as a:
            return Response({'detail': "Failed processing the data.", 'error': a.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response( {'detail': "Failed processing the peticion ", 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(methods=['POST'], detail=True, url_path='upload_message', url_name='upload_message')
    def upload_message(self, request, pk=None):
        """
            Endpoint that recibes the new body of the message, the chat and the user 
        """
        message_id = pk
        try:
            body = request.data.get('body', None)
            is_edited = request.data.get('is_edited', None)
            user = request.user

            data = {
                'message_id': message_id,
                'body': body,
                'user_sender': user,
                'is_edited': is_edited,
            }

            serialized = self.serializer_class(data=data)
            if serialized.is_valid():
                date_updated = serialized.update(validated_data=serialized.validated_data)
                return Response({"status": "Message updated succesfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"detail": "Failed at the moment of creation.", "error": serialized.errors}, status=status.HTTP_400_BAD_REQUEST)
        except serializers.ValidationError as a:
            return Response({'detail': "Failed processing the data.", 'error': a.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response( {'detail': "Failed processing the peticion ", 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(methods=['POST'], detail=True, url_path='eliminate_message', url_name='eliminate_message')
    def eliminate_message(self, request, pk=None):
        message_id = pk
        try:
            is_eliminated = request.data.get('is_eliminated', None)
            user = request.user

            data = {
                'message_id': message_id,
                'is_edited': is_eliminated,
                'user_sender': user,
            }
            serialized = self.serializer_class(data=data)
            if serialized.is_valid():
                date_eliminated = serialized.eliminate(validated_data=serialized.validated_data)
                return Response({"status": "Message deleted succesfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(f"Error {e}", status=status.HTTP_400_BAD_REQUEST)