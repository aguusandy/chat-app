from django.db import models

# Create your models here.
class FilesUser(models.Model):
    id = models.AutoField(primary_key=True)
    filename = models.CharField(max_length=255, null=False, blank=False)
    file_type = models.CharField(max_length=50, null=False, blank=False)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, null=False, blank=False, related_name='files_user', db_column='user_id')
    date_created = models.DateTimeField(auto_now_add=True)
    is_visible = models.BooleanField(default=True)


    class Meta:
        db_table = "files_user"
        verbose_name_plural = "Files Users"

    @classmethod
    def get_estudios(cls, q_user):
        return cls.objects\
            .filter(user=q_user, is_visible=True)\
            .order_by('-date_created') 

