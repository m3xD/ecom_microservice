FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Chờ database sẵn sàng trước khi khởi động ứng dụng
CMD ["sh", "-c", "python manage.py collectstatic --noinput && \
                 python manage.py migrate && \
                 gunicorn cart_service.wsgi:application --bind 0.0.0.0:8000"]