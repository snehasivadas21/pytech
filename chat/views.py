from rest_framework import viewsets, permissions
from .models import SupportRoom, SupportMessage
from .serializers import SupportRoomSerializer, SupportMessageSerializer
from .permissions import IsInstructorOrReadOnly

class SupportRoomViewSet(viewsets.ModelViewSet):
    queryset = SupportRoom.objects.all()
    serializer_class = SupportRoomSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorOrReadOnly]

    def get_queryset(self):
        return self.request.user.support_rooms.all()

    def perform_create(self, serializer):
        serializer.save()

class SupportMessageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SupportMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        room_id = self.kwargs.get("room_id")
        return SupportMessage.objects.filter(room_id=room_id).order_by('timestamp')
