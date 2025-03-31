from fastapi import FastAPI, Request
import httpx
import os
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="E-Commerce API Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép tất cả origins trong môi trường dev
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép tất cả methods
    allow_headers=["*"],  # Cho phép tất cả headers
)
# d1084638881b
USER_SERVICE = os.getenv("USER_SERVICE_URL", "http://user-service:8000")
PRODUCT_SERVICE = os.getenv("PRODUCT_SERVICE_URL", "http://product-service:8000")
CART_SERVICE = os.getenv("CART_SERVICE_URL", "http://cart-service:8000")
ORDER_SERVICE = os.getenv("ORDER_SERVICE_URL", "http://order-service:8000")
PAYMENT_SERVICE = os.getenv("PAYMENT_SERVICE_URL", "http://payment-service:8000")


@app.get("/")
async def root():
    return {"message": "E-Commerce API Gateway"}


@app.api_route("/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy_request(service: str, path: str, request: Request):
    service_map = {
        "users": USER_SERVICE,
        "products": PRODUCT_SERVICE,
        "cart": CART_SERVICE,
        "orders": ORDER_SERVICE,
        "payments": PAYMENT_SERVICE
    }

    if service not in service_map:
        return {"error": "Service not found"}

    target_url = f"{service_map[service]}/{service}/{path}"

    # Get the request body if any
    body = await request.body()

    # Get request headers
    headers = dict(request.headers)
    headers.pop('host', None)  # Remove host header

    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=request.method,
            url=target_url,
            data=body,
            headers=headers,
            params=request.query_params
        )

        return response.json()