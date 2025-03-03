import api from './api';

const paymentService = {
  processPayment: async (paymentData) => {
    return await api.post('/payments/', paymentData);
  },

  getUserPayments: async (userId) => {
    return await api.get(`/payments/user_payments/?user_id=${userId}`);
  },

  getOrderPayment: async (orderId) => {
    return await api.get(`/payments/order_payment/?order_id=${orderId}`);
  },

  requestRefund: async (paymentId) => {
    return await api.post(`/payments/${paymentId}/refund/`);
  }
};

export default paymentService;