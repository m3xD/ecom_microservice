FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Tạo migrations trước khi khởi động ứng dụng
CMD ["sh", "-c", "python manage.py makemigrations users && \
                 python manage.py migrate && \
                 python manage.py collectstatic --noinput && \
                 gunicorn user_service.wsgi:application --bind 0.0.0.0:8000"]