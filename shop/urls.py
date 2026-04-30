from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, OrderViewSet, AdminUserAnalyticsViewSet, UserRegisterViewSet, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()

# تسجيل المنتجات والأقسام 
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')

# تسجيل الطلبات 
router.register(r'orders', OrderViewSet, basename='order')

# Registration and Admin Analytics
router.register(r'auth/register', UserRegisterViewSet, basename='register')
router.register(r'admin/analytics', AdminUserAnalyticsViewSet, basename='admin-analytics')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]