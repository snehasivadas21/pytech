from rest_framework import serializers
from .models import SupportRoom, SupportMessage
from django.contrib.auth import get_user_model

User = get_user_model()

class SupportMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = SupportMessage
        fields = ['id', 'sender_name', 'content', 'timestamp']

class SupportRoomSerializer(serializers.ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)
    messages = SupportMessageSerializer(many=True, read_only=True)

    class Meta:
        model = SupportRoom
        fields = ['id', 'name', 'course', 'is_group', 'participants', 'created_at', 'messages']
