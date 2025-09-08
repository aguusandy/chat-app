from django.db import migrations


def create_bot_user(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    if not User.objects.filter(username='bot').exists():
        User.objects.create(username='bot', password='')

def delete_bot_user(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    User.objects.filter(username='bot').delete()

class Migration(migrations.Migration):
    dependencies = [
        ('auth', '0001_initial'),
        ('accounts', '__first__'),
    ]
    operations = [
        migrations.RunPython(create_bot_user, delete_bot_user),
    ]
