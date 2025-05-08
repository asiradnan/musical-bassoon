import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ProfileScreen from './screens/ProfileScreen';
import BookingScreen from './screens/BookingScreen';
import BookingHistoryScreen from './screens/BookingHistoryScreen';
import BookingDetailsScreen from './screens/BookingDetailsScreen';
import ProductScreen from './screens/ProductScreen';
import ProductDetailsScreen from './screens/ProductDetailsScreen';
import CartScreen from './screens/CartScreen';
import WishlistScreen from './screens/WishlistScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import BlogScreen from './screens/BlogScreen';
import BlogDetailsScreen from './screens/BlogDetailsScreen';
import ContactScreen from './screens/ContactScreen';
import FaqScreen from './screens/FaqScreen';
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import AdminUserListScreen from './screens/admin/AdminUserListScreen';
import AdminUserEditScreen from './screens/admin/AdminUserEditScreen';
import AdminProductListScreen from './screens/admin/AdminProductListScreen';
import AdminProductEditScreen from './screens/admin/AdminProductEditScreen';
import AdminOrderListScreen from './screens/admin/AdminOrderListScreen';
import AdminBookingListScreen from './screens/admin/AdminBookingListScreen';
import AdminBlogListScreen from './screens/admin/AdminBlogListScreen';
import AdminBlogEditScreen from './screens/admin/AdminBlogEditScreen';
import NotFoundScreen from './screens/NotFoundScreen';
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';
import LiveChat from './components/LiveChat';
import { checkUserSession } from './slices/authSlice';
import "./index.css"

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserSession());
  }, [dispatch]);

  return (
    <>
      <Header />
      <main className="py-3 min-h-[80vh]">
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
            <Route path="/resetpassword/:resetToken" element={<ResetPasswordScreen />} />
            
            <Route path="/profile" element={<PrivateRoute><ProfileScreen /></PrivateRoute>} />
            
            <Route path="/booking" element={<BookingScreen />} />
            <Route path="/booking/history" element={<PrivateRoute><BookingHistoryScreen /></PrivateRoute>} />
            <Route path="/booking/:id" element={<PrivateRoute><BookingDetailsScreen /></PrivateRoute>} />
            
            <Route path="/products" element={<ProductScreen />} />
            <Route path="/products/category/:category" element={<ProductScreen />} />
            <Route path="/product/:id" element={<ProductDetailsScreen />} />
            
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/wishlist" element={<PrivateRoute><WishlistScreen /></PrivateRoute>} />
            <Route path="/shipping" element={<PrivateRoute><ShippingScreen /></PrivateRoute>} />
            <Route path="/payment" element={<PrivateRoute><PaymentScreen /></PrivateRoute>} />
            <Route path="/placeorder" element={<PrivateRoute><PlaceOrderScreen /></PrivateRoute>} />
            <Route path="/order/:id" element={<PrivateRoute><OrderScreen /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><OrderHistoryScreen /></PrivateRoute>} />
            
            <Route path="/blog" element={<BlogScreen />} />
            <Route path="/blog/category/:category" element={<BlogScreen />} />
            <Route path="/blog/:id" element={<BlogDetailsScreen />} />
            
            <Route path="/contact" element={<ContactScreen />} />
            <Route path="/faq" element={<FaqScreen />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardScreen /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUserListScreen /></AdminRoute>} />
            <Route path="/admin/user/:id/edit" element={<AdminRoute><AdminUserEditScreen /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProductListScreen /></AdminRoute>} />
            <Route path="/admin/product/:id/edit" element={<AdminRoute><AdminProductEditScreen /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrderListScreen /></AdminRoute>} />
            <Route path="/admin/bookings" element={<AdminRoute><AdminBookingListScreen /></AdminRoute>} />
            <Route path="/admin/blogs" element={<AdminRoute><AdminBlogListScreen /></AdminRoute>} />
            <Route path="/admin/blog/:id/edit" element={<AdminRoute><AdminBlogEditScreen /></AdminRoute>} />
            
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </div>
      </main>
      <Footer />
      <LiveChat />
    </>
  );
};

export default App;