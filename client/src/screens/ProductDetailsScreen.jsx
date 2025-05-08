import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  fetchProductDetails,
  createProductReview,
  clearProductDetails,
  clearError,
} from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import { addToWishlist } from '../slices/wishlistSlice';
import {
  ShoppingCart,
  Heart,
  ArrowLeft,
  Truck,
  Shield,
  RefreshCw,
  Star,
  AlertCircle,
  Check,
} from 'lucide-react';

const ProductDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [isRental, setIsRental] = useState(false);
  const [rentalDays, setRentalDays] = useState(1);
  const [rentalStartDate, setRentalStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  const { product, isLoading, error } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(clearProductDetails());
    dispatch(fetchProductDetails(id));
    
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);
  
  useEffect(() => {
    if (product && product.isRental) {
      setIsRental(true);
    }
  }, [product]);
  
  const handleAddToCart = () => {
    if (isRental && product.isRental) {
      const rentalEndDate = new Date(rentalStartDate);
      rentalEndDate.setDate(rentalEndDate.getDate() + parseInt(rentalDays));
      
      dispatch(
        addToCart({
          product: product._id,
          name: product.name,
          image: product.image,
          price: isRental ? product.rentalPricePerDay * rentalDays : product.price,
          countInStock: product.countInStock,
          qty,
          isRental,
          rentalDays: parseInt(rentalDays),
          rentalStartDate,
          rentalEndDate: rentalEndDate.toISOString().split('T')[0],
        })
      );
    } else {
      dispatch(
        addToCart({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock: product.countInStock,
          qty,
        })
      );
    }
    
    navigate('/cart');
  };
  
  const handleAddToWishlist = () => {
    if (!user) {
      navigate('/login?redirect=product/' + id);
      return;
    }
    
    dispatch(addToWishlist(product._id));
  };
  
  const submitReviewHandler = (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login?redirect=product/' + id);
      return;
    }
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    dispatch(clearError());
    dispatch(
      createProductReview({
        productId: id,
        review: {
          rating,
          comment,
        },
      })
    )
      .unwrap()
      .then(() => {
        setRating(0);
        setComment('');
        dispatch(fetchProductDetails(id));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={16} className="mr-1" />
            Back to Products
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="alert alert-danger flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        ) : !product ? (
          <div className="alert alert-danger flex items-center">
            <AlertCircle className="mr-2" size={20} />
            Product not found
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="md:flex">
                {/* Product Image */}
                <div className="md:w-1/2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Product Details */}
                <div className="md:w-1/2 p-6">
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                  
                  <div className="flex items-center mb-4">
                    <div className="rating mr-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-xl">
                          {i < Math.round(product.rating) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-2xl font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.isRental && (
                      <span className="text-gray-600 ml-2">
                        (Rental: ${product.rentalPricePerDay.toFixed(2)}/day)
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-700">{product.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <span className="w-24 text-gray-600">Brand:</span>
                      <span className="font-medium">{product.brand}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="w-24 text-gray-600">Category:</span>
                      <Link
                        to={`/products/category/${product.category}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        {product.category}
                      </Link>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-gray-600">Status:</span>
                      {product.countInStock > 0 ? (
                        <span className="badge badge-success">In Stock</span>
                      ) : (
                        <span className="badge badge-danger">Out of Stock</span>
                      )}
                    </div>
                  </div>
                  
                  {product.countInStock > 0 && (
                    <div className="mb-6">
                      {product.isRental && (
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id="rental-option"
                              checked={isRental}
                              onChange={() => setIsRental(!isRental)}
                              className="mr-2"
                            />
                            <label htmlFor="rental-option" className="font-medium">
                              Rent Instead of Buy
                            </label>
                          </div>
                          
                          {isRental && (
                            <div className="bg-gray-50 p-4 rounded-md">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label htmlFor="rental-days" className="block text-sm font-medium text-gray-700 mb-1">
                                    Rental Days
                                  </label>
                                  <select
                                    id="rental-days"
                                    value={rentalDays}
                                    onChange={(e) => setRentalDays(e.target.value)}
                                    className="form-control"
                                  >
                                    {[1, 2, 3, 4, 5, 6, 7, 14, 30].map((days) => (
                                      <option key={days} value={days}>
                                        {days} {days === 1 ? 'day' : 'days'}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label htmlFor="rental-start-date" className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                  </label>
                                  <input
                                    type="date"
                                    id="rental-start-date"
                                    value={rentalStartDate}
                                    onChange={(e) => setRentalStartDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="mt-2 text-right">
                                <span className="font-medium">
                                  Total: ${(product.rentalPricePerDay * rentalDays).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <div className="mr-4">
                          <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity
                          </label>
                          <select
                            id="qty"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                            className="form-control"
                          >
                            {[...Array(product.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={handleAddToWishlist}
                            className="btn btn-outline flex items-center"
                          >
                            <Heart size={18} className="mr-2" />
                            Wishlist
                          </button>
                          
                          <button
                            onClick={handleAddToCart}
                            className="btn btn-primary flex items-center"
                          >
                            <ShoppingCart size={18} className="mr-2" />
                            {isRental && product.isRental ? 'Rent Now' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <Truck size={20} className="text-blue-600 mr-2" />
                        <span className="text-sm">Free shipping over $100</span>
                      </div>
                      <div className="flex items-center">
                        <Shield size={20} className="text-blue-600 mr-2" />
                        <span className="text-sm">2-year warranty</span>
                      </div>
                      <div className="flex items-center">
                        <RefreshCw size={20} className="text-blue-600 mr-2" />
                        <span className="text-sm">30-day returns</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'description'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('description')}
                  >
                    Description
                  </button>
                  <button
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'specifications'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('specifications')}
                  >
                    Specifications
                  </button>
                  <button
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'reviews'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('reviews')}
                  >
                    Reviews ({product.reviews.length})
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                {activeTab === 'description' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Product Description</h2>
                    <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                  </div>
                )}
                
                {activeTab === 'specifications' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Product Specifications</h2>
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                            Brand
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.brand}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                            Category
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                            Weight
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Approx. 5 lbs (2.3 kg)
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                            Dimensions
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            12" x 8" x 4" (30.5cm x 20.3cm x 10.2cm)
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                            Warranty
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            2 Years Limited Warranty
                          </td>
                        </tr>
                        {product.isRental && (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                              Rental Available
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Yes, ${product.rentalPricePerDay.toFixed(2)} per day
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
                    
                    {product.reviews.length === 0 ? (
                      <p className="text-gray-600 mb-6">No reviews yet. Be the first to review this product!</p>
                    ) : (
                      <div className="mb-6">
                        <div className="flex items-center mb-4">
                          <div className="rating mr-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-xl">
                                {i < Math.round(product.rating) ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                          <span className="text-gray-600">
                            Based on {product.numReviews}{' '}
                            {product.numReviews === 1 ? 'review' : 'reviews'}
                          </span>
                        </div>
                        
                        <div className="space-y-4">
                          {product.reviews.map((review) => (
                            <div key={review._id} className="border-b border-gray-200 pb-4">
                              <div className="flex justify-between mb-2">
                                <div className="flex items-center">
                                  <div className="rating mr-2">
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i}>
                                        {i < review.rating ? '★' : '☆'}
                                      </span>
                                    ))}
                                  </div>
                                  <span className="font-medium">{review.name}</span>
                                </div>
                                <span className="text-gray-500 text-sm">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                      
                      {user ? (
                        <form onSubmit={submitReviewHandler}>
                          <div className="form-group">
                            <label htmlFor="rating" className="form-label">
                              Rating
                            </label>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => setRating(value)}
                                  className="text-2xl focus:outline-none"
                                >
                                  <Star
                                    size={24}
                                    className={`${
                                      value <= rating
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="comment" className="form-label">
                              Comment
                            </label>
                            <textarea
                              id="comment"
                              rows="4"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="form-control"
                              required
                            ></textarea>
                          </div>
                          
                          <button type="submit" className="btn btn-primary">
                            Submit Review
                          </button>
                        </form>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-gray-700">
                            Please{' '}
                            <Link
                              to={`/login?redirect=product/${id}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              sign in
                            </Link>{' '}
                            to write a review.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Related Products would go here */}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsScreen;