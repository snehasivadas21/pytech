from rest_framework import viewsets, permissions
from .models import Order,CoursePurchase
from .serializers import OrderSerializer,CoursePurchaseSerializer
from users.permissions import IsStudentUser


class CoursePurchaseViewSet(viewsets.ModelViewSet):
    serializer_class =  CoursePurchaseSerializer
    permission_classes =[permissions.IsAuthenticated,IsStudentUser]

    def get_queryset(self):
        return CoursePurchase.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save()

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user, status='pending')
