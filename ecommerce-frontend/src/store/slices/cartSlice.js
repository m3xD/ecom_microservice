import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';

const initialState = {
  cart: null,
  isLoading: false,
  error: null
};

// Get user cart
export const getUserCart = createAsyncThunk(
  'cart/getUserCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await cartService.getUserCart(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ cartId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart(cartId, productId, quantity);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update cart item
export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (itemId, { rejectWithValue }) => {
    try {
      await cartService.removeFromCart(itemId);
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (cartId, { rejectWithValue }) => {
    try {
      await cartService.clearCart(cartId);
      return cartId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get user cart cases
      .addCase(getUserCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch cart';
      })
      
      // Add to cart cases
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add item to cart';
      })
      
      // Update cart item cases
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update cart item';
      })
      
      // Remove from cart cases
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to remove item from cart';
      })
      
      // Clear cart cases
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.cart = { ...state.cart, items: [] };
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to clear cart';
      });
  }
});

export const { reset } = cartSlice.actions;
export default cartSlice.reducer;