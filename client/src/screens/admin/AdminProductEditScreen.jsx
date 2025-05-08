import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ShoppingBag,
  DollarSign,
  Tag,
  Briefcase,
  Package,
  FileText,
  Upload,
  Check,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

const AdminProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [isRental, setIsRental] = useState(false);
  const [rentalPricePerDay, setRentalPricePerDay] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Categories
  const categories = [
    'Guitars',
    'Drums',
    'Keyboards',
    'Bass',
    'Amplifiers',
    'Accessories',
    'Recording Equipment',
  ];
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would fetch this data from your API
        // For this demo, we'll simulate the data
        
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Simulate product data based on ID
        let productData;
        
        if (id === '1') {
          productData = {
            _id: '1',
            name: 'Fender Stratocaster',
            price: 1299.99,
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            brand: 'Fender',
            category: 'Guitars',
            countInStock: 15,
            description:
              'The Fender Stratocaster is a model of electric guitar designed from 1952 into 1954 by Leo Fender, Bill Carson, George Fullerton and Freddie Tavares. The Fender Musical Instruments Corporation has continuously manufactured the Stratocaster from 1954 to the present. It is a double-cutaway guitar, with an extended top "horn" shape for balance.',
            isRental: true,
            rentalPricePerDay: 50,
          };
        } else if (id === '2') {
          productData = {
            _id: '2',
            name: 'Gibson Les Paul',
            price: 2499.99,
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            brand: 'Gibson',
            category: 'Guitars',
            countInStock: 8,
            description:
              'The Gibson Les Paul is a solid body electric guitar that was first sold by the Gibson Guitar Corporation in 1952. The Les Paul was designed by Gibson president Ted McCarty, factory manager John Huis and their team with input from and endorsement by guitarist Les Paul.',
            isRental: true,
            rentalPricePerDay: 75,
          };
        } else {
          // Default product data if ID doesn't match
          productData = {
            _id: id,
            name: 'Product ' + id,
            price: 99.99,
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            brand: 'Brand',
            category: 'Accessories',
            countInStock: 10,
            description: 'Product description',
            isRental: false,
            rentalPricePerDay: 0,
          };
        }
        
        setName(productData.name);
        setPrice(productData.price);
        setImage(productData.image);
        setBrand(productData.brand);
        setCategory(productData.category);
        setCountInStock(productData.countInStock);
        setDescription(productData.description);
        setIsRental(productData.isRental);
        setRentalPricePerDay(productData.rentalPricePerDay);
        
        setIsLoading(false);
      } catch (error) {
        setError('Failed to fetch product details');
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    
    try {
      // In a real app, you would upload the file to your server
      // For this demo, we'll just simulate a successful upload
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Simulate a successful upload with a random image URL
      setImage('https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg');
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };
  
  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // In a real app, you would make an API call to update the product
      // For this demo, we'll just simulate a successful update
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setIsLoading(false);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/admin/products');
      }, 2000);
    } catch (error) {
      setError('Failed to update product');
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/admin/products" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={16} className="mr-1" />
            Back to Products
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Product Information</h2>
          </div>
          
          <div className="p-6">
            {isLoading && !success ? (
              <div className="text-center py-4">Loading product details...</div>
            ) : error ? (
              <div className="alert alert-danger flex items-center mb-6">
                <AlertCircle className="mr-2" size={20} />
                {error}
              </div>
            ) : success ? (
              <div className="alert alert-success flex items-center mb-6">
                <Check className="mr-2" size={20} />
                Product updated successfully
              </div>
            ) : (
              <form onSubmit={submitHandler}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label flex items-center">
                      <ShoppingBag size={18} className="mr-2 text-blue-600" />
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="price" className="form-label flex items-center">
                      <DollarSign size={18} className="mr-2 text-blue-600" />
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      className="form-control"
                      placeholder="Enter price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="brand" className="form-label flex items-center">
                      <Briefcase size={18} className="mr-2 text-blue-600" />
                      Brand
                    </label>
                    <input
                      type="text"
                      id="brand"
                      className="form-control"
                      placeholder="Enter brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="category" className="form-label flex items-center">
                      <Tag size={18} className="mr-2 text-blue-600" />
                      Category
                    </label>
                    <select
                      id="category"
                      className="form-control"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="countInStock" className="form-label flex items-center">
                      <Package size={18} className="mr-2 text-blue-600" />
                      Count In Stock
                    </label>
                    <input
                      type="number"
                      id="countInStock"
                      className="form-control"
                      placeholder="Enter count in stock"
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="image" className="form-label flex items-center">
                      <Upload size={18} className="mr-2 text-blue-600" />
                      Image
                    </label>
                    <input
                      type="text"
                      id="image"
                      className="form-control"
                      placeholder="Enter image URL"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      required
                    />
                    <div className="mt-2">
                      <input
                        type="file"
                        id="image-file"
                        className="hidden"
                        onChange={uploadFileHandler}
                      />
                      <label
                        htmlFor="image-file"
                        className="btn btn-outline btn-sm cursor-pointer"
                      >
                        {uploading ? 'Uploading...' : 'Choose File'}
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="form-group mt-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isRental"
                      className="mr-2"
                      checked={isRental}
                      onChange={(e) => setIsRental(e.target.checked)}
                    />
                    <label htmlFor="isRental" className="form-label mb-0">
                      Available for Rental
                    </label>
                  </div>
                </div>
                
                {isRental && (
                  <div className="form-group mt-4">
                    <label htmlFor="rentalPricePerDay" className="form-label flex items-center">
                      <DollarSign size={18} className="mr-2 text-blue-600" />
                      Rental Price Per Day
                    </label>
                    <input
                      type="number"
                      id="rentalPricePerDay"
                      className="form-control"
                      placeholder="Enter rental price per day"
                      value={rentalPricePerDay}
                      onChange={(e) => setRentalPricePerDay(e.target.value)}
                      required={isRental}
                    />
                  </div>
                )}
                
                <div className="form-group mt-4">
                  <label htmlFor="description" className="form-label flex items-center">
                    <FileText size={18} className="mr-2 text-blue-600" />
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    className="form-control"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Link to="/admin/products" className="btn btn-outline mr-2">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading || uploading}
                  >
                    {isLoading ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductEditScreen;