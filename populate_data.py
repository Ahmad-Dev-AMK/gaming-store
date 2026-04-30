import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

import django

django.setup()

from shop.models import Category, Product

laptops, _ = Category.objects.get_or_create(name="Laptops")
pc_parts, _ = Category.objects.get_or_create(name="PC Parts")

Product.objects.get_or_create(
    name="Asus TUF A15",
    defaults={"price": 999.99, "stock": 10, "image_url": "https://example.com/asus-tuf-a15.jpg", "category_fk": laptops},
)
Product.objects.get_or_create(
    name="MSI Katana 15",
    defaults={"price": 1099.99, "stock": 8, "image_url": "https://example.com/msi-katana-15.jpg", "category_fk": laptops},
)
Product.objects.get_or_create(
    name="NVIDIA RTX 4050 GPU",
    defaults={"price": 349.99, "stock": 15, "image_url": "https://example.com/rtx-4050.jpg", "category_fk": pc_parts},
)
Product.objects.get_or_create(
    name="16GB DDR5 RAM",
    defaults={"price": 79.99, "stock": 25, "image_url": "https://example.com/16gb-ddr5-ram.jpg", "category_fk": pc_parts},
)
Product.objects.get_or_create(
    name="1TB NVMe SSD",
    defaults={"price": 89.99, "stock": 20, "image_url": "https://example.com/1tb-nvme-ssd.jpg", "category_fk": pc_parts},
)
