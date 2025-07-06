from django.db import models
from courses.models import Course
from django.conf import settings

# Create your models here.

class SupportRoom(models.Model):
    name = models.CharField(max_length=255)
    course = models.ForeignKey(Course,on_delete=models.CASCADE,null=True,blank=True)
    is_group = models.BooleanField(default=False)
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL,related_name='support_rooms')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class SupportMessage(models.Model):
    room = models.ForeignKey(SupportRoom,on_delete=models.CASCADE,related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)  
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} : {self.content[:30]}"
    
