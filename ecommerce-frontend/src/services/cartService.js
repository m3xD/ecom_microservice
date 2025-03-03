import api from './api';

const cartService = {
  getUserCart: async (userId) => {
    return await api.get(`/carts/user/?user_id=${userId}`);
  },

  addToCart: async (cartId, productId, quantity = 1) => {
    return await api.post('/cart-items/', {
      cart: cartId,
      product_id: productId,
      quantity: quantity
    });
  },

  updateCartItem: async (itemId, quantity) => {
    return await api.patch(`/cart-items/${itemId}/`, { quantity });
  },

  removeFromCart: async (itemId) => {
    return await api.delete(`/cart-items/${itemId}/`);
  },

  clearCart: async (cartId) => {
    return await api.delete(`/cart-items/clear_cart/?cart_id=${cartId}`);
  }
};

export default cartService;