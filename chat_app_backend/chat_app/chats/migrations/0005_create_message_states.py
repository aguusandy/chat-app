from django.db import migrations

def create_initial_states(apps, schema_editor):
    State = apps.get_model('chats', 'State')
    State.objects.bulk_create([
        State(description='Sended'),
        State(description='Readed'),
        State(description='Edited'),
        State(description='Deleted'),
    ])

class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0004_chatparticipant_is_owner'),
    ]

    operations = [
        migrations.RunPython(create_initial_states),
    ]