import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../slices/cartSlice';
import { MapPin, Home, Building, Globe, Mail } from 'lucide-react';

const ShippingScreen = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const submitHandler = (e) => {
    e.preventDefault();
    
    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        country,
      })
    );
    
    navigate('/payment');
  };

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Shipping</h1>
            <div className="text-sm text-gray-500">Step 1 of 3</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="w-1/3 h-1 bg-blue-600 rounded-l-full"></div>
            <div className="w-1/3 h-1 bg-gray-300"></div>
            <div className="w-1/3 h-1 bg-gray-300 rounded-r-full"></div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Shipping Address</h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={submitHandler}>
              <div className="form-group">
                <label htmlFor="address" className="form-label flex items-center">
                  <Home size={18} className="mr-2 text-blue-600" />
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  placeholder="Enter street address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="city" className="form-label flex items-center">
                  <Building size={18} className="mr-2 text-blue-600" />
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="postalCode" className="form-label flex items-center">
                  <Mail size={18} className="mr-2 text-blue-600" />
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  placeholder="Enter postal code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="country" className="form-label flex items-center">
                  <Globe size={18} className="mr-2 text-blue-600" />
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  placeholder="Enter country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="mt-8">
                <button type="submit" className="btn btn-primary btn-block">
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin size={18} className="mr-2 text-blue-600" />
            Shipping Information
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Standard shipping takes 3-5 business days.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Express shipping (additional $15) takes 1-2 business days.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Free shipping on orders over $100.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                We currently ship to the US and Canada only.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShippingScreen;