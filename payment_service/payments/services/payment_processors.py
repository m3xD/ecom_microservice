import uuid
import time
import random
from abc import ABC, abstractmethod


class PaymentProcessor(ABC):
    @abstractmethod
    def process_payment(self, payment, payment_details):
        pass


class CreditCardProcessor(PaymentProcessor):
    def process_payment(self, payment, payment_details):
        # This is a mock implementation - in a real system, this would
        # interact with a credit card processing API like Stripe

        # Simulate processing time
        time.sleep(1)

        # Generate a random transaction ID
        transaction_id = str(uuid.uuid4())

        # For demo purposes, randomly succeed or fail
        success = random.random() > 0.2  # 80% success rate

        if success:
            return {
                'success': True,
                'transaction_id': transaction_id,
                'message': 'Payment processed successfully',
                'timestamp': time.time()
            }
        else:
            return {
                'success': False,
                'message': 'Payment processing failed',
                'error_code': 'card_declined',
                'timestamp': time.time()
            }


class PayPalProcessor(PaymentProcessor):
    def process_payment(self, payment, payment_details):
        # This is a mock implementation - in a real system, this would
        # interact with the PayPal API

        # Simulate processing time
        time.sleep(1.5)

        # Generate a random transaction ID with PayPal format
        transaction_id = f"PAY-{uuid.uuid4().hex[:16].upper()}"

        # For demo purposes, randomly succeed or fail
        success = random.random() > 0.1  # 90% success rate

        if success:
            return {
                'success': True,
                'transaction_id': transaction_id,
                'message': 'PayPal payment processed successfully',
                'timestamp': time.time()
            }
        else:
            return {
                'success': False,
                'message': 'PayPal payment processing failed',
                'error_code': 'payment_rejected',
                'timestamp': time.time()
            }


class BankTransferProcessor(PaymentProcessor):
    def process_payment(self, payment, payment_details):
        # Bank transfers typically take time to clear
        # Generate a random transaction ID with bank format
        transaction_id = f"BNK{int(time.time())}-{random.randint(1000, 9999)}"

        # Bank transfers are created as pending since they need verification
        return {
            'success': True,  # We mark it as success since the transfer was initiated
            'transaction_id': transaction_id,
            'message': 'Bank transfer initiated and pending verification',
            'status': 'pending',
            'timestamp': time.time()
        }