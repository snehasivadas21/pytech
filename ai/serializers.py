from rest_framework import serializers
from .models import BotChat

class BotChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = BotChat
        fields = ['id', 'user','course', 'question', 'response', 'created_at']
        read_only_fields = ['user', 'response', 'created_at']
