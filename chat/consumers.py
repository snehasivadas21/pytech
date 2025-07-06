import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import SupportMessage,SupportRoom
from channels.db import database_sync_to_async

class SupportChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.group_name = f'support_room_{self.room_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        user = self.scope['user']
        await self.save_message(user, self.room_id, message)

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'chat_message',
                'user': user.username,
                'message': message,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'user': event['user'],
            'message': event['message'],
        }))

    @database_sync_to_async
    def save_message(self, user, room_id, message):
        room = SupportRoom.objects.get(id=room_id)
        SupportMessage.objects.create(room=room, sender=user, content=message)
