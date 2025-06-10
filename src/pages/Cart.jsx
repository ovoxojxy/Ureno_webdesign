import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import NewNav from '../components/ui/newNav';
import Footer from '../components/footer';

const Cart = () => {
  const { cartItems, removeFromCart, updateSqft, getCartTotal, clearCart, getTotalSqft } = useCart();

  return (
    <>
      <NewNav />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link 
                to="/product-page"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Cart Items</h2>
                      <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  
                  <div className="divide-y">
                    {cartItems.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="p-6">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-medium">{item.title}</h3>
                            <p className="text-gray-600">{item.category}</p>
                            <p className="text-lg font-semibold text-blue-600">
                              ${typeof item.price === 'string' 
                                ? item.price.replace(/[^0-9.]/g, '') 
                                : item.price}/sqft
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Sqft:</span>
                              <button
                                onClick={() => updateSqft(item.id, item.sqft - 1)}
                                className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="px-4 py-2 border rounded-lg min-w-[60px] text-center">
                                {item.sqft}
                              </span>
                              <button
                                onClick={() => updateSqft(item.id, item.sqft + 1)}
                                className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Items ({cartItems.length})</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Sqft ({getTotalSqft()})</span>
                      <span></span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium">
                      Proceed to Checkout
                    </button>
                    <Link 
                      to="/product-page"
                      className="w-full border border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 block text-center"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;