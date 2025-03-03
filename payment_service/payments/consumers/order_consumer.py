import pika
import json
import django
import os
import sys
import logging
from threading import Thread

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'payment_service.settings')
django.setup()

from django.conf import settings
from ..models import Payment

logger = logging.getLogger(__name__)


def get_connection():
    credentials = pika.PlainCredentials(
        settings.RABBITMQ_USER,
        settings.RABBITMQ_PASS
    )
    parameters = pika.ConnectionParameters(
        host=settings.RABBITMQ_HOST,
        port=settings.RABBITMQ_PORT,
        credentials=credentials,
        heartbeat=600,
        blocked_connection_timeout=300
    )
    return pika.BlockingConnection(parameters)


def order_callback(ch, method, properties, body):
    try:
        message = json.loads(body)
        logger.info(f"Received order event: {message}")

        # Process different order events
        routing_key = method.routing_key

        if routing_key == 'order.cancelled':
            handle_order_cancellation(message)

        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        logger.error(f"Error processing order message: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)


def handle_order_cancellation(message):
    order_id = message.get('order_id')

    # Find any completed payments for this order and refund them
    try:
        payments = Payment.objects.filter(order_id=order_id, payment_status='completed')
        for payment in payments:
            payment.payment_status = 'refunded'
            payment.save()
            logger.info(f"Refunded payment {payment.id} due to order cancellation")
    except Exception as e:
        logger.error(f"Failed to process order cancellation refund: {e}")


def start_consumer():
    try:
        # Connect to RabbitMQ
        connection = get_connection()
        channel = connection.channel()

        # Declare the exchange
        channel.exchange_declare(exchange='order_events', exchange_type='topic', durable=True)

        # Create a queue for this service
        result = channel.queue_declare(queue='payment_service_orders', durable=True)
        queue_name = result.method.queue

        # Bind the queue to the exchange with routing keys
        channel.queue_bind(exchange='order_events', queue=queue_name, routing_key='order.cancelled')

        # Set prefetch count to limit messages per consumer
        channel.basic_qos(prefetch_count=1)

        # Set up the consumer
        channel.basic_consume(queue=queue_name, on_message_callback=order_callback)

        logger.info('Order consumer started. Waiting for messages...')
        channel.start_consuming()
    except Exception as e:
        logger.error(f"Consumer error: {e}")
        if 'connection' in locals() and connection and connection.is_open:
            connection.close()


def run_consumer():
    consumer_thread = Thread(target=start_consumer)
    consumer_thread.daemon = True
    consumer_thread.start()