import React from 'react';
import { useCart } from '../../contexts/CartContext';

const CartIcon = ({ onClick }) => {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  return (
    <button 
      onClick={onClick}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label="Shopping cart"
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className="text-gray-700"
      >
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 8l-1.6-8M7 13L5.4 5M7 13l2.5 5h8"></path>
        <circle cx="9" cy="19" r="1"></circle>
        <circle cx="20" cy="19" r="1"></circle>
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;