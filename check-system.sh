#!/bin/bash

echo "Checking API Gateway..."
curl -s http://localhost:8080/ || echo "API Gateway is not responding"

echo -e "\nChecking User Service..."
docker-compose exec user_service python -c "import sys; import django; django.setup(); from django.db import connection; connection.ensure_connection(); print('Connection successful!')" || echo "User Service database connection failed"

echo -e "\nChecking Product Service..."
docker-compose exec product_service python -c "import sys; import django; django.setup(); from django.db import connection; connection.ensure_connection(); print('Connection successful!')" || echo "Product Service database connection failed"

echo -e "\nChecking Cart Service..."
docker-compose exec cart_service python -c "import sys; import django; django.setup(); from django.db import connection; connection.ensure_connection(); print('Connection successful!')" || echo "Cart Service database connection failed"

echo -e "\nChecking Order Service..."
docker-compose exec order_service python -c "import sys; import django; django.setup(); from django.db import connection; connection.ensure_connection(); print('Connection successful!')" || echo "Order Service database connection failed"

echo -e "\nChecking Payment Service..."
docker-compose exec payment_service python -c "import sys; import django; django.setup(); from django.db import connection; connection.ensure_connection(); print('Connection successful!')" || echo "Payment Service database connection failed"

echo -e "\nChecking RabbitMQ..."
docker-compose exec rabbitmq rabbitmqctl status | grep -q "RabbitMQ" && echo "RabbitMQ is running" || echo "RabbitMQ is not responding"

echo -e "\nSystem check complete!"