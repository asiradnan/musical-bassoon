import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';
import { CreditCard, DollarSign } from 'lucide-react';

const PaymentScreen = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redirect to shipping if shipping address is not set
  if (!shippingAddress.address) {
    navigate('/shipping');
  }
  
  const submitHandler = (e) => {
    e.preventDefault();
    
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Payment Method</h1>
            <div className="text-sm text-gray-500">Step 2 of 3</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="w-1/3 h-1 bg-blue-600 rounded-l-full"></div>
            <div className="w-1/3 h-1 bg-blue-600"></div>
            <div className="w-1/3 h-1 bg-gray-300 rounded-r-full"></div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Select Payment Method</h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={submitHandler}>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-md p-4 hover:border-blue-500 transition cursor-pointer">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Credit Card"
                      checked={paymentMethod === 'Credit Card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="flex items-center">
                        <CreditCard size={20} className="text-blue-600 mr-2" />
                        <span className="font-medium">Credit Card</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        Pay securely with your credit card. We accept Visa, Mastercard, American
                        Express, and Discover.
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </label>
                </div>
                
                <div className="border border-gray-200 rounded-md p-4 hover:border-blue-500 transition cursor-pointer">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PayPal"
                      checked={paymentMethod === 'PayPal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="flex items-center">
                        <DollarSign size={20} className="text-blue-600 mr-2" />
                        <span className="font-medium">PayPal</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        Pay securely with your PayPal account. You will be redirected to PayPal to
                        complete your payment.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="mt-8">
                <button type="submit" className="btn btn-primary btn-block">
                  Continue to Review Order
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
          <div className="text-gray-600">
            <p>{shippingAddress.address}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.postalCode}
            </p>
            <p>{shippingAddress.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;