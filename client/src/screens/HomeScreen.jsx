import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopProducts } from '../slices/productSlice';
import { Music, Calendar, ShoppingBag, Headphones } from 'lucide-react';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { topProducts, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchTopProducts());
  }, [dispatch]);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative bg-blue-700 text-white py-16 md:py-24 rounded-lg overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Music Journey Starts Here</h1>
            <p className="text-xl mb-8">
              Professional recording studios, quality instruments, and expert guidance all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/booking" className="btn btn-accent btn-lg">
                Book Studio
              </Link>
              <Link to="/products" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-blue-700">
                Shop Instruments
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <Music size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Studios</h3>
              <p className="text-gray-600">
                State-of-the-art recording studios with professional equipment and acoustics.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-full mb-4">
                <Calendar size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Simple online booking system for studios and practice rooms.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <ShoppingBag size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Instruments</h3>
              <p className="text-gray-600">
                Wide selection of high-quality instruments and equipment for sale.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                <Headphones size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Professional advice and support from experienced musicians.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50 rounded-lg mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="rating mr-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.round(product.rating) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-600">({product.numReviews} reviews)</span>
                    </div>
                    <p className="text-gray-600 mb-4">{product.description.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                      <Link
                        to={`/product/${product._id}`}
                        className="btn btn-primary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/products" className="btn btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Studio Booking Promo */}
      <section className="py-12 mb-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src="https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg"
                  alt="Recording Studio"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 text-white">
                <h2 className="text-3xl font-bold mb-4">Book Your Studio Session Today</h2>
                <p className="text-lg mb-6">
                  Our professional recording studios are equipped with top-of-the-line gear and
                  acoustically treated for the perfect sound. Book your session now and bring your
                  music to life.
                </p>
                <ul className="mb-8 space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span> Professional recording equipment
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span> Acoustically treated rooms
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span> Flexible booking hours
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span> Technical support available
                  </li>
                </ul>
                <Link to="/booking" className="btn btn-lg bg-white text-indigo-600 hover:bg-gray-100">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rating mb-4">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
              <p className="text-gray-600 mb-4">
                "The studio quality is amazing. I recorded my EP here and couldn't be happier with
                the results. The staff was also very helpful throughout the process."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                  alt="Customer"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold">Michael Johnson</h4>
                  <p className="text-gray-500 text-sm">Musician</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rating mb-4">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
              <p className="text-gray-600 mb-4">
                "I bought my first guitar here and the team helped me choose the perfect one for my
                needs. They even gave me some free lessons to get started!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
                  alt="Customer"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold">Sarah Williams</h4>
                  <p className="text-gray-500 text-sm">Student</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rating mb-4">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>☆</span>
              </div>
              <p className="text-gray-600 mb-4">
                "The practice rooms are well-equipped and affordable. I've been coming here for
                months to rehearse with my band and we love it."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg"
                  alt="Customer"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold">David Chen</h4>
                  <p className="text-gray-500 text-sm">Band Member</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-blue-600 text-white rounded-lg mb-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Musical Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Whether you're looking to record your next hit, practice with your band, or find the
            perfect instrument, we've got you covered.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/booking" className="btn btn-accent btn-lg">
              Book Studio
            </Link>
            <Link to="/products" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-blue-600">
              Shop Now
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-blue-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;