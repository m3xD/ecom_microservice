from rest_framework import serializers
from .models import Cart, CartItem
import requests
from django.conf import settings


class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product_id', 'quantity', 'price', 'product']
        read_only_fields = ['price']

    def get_product(self, obj):
        # Fetch product details from Product Service
        try:
            response = requests.get(f"{settings.PRODUCT_SERVICE_URL}/api/products/{obj.product_id}/")
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            # Log the error
            print(f"Error fetching product: {e}")
            return None

    def create(self, validated_data):
        # Get current price from Product Service
        try:
            response = requests.get(f"{settings.PRODUCT_SERVICE_URL}/api/products/{validated_data['product_id']}/")
            if response.status_code == 200:
                product_data = response.json()
                validated_data['price'] = product_data['price']
            else:
                raise serializers.ValidationError("Product not found or unavailable")
        except Exception as e:
            raise serializers.ValidationError(f"Error fetching product: {e}")

        return super().create(validated_data)


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user_id', 'created_at', 'updated_at', 'items', 'total']

    def get_total(self, obj):
        return sum(item.price * item.quantity for item in obj.items.all())