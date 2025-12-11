from django.shortcuts import render
from rest_framework import viewsets, status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.http.response import FileResponse
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.response import Response
from .serializers import FilesUserSerializer

# Create your views here.
class FilesUserViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, JSONParser]


    def create(self, request):
        """
        Upload files for a user
        POST /filesuser/
        Content-Type: multipart/form-data
        Body: {
            'files': [File, ...]
        }
        """
        try:
            user = request.user
            files = request.FILES.getlist('files', None)
            if not files:
                return Response({'detail': 'No files uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

            data = {
                'user': user.id,
                'files': files
            }

            serializer = FilesUserSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            created_files = serializer.save()
            return Response({
                'status': 'Success. Files uploaded correctly.',
                'files': [FilesUserSerializer(f).data for f in created_files]
            }, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as a:
            return Response({'detail': 'Validation error', 'error': a.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': 'Error processing request', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['GET'], detail=True, url_path='files', url_name='files')
    def files(self, request, pk=None):
        """
        Returns a file for a user
        GET /filesuser/{user_id}/files?filename=filename
        """
        try:
            user_id = pk
            filename = request.query_params.get('filename', None)
            data = {
                'user_id': user_id,
                'filename': filename
            }
            serializer = FilesUserSerializer()
            file_path = serializer.files(data)
            return FileResponse(open(file_path, 'rb'), status=status.HTTP_200_OK)
        except serializers.ValidationError as a:
            return Response({'detail': 'Validation error', 'error': a.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': 'Error processing request', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)