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
            Endpoint: 

        '''
        chat_id = pk

        try:
            print(f"entro al retrieve {chat_id}")
            serializer = self.serializer_class(chat_id=chat_id)
            data = serializer.data

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(f"Error {e}", status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        '''
            Return all chat that the participate the user
            Endpoint: 

        '''
        user_chats = Chat.objects.filter(
            chat_participant__user=request.user
        ).exclude(is_eliminated=True)
    
        serialized_chats = []
        for chat in user_chats:
            serializer = self.serializer_class(instance=chat)
            serialized_chats.append(serializer.data)
        
        return Response(serialized_chats)

    def create(self, request):
        """
            Endpoint that recibes the chat name and the list of users that will participate of the chat
            The request.user is added to the list
        """
        try:
            chat_name = request.data.get('chat_name', None)
            participants = request.data.get('participants', None)
            user = request.user

            participants.append({'user': user.pk})

            data = {
                'chat_name': chat_name,
                'participants': participants,
            }

            serialized = ChatSerializer(data=data)

            if serialized.is_valid():
                data_create = serialized.create(validated_data=serialized.validated_data)
                return Response({"status": "Chat created succesfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"detail": "Failed at the moment of creation.", "error": serialized.errors}, status=status.HTTP_400_BAD_REQUEST)
        except serializers.ValidationError as a:
            return Response({'detail': "Failed processing the data.", 'error': a.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response( {'detail': "Failed processing the peticion ", 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
    @action(methods=['POST'], detail=True, url_path='upload_participants', url_name='upload_participants')
    def upload_participants(self, request, pk=None):
        return None

    # @action(methods=['GET'], detail=True, url_path='files', url_name='files')
    # def files(self, request, pk=None):
    #     return None
    

class MessageViewSet(viewsets.ViewSet):

    def retrieve(self, request, pk=None):
        return None

    def create(self, request):
        """
            Endpoint that recibes the chat name and the list of users that will participate of the chat
            The request.user is added to the list
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
        return None



class ChatParticipantViewSet(viewsets.ViewSet):

    def create(self, request):
        return None
    
    @action(methods=['POST'], detail=True, url_path='upload_participants', url_name='upload_participants')
    def upload_participants(self, request, pk=None):
        return None