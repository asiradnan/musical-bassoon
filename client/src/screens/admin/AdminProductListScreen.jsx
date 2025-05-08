import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Edit, Trash2, Search, AlertCircle, Plus, Filter } from 'lucide-react';

const AdminProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Categories
  const categories = [
    'All',
    'Guitars',
    'Drums',
    'Keyboards',
    'Bass',
    'Amplifiers',
    'Accessories',
    'Recording Equipment',
  ];
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would fetch this data from your API
        // For this demo, we'll simulate the data
        
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Simulate products data
        const simulatedProducts = [
          {
            _id: '1',
            name: 'Fender Stratocaster',
            price: 1299.99,
            category: 'Guitars',
            brand: 'Fender',
            countInStock: 15,
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '2',
            name: 'Gibson Les Paul',
            price: 2499.99,
            category: 'Guitars',
            brand: 'Gibson',
            countInStock: 8,
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '3',
            name: 'Pearl Export Drum Kit',
            price: 899.99,
            category: 'Drums',
            brand: 'Pearl',
            countInStock: 5,
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '4',
            name: 'Yamaha P-125 Digital Piano',
            price: 649.99,
            category: 'Keyboards',
            brand: 'Yamaha',
            countInStock: 12,
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '5',
            name: 'Fender Jazz Bass',
            price: 1199.99,
            category: 'Bass',
            brand: 'Fender',
            countInStock: 7,
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '6',
            name: 'Marshall JCM800 Amp',
            price: 2699.99,
            category: 'Amplifiers',
            brand: 'Marshall',
            countInStock: 3,
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '7',
            name: 'Shure SM58 Microphone',
            price: 99.99,
            category: 'Recording Equipment',
            brand: 'Shure',
            countInStock: 20,
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        
        setProducts(simulatedProducts);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to fetch products');
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Handle search and filter
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === '' || filterCategory === 'All' || product.category === filterCategory)
  );
  
  // Handle create product
  const createProductHandler = () => {
    // In a real app, you would navigate to a create product page
    // For this demo, we'll just add a new product to the state
    
    const newProduct = {
      _id: Date.now().toString(),
      name: 'New Product',
      price: 0,
      category: 'Accessories',
      brand: 'Brand',
      countInStock: 0,
      image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
      createdAt: new Date().toISOString(),
    };
    
    setProducts([...products, newProduct]);
  };
  
  // Handle delete product
  const deleteHandler = (id) => {
    const productToDelete = products.find((product) => product._id === id);
    setProductToDelete(productToDelete);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      // In a real app, you would make an API call to delete the product
      // For this demo, we'll just update the state
      
      setProducts(products.filter((product) => product._id !== productToDelete._id));
      setShowDeleteModal(false);
      setProductToDelete(null);
      
      // Show success message (would use toast in a real app)
      alert(`Product ${productToDelete.name} deleted successfully`);
    } catch (error) {
      // Show error message (would use toast in a real app)
      alert('Failed to delete product');
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Products</h1>
          <Link to="/admin/dashboard" className="btn btn-outline">
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <ShoppingBag size={20} className="text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">Product Management</h2>
            </div>
            
            <button
              onClick={createProductHandler}
              className="btn btn-primary flex items-center"
            >
              <Plus size={18} className="mr-1" />
              Create Product
            </button>
          </div>
          
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search products..."
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
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading products...</div>
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
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={product.image}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${product.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.countInStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/product/${product._id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => deleteHandler(product._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
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
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete product "{productToDelete?.name}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductListScreen;