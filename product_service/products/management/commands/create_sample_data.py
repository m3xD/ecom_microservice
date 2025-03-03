from django.core.management.base import BaseCommand
from products.models import Category, Product
from django.utils.text import slugify
from faker import Faker
import random
from django.core.files.base import ContentFile
import requests
from io import BytesIO
from django.core.files import File

fake = Faker()


class Command(BaseCommand):
    help = 'Creates sample data for products app'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Creating sample data...'))

        # Create categories
        categories = [
            'Electronics', 'Clothing', 'Books', 'Home & Kitchen',
            'Sports & Outdoors', 'Beauty & Personal Care', 'Toys & Games'
        ]

        category_objects = []
        for category_name in categories:
            category = Category.objects.create(
                name=category_name,
                description=fake.paragraph()
            )
            category_objects.append(category)
            self.stdout.write(f"Created category: {category_name}")

        # Create products for each category
        for category in category_objects:
            num_products = random.randint(10, 20)

            for _ in range(num_products):
                name = fake.unique.catch_phrase()
                price = round(random.uniform(10.0, 1000.0), 2)
                stock = random.randint(0, 100)

                product = Product.objects.create(
                    name=name,
                    description='\n'.join(fake.paragraphs(nb=3)),
                    price=price,
                    stock=stock,
                    category=category
                )

                # Try to add a placeholder image from placeholder.com
                try:
                    width = random.randint(200, 500)
                    height = random.randint(200, 500)
                    image_url = f"https://via.placeholder.com/{width}x{height}"

                    response = requests.get(image_url)
                    if response.status_code == 200:
                        img_temp = BytesIO(response.content)
                        file_name = f"{slugify(name)}.jpg"
                        product.image.save(file_name, File(img_temp), save=True)
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"Failed to add image for {name}: {e}"))

                self.stdout.write(f"Created product: {name} in {category.name}")

        self.stdout.write(self.style.SUCCESS(
            f'Successfully created {Category.objects.count()} categories and {Product.objects.count()} products'))