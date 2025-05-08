import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchProducts, fetchProductsByCategory } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import { addToWishlist } from '../slices/wishlistSlice';
import { ShoppingCart, Heart, Filter, Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const ProductScreen = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState(category ? [category] : []);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const { products, page, pages, isLoading, error } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  
  // Get query params
  const queryParams = new URLSearchParams(location.search);
  const keywordParam = queryParams.get('keyword');
  
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
  
  // Brands (would normally come from the API)
  const brands = [
    'Fender',
    'Gibson',
    'Ibanez',
    'Yamaha',
    'Roland',
    'Pearl',
    'Shure',
    'Audio-Technica',
  ];
  
  useEffect(() => {
    if (keywordParam) {
      setSearchKeyword(keywordParam);
    }
  }, [keywordParam]);
  
  useEffect(() => {
    if (category) {
      dispatch(fetchProductsByCategory(category));
    } else {
      dispatch(
        fetchProducts({
          keyword: keywordParam || '',
          pageNumber: currentPage,
        })
      );
    }
  }, [dispatch, category, keywordParam, currentPage]);
  
  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Filter by selected categories
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    
    // Filter by selected brands
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }
    
    return true;
  });
  
  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/products?keyword=${searchKeyword}`);
    } else {
      navigate('/products');
    }
  };
  
  // Handle category filter
  const handleCategoryFilter = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Handle brand filter
  const handleBrandFilter = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };
  
  // Handle price range change
  const handlePriceRangeChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = Number(e.target.value);
    setPriceRange(newRange);
  };
  
  // Handle add to cart
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
  
  // Handle add to wishlist
  const handleAddToWishlist = (productId) => {
    if (!user) {
      navigate('/login?redirect=products');
      return;
    }
    
    dispatch(addToWishlist(productId));
  };
  
  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 2000]);
    setSelectedCategories([]);
    setSelectedBrands([]);
  };
  
  // Toggle filters on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {category ? `${category}` : 'All Products'}
          </h1>
          
          <button
            className="md:hidden btn btn-outline flex items-center"
            onClick={toggleFilters}
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div
            className={`w-full md:w-1/4 md:block ${
              showFilters ? 'block' : 'hidden'
            }`}
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Reset All
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Search</h3>
                <form onSubmit={handleSearchSubmit} className="flex">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="form-control rounded-r-none"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700 transition"
                  >
                    <Search size={18} />
                  </button>
                </form>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">${priceRange[0]}</span>
                  <span className="text-gray-600">${priceRange[1]}</span>
                </div>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(e, 0)}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(e, 1)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="number"
                    min="0"
                    max="2000"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(e, 0)}
                    className="form-control w-1/2"
                  />
                  <input
                    type="number"
                    min="0"
                    max="2000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(e, 1)}
                    className="form-control w-1/2"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${cat}`}
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryFilter(cat)}
                        className="mr-2"
                      />
                      <label htmlFor={`category-${cat}`} className="text-gray-700">
                        {cat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Brands</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandFilter(brand)}
                        className="mr-2"
                      />
                      <label htmlFor={`brand-${brand}`} className="text-gray-700">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Products */}
          <div className="w-full md:w-3/4">
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : error ? (
              <div className="alert alert-danger flex items-center">
                <AlertCircle className="mr-2" size={20} />
                {error}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-2xl font-semibold mb-2">No Products Found</h2>
                <p className="text-gray-600 mb-6">
                  We couldn't find any products matching your criteria.
                </p>
                <button onClick={resetFilters} className="btn btn-primary">
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                      <Link to={`/product/${product._id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-64 object-cover"
                        />
                      </Link>
                      
                      <div className="p-4">
                        <Link to={`/product/${product._id}`}>
                          <h2 className="text-lg font-semibold mb-2 hover:text-blue-600 transition">
                            {product.name}
                          </h2>
                        </Link>
                        
                        <div className="flex items-center mb-2">
                          <div className="rating mr-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>
                                {i < Math.round(product.rating) ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                          <span className="text-gray-600 text-sm">
                            ({product.numReviews})
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4">
                          {product.description.substring(0, 100)}...
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold">
                            ${product.price.toFixed(2)}
                          </span>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAddToWishlist(product._id)}
                              className="p-2 text-gray-500 hover:text-red-500 transition"
                              title="Add to Wishlist"
                            >
                              <Heart size={20} />
                            </button>
                            
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition flex items-center"
                              disabled={product.countInStock === 0}
                              title={
                                product.countInStock === 0
                                  ? 'Out of Stock'
                                  : 'Add to Cart'
                              }
                            >
                              <ShoppingCart size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {!category && pages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center">
                      <button
                        onClick={() => setCurrentPage(page - 1)}
                        disabled={page === 1}
                        className={`p-2 rounded-l-md border ${
                          page === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      {[...Array(pages).keys()].map((x) => (
                        <button
                          key={x + 1}
                          onClick={() => setCurrentPage(x + 1)}
                          className={`px-4 py-2 border-t border-b ${
                            x + 1 === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {x + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(page + 1)}
                        disabled={page === pages}
                        className={`p-2 rounded-r-md border ${
                          page === pages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;