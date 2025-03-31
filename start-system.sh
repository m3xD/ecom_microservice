#!/bin/bash
set -e

echo "Building all services..."
docker compose build

echo "Starting all services..."
docker compose up -d

echo "Waiting for services to start (30s)..."
sleep 30

echo "Applying migrations for all services..."
docker compose exec user-service python manage.py makemigrations users
docker compose exec user-service python manage.py migrate

docker compose exec product-service python manage.py makemigrations products
docker compose exec product-service python manage.py migrate

docker compose exec cart-service python manage.py makemigrations cart
docker compose exec cart-service python manage.py migrate

docker compose exec order-service python manage.py makemigrations orders
docker compose exec order-service python manage.py migrate

docker compose exec payment-service python manage.py makemigrations payments
docker compose exec payment-service python manage.py migrate

echo "Creating sample data..."
docker compose exec product-service python manage.py create_sample_data

echo "Creating superuser for admin access..."
echo "Please follow the prompts to create a superuser for the User Service:"
docker compose exec user-service python manage.py createsuperuser

echo "System startup complete!"
echo "API Gateway is available at: http://localhost:8080"
echo "RabbitMQ Management UI is available at: http://localhost:15672 (guest/guest)"
echo "Static/Media files are available at: http://localhost:8081"