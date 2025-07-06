from rest_framework.routers import DefaultRouter
from .views import BotChatViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'chatbot', BotChatViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
