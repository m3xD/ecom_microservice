from rest_framework import serializers
from .models import Payment, PaymentDetail
import requests
from django.conf import settings
import uuid


class PaymentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentDetail
        fields = ['card_number', 'cardholder_name', 'expiry_date']


class PaymentSerializer(serializers.ModelSerializer):
    payment_details = PaymentDetailSerializer(write_only=True, required=False)
    details = PaymentDetailSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'order_id', 'user_id', 'amount', 'payment_method',
                  'payment_status', 'transaction_id', 'created_at',
                  'updated_at', 'payment_details', 'details']
        read_only_fields = ['payment_status', 'transaction_id', 'created_at', 'updated_at']

    def create(self, validated_data):
        payment_details_data = validated_data.pop('payment_details', None)

        # Create the payment record
        payment = Payment.objects.create(**validated_data)

        # Process the payment with the chosen payment gateway
        payment_processor = self._get_payment_processor(payment.payment_method)
        result = payment_processor.process_payment(payment, payment_details_data)

        if result.get('success'):
            payment.payment_status = 'completed'
            payment.transaction_id = result.get('transaction_id')
            payment.save()

            # Update order payment status at Order Service
            self._update_order_payment_status(payment.order_id)

            # Store payment details if provided
            if payment_details_data:
                PaymentDetail.objects.create(
                    payment=payment,
                    card_number=payment_details_data.get('card_number', '')[-4:] if payment_details_data.get(
                        'card_number') else None,
                    cardholder_name=payment_details_data.get('cardholder_name'),
                    expiry_date=payment_details_data.get('expiry_date'),
                    payment_provider_response=result
                )
        else:
            payment.payment_status = 'failed'
            payment.save()

        return payment

    def _get_payment_processor(self, payment_method):
        from payments.services.payment_processors import (
            CreditCardProcessor,
            PayPalProcessor,
            BankTransferProcessor
        )

        processors = {
            'credit_card': CreditCardProcessor(),
            'paypal': PayPalProcessor(),
            'bank_transfer': BankTransferProcessor(),
        }

        return processors.get(payment_method, CreditCardProcessor())

    def _update_order_payment_status(self, order_id):
        try:
            requests.post(f"{settings.ORDER_SERVICE_URL}/api/orders/{order_id}/mark_as_paid/")
        except Exception as e:
            print(f"Failed to update order payment status: {e}")