from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    @action(detail=False, methods=['get'])
    def user(self, request):
        user_id = request.query_params.get('user_id')
        if user_id is None:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        cart, created = Cart.objects.get_or_create(user_id=user_id)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    def create(self, request, *args, **kwargs):
        cart_id = request.data.get('cart')
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        # Check if item already exists in cart
        try:
            item = CartItem.objects.get(cart_id=cart_id, product_id=product_id)
            # Update quantity
            item.quantity += int(quantity)
            item.save()
            serializer = self.get_serializer(item)
            return Response(serializer.data)
        except CartItem.DoesNotExist:
            # Create new item
            return super().create(request, *args, **kwargs)

    @action(detail=False, methods=['delete'])
    def clear_cart(self, request):
        cart_id = request.query_params.get('cart_id')
        if cart_id:
            CartItem.objects.filter(cart_id=cart_id).delete()
            return Response({"message": "Cart cleared successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "cart_id is required"}, status=status.HTTP_400_BAD_REQUEST)