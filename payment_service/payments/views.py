from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
import requests
from .models import Payment
from .serializers import PaymentSerializer
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    @action(detail=False, methods=['get'])
    def user_payments(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        payments = Payment.objects.filter(user_id=user_id).order_by('-created_at')
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def order_payment(self, request):
        order_id = request.query_params.get('order_id')
        if not order_id:
            return Response({"error": "order_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payment = Payment.objects.filter(order_id=order_id).latest('created_at')
            serializer = self.get_serializer(payment)
            return Response(serializer.data)
        except Payment.DoesNotExist:
            return Response({"error": "No payment found for this order"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def refund(self, request, pk=None):
        payment = self.get_object()

        if payment.payment_status != 'completed':
            return Response(
                {"error": "Only completed payments can be refunded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # In a real implementation, we would call the payment provider's refund API
        # For this demo, we'll just mark it as refunded
        payment.payment_status = 'refunded'
        payment.save()

        # Publish a refund event to RabbitMQ
        from payments.utils.messaging import publish_message
        publish_message('payment_events', 'payment.refunded', {
            'payment_id': payment.id,
            'order_id': str(payment.order_id),
            'user_id': payment.user_id,
            'amount': float(payment.amount)
        })

        serializer = self.get_serializer(payment)
        return Response(serializer.data)