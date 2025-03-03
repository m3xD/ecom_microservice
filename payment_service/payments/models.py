from django.db import models


class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('credit_card', 'Credit Card'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer'),
    ]

    order_id = models.UUIDField()
    user_id = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.id} - Order {self.order_id} - {self.payment_status}"


class PaymentDetail(models.Model):
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='details')
    card_number = models.CharField(max_length=4, null=True, blank=True)  # Last 4 digits only
    cardholder_name = models.CharField(max_length=100, null=True, blank=True)
    expiry_date = models.CharField(max_length=7, null=True, blank=True)
    payment_provider_response = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Details for Payment {self.payment_id}"