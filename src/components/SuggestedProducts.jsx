import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, limit, where } from 'firebase/firestore'
import { db } from '../firebase/firestore'
import FloorCard from './flooringCards'
import '../styles/FlooringProduct.css'

const SuggestedProducts = ({ currentProductId, category, maxSuggestions = 3 }) => {
  const [suggestedProducts, setSuggestedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      try {
        setLoading(true)
        let productsQuery

        // Try to get products from the same category first
        if (category) {
          productsQuery = query(
            collection(db, "products"),
            where("category", "==", category),
            limit(maxSuggestions + 1) // +1 to account for current product
          )
        } else {
          // Fallback to random products if no category
          productsQuery = query(
            collection(db, "products"),
            limit(maxSuggestions + 1)
          )
        }

        const querySnapshot = await getDocs(productsQuery)
        const products = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(product => product.id !== currentProductId) // Exclude current product
          .slice(0, maxSuggestions) // Limit to desired number

        // If we don't have enough products from the same category, fetch more
        if (products.length < maxSuggestions) {
          const additionalQuery = query(
            collection(db, "products"),
            limit(maxSuggestions * 2)
          )
          const additionalSnapshot = await getDocs(additionalQuery)
          const additionalProducts = additionalSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(product => 
              product.id !== currentProductId && 
              !products.some(p => p.id === product.id)
            )
            .slice(0, maxSuggestions - products.length)
          
          products.push(...additionalProducts)
        }

        setSuggestedProducts(products)
      } catch (error) {
        console.error("Error fetching suggested products:", error)
        // Fallback to empty array on error
        setSuggestedProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (currentProductId) {
      fetchSuggestedProducts()
    }
  }, [currentProductId, category, maxSuggestions])

  if (loading) {
    return (
      <div className="suggested-products-loading">
        <h3>Loading suggested products...</h3>
      </div>
    )
  }

  if (suggestedProducts.length === 0) {
    return (
      <div className="suggested-products-empty">
        <h3>No suggested products available</h3>
      </div>
    )
  }

  return (
    <div className="suggested-products-section">
      <h3>You might also like</h3>
      <div className="suggested-products-grid">
        {suggestedProducts.map(product => (
          <FloorCard
            key={product.id}
            productId={product.id}
            image={product.image}
            title={product.title}
            description={product.description}
            price={product.price}
          />
        ))}
      </div>
    </div>
  )
}

export default SuggestedProducts