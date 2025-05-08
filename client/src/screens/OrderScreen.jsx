import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, payOrder } from '../slices/orderSlice';
import { AlertCircle, ArrowLeft, CheckCircle, Truck, Package, CreditCard } from 'lucide-react';

const OrderScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const [sdkReady, setSdkReady] = useState(false);
  
  const { order, isLoading, error } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);
  
  // PayPal SDK setup (simulated)
  useEffect(() => {
    const addPayPalScript = () => {
      // In a real app, you would load the PayPal SDK here
      // For this demo, we'll just simulate it
      setTimeout(() => {
        setSdkReady(true);
      }, 1000);
    };
    
    if (order && !order.isPaid) {
      addPayPalScript();
    }
  }, [order]);
  
  // Handle payment success
  const successPaymentHandler = () => {
    // Simulate payment result
    const paymentResult = {
      id: Math.random().toString(36).substring(2, 15),
      status: 'COMPLETED',
      update_time: new Date().toISOString(),
      payer: {
        email_address: user.email,
      },
    };
    
    dispatch(payOrder({ orderId: id, paymentResult }));
  };
  
  // Get order status step
  const getOrderStep = () => {
    if (!order) return 0;
    if (order.status === 'delivered') return 4;
    if (order.status === 'shipped') return 3;
    if (order.status === 'processing') return 2;
    if (order.isPaid) return 1;
    return 0;
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/orders" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={16} className="mr-1" />
            Back to Orders
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Order Details</h1>
        
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="alert alert-danger flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        ) : !order ? (
          <div className="alert alert-danger flex items-center">
            <AlertCircle className="mr-2" size={20} />
            Order not found
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Order #{order._id.substring(0, 8)}</h2>
                  <span className="text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-8">
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            getOrderStep() >= 0
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <CreditCard size={20} />
                        </div>
                        <span className="text-sm mt-1">Order Placed</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            getOrderStep() >= 1
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <CheckCircle size={20} />
                        </div>
                        <span className="text-sm mt-1">Payment Confirmed</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            getOrderStep() >= 2
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <Package size={20} />
                        </div>
                        <span className="text-sm mt-1">Processing</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            getOrderStep() >= 3
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <Truck size={20} />
                        </div>
                        <span className="text-sm mt-1">Shipped</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            getOrderStep() >= 4
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <CheckCircle size={20} />
                        </div>
                        <span className="text-sm mt-1">Delivered</span>
                      </div>
                    </div>
                    
                    <div className="absolute top-5 left-10 right-10 h-1 bg-gray-200 -z-10">
                      <div
                        className="h-full bg-blue-600"
                        style={{
                          width: `${(getOrderStep() / 4) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Shipping</h3>
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <span className="font-medium">Name:</span> {order.user.name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{' '}
                        <a href={`mailto:${order.user.email}`} className="text-blue-600">
                          {order.user.email}
                        </a>
                      </p>
                      <p>
                        <span className="font-medium">Address:</span>{' '}
                        {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                        {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                      </p>
                      <div>
                        {order.isDelivered ? (
                          <div className="alert alert-success flex items-center mt-2">
                            <CheckCircle className="mr-2" size={16} />
                            Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                          </div>
                        ) : (
                          <div className="alert alert-info flex items-center mt-2">
                            <Truck className="mr-2" size={16} />
                            {order.status === 'shipped'
                              ? 'In Transit'
                              : order.status === 'processing'
                              ? 'Processing'
                              : 'Not Yet Shipped'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Payment</h3>
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <span className="font-medium">Method:</span> {order.paymentMethod}
                      </p>
                      <div>
                        {order.isPaid ? (
                          <div className="alert alert-success flex items-center mt-2">
                            <CheckCircle className="mr-2" size={16} />
                            Paid on {new Date(order.paidAt).toLocaleDateString()}
                          </div>
                        ) : (
                          <div className="alert alert-danger flex items-center mt-2">
                            <AlertCircle className="mr-2" size={16} />
                            Not Paid
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="divide-y divide-gray-200">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="p-4 flex flex-col sm:flex-row">
                          <div className="sm:w-16 sm:h-16 mb-4 sm:mb-0 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          
                          <div className="sm:ml-6 flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <div>
                                <Link
                                  to={`/product/${item.product}`}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  {item.name}
                                </Link>
                                
                                {item.isRental && (
                                  <div className="text-sm text-gray-500 mt-1">
                                    Rental: {new Date(item.rentalStartDate).toLocaleDateString()} to{' '}
                                    {new Date(item.rentalEndDate).toLocaleDateString()} (
                                    {item.rentalDays} days)
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-2 sm:mt-0">
                                {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                {!order.isPaid && (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-semibold">Payment</h2>
                    </div>
                    
                    <div className="p-6">
                      {!sdkReady ? (
                        <div className="text-center py-4">Loading payment options...</div>
                      ) : (
                        <div>
                          <p className="mb-4">
                            Please complete your payment to process your order.
                          </p>
                          
                          <button
                            onClick={successPaymentHandler}
                            className="btn btn-primary btn-block"
                          >
                            Pay Now (Demo)
                          </button>
                          
                          <p className="text-sm text-gray-500 mt-2 text-center">
                            This is a demo payment button. In a real application, you would see
                            PayPal or Stripe payment options here.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Order Summary</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Items</span>
                        <span>${order.itemsPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span>
                          {order.shippingPrice === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            `$${order.shippingPrice.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span>${order.taxPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-200">
                        <span>Total</span>
                        <span>${order.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderScreen;