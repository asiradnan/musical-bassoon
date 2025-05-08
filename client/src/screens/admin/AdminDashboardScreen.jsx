import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Users,
  Package,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Clock,
} from 'lucide-react';

const AdminDashboardScreen = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    bookings: 0,
    products: 0,
    revenue: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would fetch this data from your API
        // For this demo, we'll simulate the data
        
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Simulate dashboard stats
        setStats({
          users: 124,
          orders: 87,
          bookings: 53,
          products: 215,
          revenue: 12450,
        });
        
        // Simulate recent orders
        setRecentOrders([
          {
            _id: '1',
            user: { name: 'John Doe' },
            totalPrice: 249.99,
            isPaid: true,
            status: 'shipped',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '2',
            user: { name: 'Jane Smith' },
            totalPrice: 129.95,
            isPaid: true,
            status: 'processing',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '3',
            user: { name: 'Mike Johnson' },
            totalPrice: 599.99,
            isPaid: false,
            status: 'pending',
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '4',
            user: { name: 'Sarah Williams' },
            totalPrice: 349.50,
            isPaid: true,
            status: 'delivered',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '5',
            user: { name: 'David Brown' },
            totalPrice: 89.99,
            isPaid: true,
            status: 'processing',
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]);
        
        // Simulate recent bookings
        setRecentBookings([
          {
            _id: '1',
            user: { name: 'Alex Turner' },
            room: 'Studio A',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '14:00',
            endTime: '16:00',
            isPaid: true,
          },
          {
            _id: '2',
            user: { name: 'Emily Clark' },
            room: 'Practice Room 2',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '10:00',
            endTime: '12:00',
            isPaid: true,
          },
          {
            _id: '3',
            user: { name: 'James Wilson' },
            room: 'Studio B',
            date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '18:00',
            endTime: '21:00',
            isPaid: false,
          },
          {
            _id: '4',
            user: { name: 'Olivia Martinez' },
            room: 'Practice Room 1',
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '16:00',
            endTime: '18:00',
            isPaid: true,
          },
          {
            _id: '5',
            user: { name: 'Daniel Lee' },
            room: 'Studio A',
            date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '09:00',
            endTime: '13:00',
            isPaid: true,
          },
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Get status class for orders
  const getOrderStatusClass = (status, isPaid) => {
    if (status === 'delivered') {
      return 'bg-green-100 text-green-800';
    }
    
    if (status === 'shipped') {
      return 'bg-blue-100 text-blue-800';
    }
    
    if (status === 'processing') {
      return 'bg-amber-100 text-amber-800';
    }
    
    if (!isPaid) {
      return 'bg-red-100 text-red-800';
    }
    
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="text-sm text-gray-500">Welcome back, {user?.name}</div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">Loading dashboard data...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <h3 className="text-2xl font-bold">{stats.users}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Orders</p>
                    <h3 className="text-2xl font-bold">{stats.orders}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-4">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Bookings</p>
                    <h3 className="text-2xl font-bold">{stats.bookings}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mr-4">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <h3 className="text-2xl font-bold">${stats.revenue.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to="/admin/products"
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <ShoppingBag size={24} className="text-blue-600 mb-2" />
                  <span>Manage Products</span>
                </Link>
                
                <Link
                  to="/admin/orders"
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <Package size={24} className="text-green-600 mb-2" />
                  <span>Manage Orders</span>
                </Link>
                
                <Link
                  to="/admin/bookings"
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <Calendar size={24} className="text-purple-600 mb-2" />
                  <span>Manage Bookings</span>
                </Link>
                
                <Link
                  to="/admin/users"
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <Users size={24} className="text-amber-600 mb-2" />
                  <span>Manage Users</span>
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Recent Orders</h2>
                  <Link to="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm">
                    View All
                  </Link>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{order.user.name}</p>
                          <p className="text-gray-500 text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${order.totalPrice.toFixed(2)}</p>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getOrderStatusClass(
                              order.status,
                              order.isPaid
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Upcoming Bookings */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
                  <Link to="/admin/bookings" className="text-blue-600 hover:text-blue-800 text-sm">
                    View All
                  </Link>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <div key={booking._id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{booking.user.name}</p>
                          <p className="text-gray-500 text-sm">
                            {booking.room} - {new Date(booking.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {booking.startTime} - {booking.endTime}
                          </p>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              booking.isPaid
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardScreen;