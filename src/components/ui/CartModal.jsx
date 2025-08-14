import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

const CartModal = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateSqft, getCartTotal, clearCart, getTotalSqft } = useCart();

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Link 
                to="/product-page" 
                className="text-blue-600 hover:text-blue-800"
                onClick={onClose}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-gray-600 text-sm">
                        ${typeof item.price === 'string' 
                          ? item.price.replace(/[^0-9.]/g, '') 
                          : item.price}/sqft
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-gray-500">Sqft:</span>
                        <button
                          onClick={() => updateSqft(item.id, item.sqft - 1)}
                          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-2">{item.sqft}</span>
                        <button
                          onClick={() => updateSqft(item.id, item.sqft + 1)}
                          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total: ${getCartTotal().toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 block text-center"
                  >
                    View Cart
                  </Link>
                  <button
                    onClick={clearCart}
                    className="w-full border border-gray-300 py-2 px-4 rounded hover:bg-gray-50"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;