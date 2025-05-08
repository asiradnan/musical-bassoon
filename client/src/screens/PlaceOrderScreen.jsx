import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, resetOrder } from '../slices/orderSlice';
import { clearCartItems } from '../slices/cartSlice';
import { ShoppingBag, MapPin, CreditCard, Truck, AlertCircle } from 'lucide-react';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const cart = useSelector((state) => state.cart);
  const { order, success, error, isLoading } = useSelector((state) => state.order);
  
  // Calculate prices
  cart.itemsPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 10;
  cart.taxPrice = Number((0.15 * cart.itemsPrice).toFixed(2));
  cart.totalPrice = (
    cart.itemsPrice +
    cart.shippingPrice +
    cart.taxPrice
  ).toFixed(2);
  
  useEffect(() => {
    if (success && order) {
      navigate(`/order/${order._id}`);
      dispatch(resetOrder());
      dispatch(clearCartItems());
    }
  }, [success, order, navigate, dispatch]);
  
  // Redirect if shipping address or payment method is not set
  if (!cart.shippingAddress.address) {
    navigate('/shipping');
    return null;
  } else if (!cart.paymentMethod) {
    navigate('/payment');
    return null;
  }
  
  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Review Your Order</h1>
            <div className="text-sm text-gray-500">Step 3 of 3</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="w-1/3 h-1 bg-blue-600 rounded-l-full"></div>
            <div className="w-1/3 h-1 bg-blue-600"></div>
            <div className="w-1/3 h-1 bg-blue-600 rounded-r-full"></div>
          </div>
        </div>
        
        {error && (
          <div className="alert alert-danger flex items-center mb-6">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Details */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold flex items-center">
                  <MapPin size={20} className="mr-2 text-blue-600" />
                  Shipping Address
                </h2>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700">
                  {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                  {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold flex items-center">
                  <CreditCard size={20} className="mr-2 text-blue-600" />
                  Payment Method
                </h2>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700">Method: {cart.paymentMethod}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold flex items-center">
                  <ShoppingBag size={20} className="mr-2 text-blue-600" />
                  Order Items
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cart.cartItems.length === 0 ? (
                  <div className="p-6">
                    <div className="alert alert-info">Your cart is empty</div>
                  </div>
                ) : (
                  cart.cartItems.map((item, index) => (
                    <div key={index} className="p-6 flex flex-col sm:flex-row">
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
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items</span>
                    <span>${cart.itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {cart.shippingPrice === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${cart.shippingPrice.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${cart.taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>${cart.totalPrice}</span>
                  </div>
                </div>
                
                <button
                  type="button"
                  className="btn btn-primary btn-block mt-6"
                  disabled={cart.cartItems.length === 0 || isLoading}
                  onClick={placeOrderHandler}
                >
                  {isLoading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
              
              <div className="p-6 bg-gray-50">
                <div className="flex items-center mb-4">
                  <Truck size={20} className="text-blue-600 mr-2" />
                  <span className="font-medium">Shipping Information</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {cart.shippingPrice === 0
                    ? 'Your order qualifies for free shipping!'
                    : 'Standard shipping: 3-5 business days'}
                </p>
                <p className="text-sm text-gray-600">
                  Estimated delivery: {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;