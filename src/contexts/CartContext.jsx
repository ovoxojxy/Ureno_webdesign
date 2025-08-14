import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './authContext/UserContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useUser();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ureno_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('ureno_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  // Sync cart with Firestore when user logs in (only on user change and after initialization)
  useEffect(() => {
    if (user && isInitialized) {
      syncCartWithFirestore();
    }
  }, [user, isInitialized]);

  const syncCartWithFirestore = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const cartDoc = await getDoc(doc(db, 'carts', user.uid));
      if (cartDoc.exists()) {
        const firestoreCart = cartDoc.data().items || [];
        // Only merge if localStorage cart has different items
        if (cartItems.length > 0) {
          const mergedCart = mergeCartItems(cartItems, firestoreCart);
          if (JSON.stringify(mergedCart) !== JSON.stringify(cartItems)) {
            setCartItems(mergedCart);
          }
          // Save merged cart back to Firestore
          await setDoc(doc(db, 'carts', user.uid), {
            items: mergedCart,
            updatedAt: new Date()
          });
        } else {
          // Use Firestore cart if localStorage is empty
          setCartItems(firestoreCart);
        }
      } else {
        // Save current cart to Firestore if not empty
        if (cartItems.length > 0) {
          await setDoc(doc(db, 'carts', user.uid), {
            items: cartItems,
            updatedAt: new Date()
          });
        }
      }
    } catch (error) {
      console.warn('Cart sync with Firestore failed - continuing with local storage:', error.message);
      // Cart continues to work with localStorage even if Firestore fails
    } finally {
      setIsLoading(false);
    }
  };

  const mergeCartItems = (localCart, firestoreCart) => {
    const merged = [...localCart];
    
    firestoreCart.forEach(firestoreItem => {
      const existingIndex = merged.findIndex(item => item.id === firestoreItem.id);
      if (existingIndex !== -1) {
        // Keep the higher sqft (or fallback to quantity for backward compatibility)
        const localSqft = merged[existingIndex].sqft || merged[existingIndex].quantity || 0;
        const firestoreSqft = firestoreItem.sqft || firestoreItem.quantity || 0;
        merged[existingIndex].sqft = Math.max(localSqft, firestoreSqft);
        merged[existingIndex].quantity = 1; // Always 1 product
      } else {
        // Ensure backward compatibility with old cart items
        if (!firestoreItem.sqft && firestoreItem.quantity) {
          firestoreItem.sqft = firestoreItem.quantity;
          firestoreItem.quantity = 1;
        }
        merged.push(firestoreItem);
      }
    });
    
    return merged;
  };

  const addToCart = async (product, sqft = 1) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    let updatedCart;
    if (existingItemIndex !== -1) {
      updatedCart = cartItems.map((item, index) =>
        index === existingItemIndex
          ? { ...item, sqft: item.sqft + sqft }
          : item
      );
    } else {
      const cartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1, // Always 1 product, regardless of sqft
        sqft: sqft, // Store sqft separately
        addedAt: new Date().toISOString()
      };
      updatedCart = [...cartItems, cartItem];
    }
    
    setCartItems(updatedCart);
    
    // Sync with Firestore if user is logged in
    if (user) {
      try {
        await setDoc(doc(db, 'carts', user.uid), {
          items: updatedCart,
          updatedAt: new Date()
        });
      } catch (error) {
        console.warn('Failed to sync cart with Firestore - cart saved locally:', error.message);
      }
    }
  };

  const removeFromCart = async (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    
    if (user) {
      try {
        await setDoc(doc(db, 'carts', user.uid), {
          items: updatedCart,
          updatedAt: new Date()
        });
      } catch (error) {
        console.warn('Failed to sync cart with Firestore - cart saved locally:', error.message);
      }
    }
  };

  const updateSqft = async (productId, newSqft) => {
    if (newSqft <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, sqft: newSqft } : item
    );
    setCartItems(updatedCart);
    
    if (user) {
      try {
        await setDoc(doc(db, 'carts', user.uid), {
          items: updatedCart,
          updatedAt: new Date()
        });
      } catch (error) {
        console.warn('Failed to sync cart with Firestore - cart saved locally:', error.message);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    
    if (user) {
      try {
        await setDoc(doc(db, 'carts', user.uid), {
          items: [],
          updatedAt: new Date()
        });
      } catch (error) {
        console.warn('Failed to sync cart with Firestore - cart saved locally:', error.message);
      }
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
        : item.price;
      return total + (price * item.sqft); // Calculate total based on sqft
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.length; // Count each product as 1 item
  };

  const getTotalSqft = () => {
    return cartItems.reduce((total, item) => total + item.sqft, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateSqft,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getTotalSqft,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};