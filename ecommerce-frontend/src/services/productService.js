import api from './api';

const productService = {
  getAllProducts: async (params) => {
    return await api.get('/products/', { params });
  },

  getProductById: async (id) => {
    return await api.get(`/products/${id}/`);
  },

  getCategories: async () => {
    return await api.get('/categories/');
  },

  getProductsByCategory: async (categoryId) => {
    return await api.get(`/products/by_category/?category_id=${categoryId}`);
  },

  searchProducts: async (query) => {
    return await api.get(`/products/?search=${query}`);
  }
};

export default productService;