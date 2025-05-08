import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, Search, AlertCircle, Filter, Eye, CheckCircle, Truck, Clock } from 'lucide-react';

const AdminOrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Status options
  const statusOptions = [
    'All',
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Not Paid',
  ];
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would fetch this data from your API
        // For this demo, we'll simulate the data
        
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Simulate orders data
        const simulatedOrders = [
          {
            _id: '1',
            user: { _id: '1', name: 'John Doe' },
            totalPrice: 249.99,
            isPaid: true,
            paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            isDelivered: false,
            status: 'shipped',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '2',
            user: { _id: '2', name: 'Jane Smith' },
            totalPrice: 129.95,
            isPaid: true,
            paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            isDelivered: false,
            status: 'processing',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '3',
            user: { _id: '3', name: 'Mike Johnson' },
            totalPrice: 599.99,
            isPaid: false,
            isDelivered: false,
            status: 'pending',
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '4',
            user: { _id: '4', name: 'Sarah Williams' },
            totalPrice: 349.50,
            isPaid: true,
            paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            isDelivered: true,
            deliveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'delivered',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '5',
            user: { _id: '5', name: 'David Brown' },
            totalPrice: 89.99,
            isPaid: true,
            paidAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            isDelivered: false,
            status: 'processing',
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '6',
            user: { _id: '6', name: 'Emily Clark' },
            totalPrice: 199.99,
            isPaid: true,
            paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            isDelivered: true,
            deliveredAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'delivered',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '7',
            user: { _id: '7', name: 'Daniel Lee' },
            totalPrice: 149.99,
            isPaid: false,
            isDelivered: false,
            status: 'pending',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        
        setOrders(simulatedOrders);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to fetch orders');
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Handle search and filter
  const filteredOrders = orders.filter((order) => {
    // Search by order ID or customer name
    const searchMatch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    let statusMatch = true;
    if (filterStatus && filterStatus !== 'All') {
      if (filterStatus === 'Not Paid') {
        statusMatch = !order.isPaid;
      } else {
        statusMatch = order.status.toLowerCase() === filterStatus.toLowerCase();
      }
    }
    
    return searchMatch && statusMatch;
  });
  
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
  
  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // In a real app, you would make an API call to update the order status
      // For this demo, we'll just update the state
      
      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
                isDelivered: newStatus === 'delivered',
                deliveredAt: newStatus === 'delivered' ? new Date().toISOString() : order.deliveredAt,
              }
            : order
        )
      );
      
      // Show success message (would use toast in a real app)
      alert(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      // Show error message (would use toast in a real app)
      alert('Failed to update order status');
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Orders</h1>
          <Link to="/admin/dashboard" className="btn btn-outline">
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 flex items-center">
            <Package size={20} className="text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">Order Management</h2>
          </div>
          
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search by order ID or customer name..."
                  className="form-control pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
              </div>
              
              <div className="flex items-center">
                <Filter size={18} className="text-gray-500 mr-2" />
                <select
                  className="form-control"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : error ? (
            <div className="p-6">
              <div className="alert alert-danger flex items-center">
                <AlertCircle className="mr-2" size={20} />
                {error}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid
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
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.isPaid ? (
                          <span className="text-green-600">
                            {new Date(order.paidAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-red-600">Not Paid</span>
                        )}
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
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/order/${order._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye size={18} />
                          </Link>
                          
                          <select
                            className="form-control py-0 text-sm"
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            disabled={!order.isPaid}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderListScreen;