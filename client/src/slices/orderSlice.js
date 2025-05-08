import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { clearCartItems } from './cartSlice';

const initialState = {
  orders: [],
  order: null,
  isLoading: false,
  success: false,
  error: null,
};

// Create order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (order, { getState, dispatch, rejectWithValue }) => {
    try {
      const {
        auth: { user },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/orders', order, config);
      
      dispatch(clearCartItems());
      
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get order details
export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (id, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { user },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/orders/${id}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Pay order
export const payOrder = createAsyncThunk(
  'order/payOrder',
  async ({ orderId, paymentResult }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { user },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/orders/${orderId}/pay`,
        paymentResult,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get my orders
export const listMyOrders = createAsyncThunk(
  'order/listMyOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { user },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get('/api/orders/myorders', config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.order = null;
      state.success = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.order = action.payload;
        toast.success('Order placed successfully');
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Get Order Details
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Pay Order
      .addCase(payOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
        toast.success('Payment successful');
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // List My Orders
      .addCase(listMyOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(listMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(listMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetOrder, clearError } = orderSlice.actions;

export default orderSlice.reducer;