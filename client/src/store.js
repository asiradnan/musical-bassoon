import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import bookingReducer from './slices/bookingSlice';
import blogReducer from './slices/blogSlice';
import wishlistReducer from './slices/wishlistSlice';
import chatReducer from './slices/chatSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    order: orderReducer,
    booking: bookingReducer,
    blog: blogReducer,
    wishlist: wishlistReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;