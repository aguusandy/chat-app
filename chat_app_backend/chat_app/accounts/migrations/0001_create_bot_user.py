from django.db import migrations
from django.contrib.auth import get_user_model

def create_bot_user(apps, schema_editor):
    User = get_user_model()
    if not User.objects.filter(username='bot').exists():
        User.objects.create(username='bot', password='')

def delete_bot_user(apps, schema_editor):
    User = get_user_model()
    User.objects.filter(username='bot').delete()

class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '__first__'),
    ]
    operations = [
        migrations.RunPython(create_bot_user, delete_bot_user),
    ]
