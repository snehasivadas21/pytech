from rest_framework.routers import DefaultRouter
from .views import OrderViewSet,CoursePurchaseViewSet

router = DefaultRouter()
router.register(r'purchase', CoursePurchaseViewSet, basename='course-purchase')
router.register(r'orders', OrderViewSet,basename='course-order')

urlpatterns = router.urls
