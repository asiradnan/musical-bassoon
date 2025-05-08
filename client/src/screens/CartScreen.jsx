import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { ShoppingCart, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  
  // Calculate prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);
  
  const handleQuantityChange = (id, qty) => {
    const item = cartItems.find((x) => x.product === id);
    dispatch(addToCart({ ...item, qty }));
  };
  
  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };
  
  const checkoutHandler = () => {
    if (!user) {
      navigate('/login?redirect=shipping');
    } else {
      navigate('/shipping');
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">
                    Cart Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.product} className="p-6 flex flex-col sm:flex-row">
                      <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0 flex-shrink-0">
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
                              className="text-lg font-medium text-blue-600 hover:text-blue-800"
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
                          
                          <div className="mt-2 sm:mt-0 text-lg font-bold">
                            ${(item.price * item.qty).toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <div className="flex items-center">
                            <label htmlFor={`qty-${item.product}`} className="mr-2 text-gray-600">
                              Qty:
                            </label>
                            <select
                              id={`qty-${item.product}`}
                              value={item.qty}
                              onChange={(e) =>
                                handleQuantityChange(item.product, Number(e.target.value))
                              }
                              className="form-control w-16"
                            >
                              {[...Array(item.countInStock).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveFromCart(item.product)}
                            className="mt-2 sm:mt-0 text-red-600 hover:text-red-800 flex items-center"
                          >
                            <Trash2 size={18} className="mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 border-t border-gray-200">
                  <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-800">
                    <ArrowLeft size={16} className="mr-1" />
                    Continue Shopping
                  </Link>
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
                      <span className="text-gray-600">Subtotal</span>
                      <span>${itemsPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>
                        {shippingPrice === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `$${shippingPrice.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${taxPrice}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-200">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={checkoutHandler}
                    className="btn btn-primary btn-block mt-6 flex items-center justify-center"
                    disabled={cartItems.length === 0}
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    Proceed to Checkout
                  </button>
                  
                  {!user && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      You will need to sign in to complete your purchase.
                    </p>
                  )}
                </div>
                
                <div className="p-6 bg-gray-50">
                  <h3 className="font-medium mb-2">We Accept</h3>
                  <div className="flex space-x-2">
                    <div className="w-12 h-8 bg-gray-200 rounded"></div>
                    <div className="w-12 h-8 bg-gray-200 rounded"></div>
                    <div className="w-12 h-8 bg-gray-200 rounded"></div>
                    <div className="w-12 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartScreen;