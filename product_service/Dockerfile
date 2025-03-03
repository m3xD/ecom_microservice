FROM python:3.10-slim

WORKDIR /app

# Cài đặt các dependencies cho Pillow
RUN apt-get update && apt-get install -y \
    gcc \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Media directory
RUN mkdir -p /app/media/products

# Chờ database sẵn sàng trước khi khởi động ứng dụng
CMD ["sh", "-c", "python manage.py collectstatic --noinput && \
                 python manage.py migrate && \
                 gunicorn product_service.wsgi:application --bind 0.0.0.0:8000"]