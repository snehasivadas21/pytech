from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupportRoomViewSet, SupportMessageViewSet

router = DefaultRouter()
router.register(r'rooms', SupportRoomViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('rooms/<int:room_id>/messages/', SupportMessageViewSet.as_view({'get': 'list'})),
]
