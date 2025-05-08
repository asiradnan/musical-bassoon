import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listMyOrders } from '../slices/orderSlice';
import { Package, AlertCircle, CheckCircle, Truck, Clock } from 'lucide-react';

const OrderHistoryScreen = () => {
  const dispatch = useDispatch();
  
  const { orders, isLoading, error } = useSelector((state) => state.order);
  
  useEffect(() => {
    dispatch(listMyOrders());
  }, [dispatch]);
  
  // Get status icon
  const getStatusIcon = (status, isPaid, isDelivered) => {
    if (isDelivered) {
      return <CheckCircle size={16} className="text-green-600" />;
    }
    
    if (status === 'shipped') {
      return <Truck size={16} className="text-blue-600" />;
    }
    
    if (status === 'processing') {
      return <Clock size={16} className="text-amber-600" />;
    }
    
    if (!isPaid) {
      return <AlertCircle size={16} className="text-red-600" />;
    }
    
    return <Package size={16} className="text-gray-600" />;
  };
  
  // Get status text
  const getStatusText = (status, isPaid, isDelivered) => {
    if (isDelivered) {
      return 'Delivered';
    }
    
    if (status === 'shipped') {
      return 'Shipped';
    }
    
    if (status === 'processing') {
      return 'Processing';
    }
    
    if (!isPaid) {
      return 'Awaiting Payment';
    }
    
    return 'Pending';
  };
  
  // Get status class
  const getStatusClass = (status, isPaid, isDelivered) => {
    if (isDelivered) {
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
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="alert alert-danger flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to place your first order!
            </p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order._id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                            order.status,
                            order.isPaid,
                            order.isDelivered
                          )}`}
                        >
                          <span className="flex items-center">
                            {getStatusIcon(order.status, order.isPaid, order.isDelivered)}
                            <span className="ml-1">
                              {getStatusText(order.status, order.isPaid, order.isDelivered)}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/order/${order._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryScreen;