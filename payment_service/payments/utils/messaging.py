import pika
import json
import os
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def get_connection():
    credentials = pika.PlainCredentials(
        settings.RABBITMQ_USER,
        settings.RABBITMQ_PASS
    )
    parameters = pika.ConnectionParameters(
        host=settings.RABBITMQ_HOST,
        port=settings.RABBITMQ_PORT,
        credentials=credentials
    )
    return pika.BlockingConnection(parameters)


def publish_message(exchange_name, routing_key, message_body):
    try:
        connection = get_connection()
        channel = connection.channel()

        # Create the exchange if it doesn't exist
        channel.exchange_declare(exchange=exchange_name, exchange_type='topic', durable=True)

        # Convert message body to JSON
        message = json.dumps(message_body)

        # Publish the message
        channel.basic_publish(
            exchange=exchange_name,
            routing_key=routing_key,
            body=message,
            properties=pika.BasicProperties(
                delivery_mode=2,  # make message persistent
                content_type='application/json'
            )
        )

        connection.close()
        logger.info(f"Published message: {routing_key} - {message}")
    except Exception as e:
        logger.error(f"Failed to publish message: {e}")