import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

const initialState = {
  products: [],
  product: null,
  categories: [],
  isLoading: false,
  error: null
};

// Get all products
export const getProducts = createAsyncThunk(
  'products/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get product by ID
export const getProductById = createAsyncThunk(
  'products/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get all categories
export const getCategories = createAsyncThunk(
  'products/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get products by category
export const getProductsByCategory = createAsyncThunk(
  'products/getByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsByCategory(categoryId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all products cases
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch products';
      })
      
      // Get product by ID cases
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch product details';
      })
      
      // Get categories cases
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch categories';
      })
      
      // Get products by category cases
      .addCase(getProductsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch products by category';
      });
  }
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;