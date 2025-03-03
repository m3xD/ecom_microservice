FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Tạo script khởi động cho service chính và consumer
RUN echo '#!/bin/bash \n\
# Khởi động consumer trong background \n\
python -c "from payments.consumers.order_consumer import run_consumer; run_consumer()" & \n\
# Khởi động service chính \n\
python manage.py collectstatic --noinput && \
python manage.py migrate && \
gunicorn payment_service.wsgi:application --bind 0.0.0.0:8000 \n\
' > /app/start.sh && chmod +x /app/start.sh

# Chờ database và RabbitMQ sẵn sàng trước khi khởi động ứng dụng
CMD ["/app/start.sh"]