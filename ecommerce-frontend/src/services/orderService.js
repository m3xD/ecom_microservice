import api from './api';

const orderService = {
  createOrder: async (orderData) => {
    return await api.post('/orders/', orderData);
  },

  getUserOrders: async (userId) => {
    return await api.get(`/orders/user_orders/?user_id=${userId}`);
  },

  getOrderById: async (id) => {
    return await api.get(`/orders/${id}/`);
  },

  cancelOrder: async (id) => {
    return await api.post(`/orders/${id}/cancel/`);
  }
};

export default orderService;