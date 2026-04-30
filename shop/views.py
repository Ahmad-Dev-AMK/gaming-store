from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from django.db.models import Sum, Q
from django.db.models.functions import Coalesce
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
import requests
from .models import Category, Product, ProductImage, Order, UserLoginHistory
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer, UserAnalyticsSerializer, UserRegisterSerializer, CustomTokenObtainPairSerializer

def parse_user_agent(ua_string):
    browser = 'Unknown'
    device = 'Desktop'
    if not ua_string: return browser, device
    
    if 'Mobi' in ua_string or 'Android' in ua_string:
        device = 'Mobile'
    if 'Tablet' in ua_string or 'iPad' in ua_string:
        device = 'Tablet'
        
    if 'Chrome' in ua_string and 'Edg' not in ua_string:
        browser = 'Chrome'
    elif 'Safari' in ua_string and 'Chrome' not in ua_string:
        browser = 'Safari'
    elif 'Firefox' in ua_string:
        browser = 'Firefox'
    elif 'Edg' in ua_string:
        browser = 'Edge'
    
    return browser, device

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().annotate(
        sales_count=Coalesce(Sum('orderitem__quantity'), 0)
    ).order_by('-id')
    serializer_class = ProductSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_create(self, serializer):
        product = serializer.save()
        for file in self.request.FILES.getlist('additional_images'):
            ProductImage.objects.create(product=product, image=file)

    def perform_update(self, serializer):
        product = serializer.save()
        for file in self.request.FILES.getlist('additional_images'):
            ProductImage.objects.create(product=product, image=file)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            username_or_email = request.data.get('username')
            user = User.objects.filter(Q(username=username_or_email) | Q(email=username_or_email)).first()
            
            ip_address = request.META.get('REMOTE_ADDR')
            user_agent = request.META.get('HTTP_USER_AGENT')
            browser, device = parse_user_agent(user_agent)
            
            country = None
            city = None
            if ip_address and ip_address != '127.0.0.1':
                try:
                    geo = requests.get(f"http://ip-api.com/json/{ip_address}", timeout=2).json()
                    if geo.get("status") == "success":
                        country = geo.get("country")
                        city = geo.get("city")
                except:
                    pass

            UserLoginHistory.objects.create(
                user=user,
                ip_address=ip_address,
                user_agent=user_agent,
                browser=browser,
                device=device,
                country=country,
                city=city
            )
            response.data['is_staff'] = user.is_staff
        return response

class AdminUserAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserAnalyticsSerializer
    permission_classes = [IsAdminUser]

class UserRegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer