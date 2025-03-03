from rest_framework import serializers
from .models import Order, OrderItem
import requests
from django.conf import settings


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'product_name', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'order_id', 'user_id', 'status', 'total_amount',
                  'shipping_address', 'billing_address', 'payment_status',
                  'created_at', 'updated_at', 'items']
        read_only_fields = ['order_id', 'payment_status', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Get the cart data from Cart Service
        user_id = validated_data.get('user_id')
        try:
            response = requests.get(f"{settings.CART_SERVICE_URL}/api/carts/user/?user_id={user_id}")
            if response.status_code != 200:
                raise serializers.ValidationError("Could not retrieve cart data")

            cart_data = response.json()
            if not cart_data.get('items'):
                raise serializers.ValidationError("Cart is empty")

            # Create the order first
            order = Order.objects.create(**validated_data)

            # Create order items from cart items
            for item in cart_data['items']:
                OrderItem.objects.create(
                    order=order,
                    product_id=item['product_id'],
                    product_name=item['product']['name'],
                    quantity=item['quantity'],
                    price=item['price']
                )

            # Clear the cart after creating the order
            requests.delete(f"{settings.CART_SERVICE_URL}/api/cart-items/clear_cart/?cart_id={cart_data['id']}")

            # Publish order created event to RabbitMQ
            self._publish_order_created_event(order)

            return order
        except requests.RequestException as e:
            raise serializers.ValidationError(f"Service communication error: {str(e)}")

    def _publish_order_created_event(self, order):
        # This is a placeholder for actual message publishing
        # In a real implementation, we would use a proper message broker client
        from orders.utils.messaging import publish_message

        order_data = {
            'order_id': str(order.order_id),
            'user_id': order.user_id,
            'total_amount': float(order.total_amount),
            'status': order.status
        }

        publish_message('order_events', 'order.created', order_data)