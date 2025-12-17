

from rest_framework import serializers
from django.db import transaction
from django.conf import settings
from django.contrib.auth.models import User
import os, random
from .models import FilesUser

class FilesUserSerializer(serializers.ModelSerializer):
	user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
	filename = serializers.CharField(read_only=True)
	file_type = serializers.CharField(read_only=True)
	# files = serializers.ListField(child=serializers.FileField(), write_only=True, required=True)

	class Meta:
		model = FilesUser
		fields = ['id', 'filename', 'file_type', 'user', 'date_created', 'is_visible']
		read_only_fields = ['id', 'date_created']

	def validate(self, data):
		user = data.get('user')
		files = data.get('files')
		allowed_types = [
			"application/doc",
			"application/docx",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"application/msword",
			"application/pdf"
		]
		if not User.objects.filter(id=user.id).exists():
			raise serializers.ValidationError({'user': 'User does not exist.'})
		
		if not files or len(files) == 0:
			raise serializers.ValidationError({'files': "At least one file must be provided."})
		for f in files:
			if hasattr(f, 'content_type') and f.content_type not in allowed_types:
				raise serializers.ValidationError({'files': f"File type not allowed: {f.name}"})
		validated_data = {
			'user': user,
			'files': files

		}
		return validated_data

	def create(self, validated_data):
		user = validated_data['user']
		files = validated_data.pop('files')
		created_files = []
		media_path = os.path.join(settings.MEDIA_ROOT, 'user_files/')
		os.makedirs(media_path, exist_ok=True)
		with transaction.atomic():
			for archivo in files:
				filename = archivo.name.replace(" ", "_")
				file_path = os.path.join(media_path, filename)
				if os.path.exists(file_path):
					# filename = f'{str(random.random()).split(".")[1]}_{archivo.name}'
					file_path = os.path.join(media_path, filename)
				with open(file_path, 'wb+') as f:
					for chunk in archivo.chunks():
						f.write(chunk)
				file_type = getattr(archivo, 'content_type', '')
				file_instance = FilesUser.objects.create(
					user=user,
					filename=filename,
					file_type=file_type
				)
				created_files.append(file_instance)
		return created_files

	def get_file(self, data: dict) -> str:
		filename = data.get('filename', None)
		user = data.get('user', None)
		if not filename:
			raise serializers.ValidationError({'filename': "Filename not specified."})
		if not user:
			raise serializers.ValidationError({'user': "Field required. Cannot be null."})
		
		file_qs = FilesUser.objects.filter(user=user, filename=filename, is_visible=True)
		if not file_qs.exists():
			raise serializers.ValidationError({'file': "File not found for this user."})
		media_path = os.path.join(settings.MEDIA_ROOT, 'user_files', filename)
		if not os.path.exists(media_path):
			raise serializers.ValidationError({'media_path': "File does not exist."})
		return media_path
	
	def files(self, user: User) -> list:
		if not user:
			raise serializers.ValidationError({'user': "User required. Cannot be null."})
		file_qs = FilesUser.objects.filter(user=user, is_visible=True)
		files_list = []
		files_list.append({
			'filename': f.filename,
			'file_type': f.file_type,
			'date_created': f.date_created
		} for f in file_qs)

		return files_list

	def to_representation(self, instance):
		rep = super().to_representation(instance)
		rep['user'] = instance.user.username if instance.user else None
		return rep

    