import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState = {
  bookings: [],
  booking: null,
  availableSlots: [],
  isLoading: false,
  success: false,
  error: null,
};

// Check availability
export const checkAvailability = createAsyncThunk(
  'booking/checkAvailability',
  async ({ room, date }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/bookings/availability?room=${room}&date=${date}`
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

// Create booking
export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData, { getState, rejectWithValue }) => {
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

      const { data } = await axios.post('/api/bookings', bookingData, config);
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

// Get booking details
export const getBookingDetails = createAsyncThunk(
  'booking/getBookingDetails',
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

      const { data } = await axios.get(`/api/bookings/${id}`, config);
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

// Pay booking
export const payBooking = createAsyncThunk(
  'booking/payBooking',
  async ({ bookingId, paymentResult }, { getState, rejectWithValue }) => {
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
        `/api/bookings/${bookingId}/pay`,
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

// Cancel booking
export const cancelBooking = createAsyncThunk(
  'booking/cancelBooking',
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

      const { data } = await axios.put(`/api/bookings/${id}/cancel`, {}, config);
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

// Get my bookings
export const listMyBookings = createAsyncThunk(
  'booking/listMyBookings',
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

      const { data } = await axios.get('/api/bookings/mybookings', config);
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

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    resetBooking: (state) => {
      state.booking = null;
      state.success = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Availability
      .addCase(checkAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableSlots = action.payload;
      })
      .addCase(checkAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.booking = action.payload;
        toast.success('Booking created successfully');
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Get Booking Details
      .addCase(getBookingDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBookingDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.booking = action.payload;
      })
      .addCase(getBookingDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Pay Booking
      .addCase(payBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(payBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.booking = action.payload;
        toast.success('Payment successful');
      })
      .addCase(payBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Cancel Booking
      .addCase(cancelBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.booking = action.payload;
        toast.success('Booking cancelled successfully');
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // List My Bookings
      .addCase(listMyBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(listMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(listMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetBooking, clearError } = bookingSlice.actions;

export default bookingSlice.reducer;