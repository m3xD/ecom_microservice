from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
import requests
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from django.conf import settings


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(detail=False, methods=['get'])
    def user_orders(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        orders = Order.objects.filter(user_id=user_id).order_by('-created_at')
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status == 'pending' or order.status == 'processing':
            order.status = 'cancelled'
            order.save()
            serializer = self.get_serializer(order)

            # Publish order cancelled event to RabbitMQ
            from orders.utils.messaging import publish_message
            publish_message('order_events', 'order.cancelled', {
                'order_id': str(order.order_id),
                'user_id': order.user_id
            })

            return Response(serializer.data)
        return Response(
            {"error": "Cannot cancel order that has been shipped or delivered"},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['post'])
    def mark_as_paid(self, request, pk=None):
        order = self.get_object()
        order.payment_status = True
        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data)