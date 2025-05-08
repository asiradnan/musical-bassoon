import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { addToCart } from '../slices/cartSlice';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';

const WishlistScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { wishlistItems, isLoading, error } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (user) {
      dispatch(getWishlist());
    } else {
      navigate('/login?redirect=wishlist');
    }
  }, [dispatch, user, navigate]);
  
  const handleRemoveFromWishlist = (id) => {
    dispatch(removeFromWishlist(id));
  };
  
  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1,
      })
    );
    navigate('/cart');
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Heart size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Save items you love for later by adding them to your wishlist.
            </p>
            <Link to="/products" className="btn btn-primary">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                Saved Items ({wishlistItems.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {wishlistItems.map((item) => (
                <div key={item._id} className="p-6 flex flex-col sm:flex-row">
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
                          to={`/product/${item._id}`}
                          className="text-lg font-medium text-blue-600 hover:text-blue-800"
                        >
                          {item.name}
                        </Link>
                        <p className="text-gray-500 mt-1">{item.brand}</p>
                      </div>
                      
                      <div className="mt-2 sm:mt-0 text-lg font-bold">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div className="flex items-center">
                        <div className="rating mr-2">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.round(item.rating) ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-600 text-sm">
                          ({item.numReviews})
                        </span>
                      </div>
                      
                      <div className="mt-2 sm:mt-0 flex space-x-2">
                        <button
                          onClick={() => handleRemoveFromWishlist(item._id)}
                          className="text-red-600 hover:text-red-800 flex items-center"
                        >
                          <Trash2 size={18} className="mr-1" />
                          Remove
                        </button>
                        
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="btn btn-primary btn-sm flex items-center"
                          disabled={item.countInStock === 0}
                        >
                          <ShoppingCart size={16} className="mr-1" />
                          {item.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
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
        )}
      </div>
    </div>
  );
};

export default WishlistScreen;