from django.contrib import admin
from .models import Category, Product, Order, OrderItem, UserLoginHistory

# تسجيل الأقسام والمنتجات
admin.site.register(Category)
admin.site.register(Product)

# إعداد واجهة الطلبات بداخل لوحة التحكم بشكل احترافي
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'created_at', 'total_price']
    inlines = [OrderItemInline]

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'product', 'quantity', 'price']

@admin.register(UserLoginHistory)
class UserLoginHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'ip_address', 'login_timestamp']
    search_fields = ['user__username', 'ip_address']
    list_filter = ['login_timestamp']