import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/firestore";
import defaultImage from "../assets/images/Image-not-found.png"
import SuggestedProducts from "./SuggestedProducts"
import { useCart } from "../contexts/CartContext"

const ProductDetail = () => {

    const { productId } = useParams()
    const [product, setProduct] = useState(null)
    const [mainImage, setMainImage] = useState(null)
    const { addToCart } = useCart()
    const [quantity, setQuantity] = useState("")
    const [isAdding, setIsAdding] = useState(false)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, "products", productId)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    const productData = docSnap.data()
                    setProduct(productData)
                    setMainImage(productData.image)
                } else {
                    console.error("Product not found")
                }
            } catch (error) {
                console.error("Error fetching product: ", error)
        }
    }

    if (productId) fetchProduct()
    }, [productId])

    const handleAddToCart = async () => {
        if (!product) return;
        
        const sqft = parseInt(quantity) || 1;
        
        // Confirmation dialog
        const confirmed = window.confirm(
            `Add ${sqft} sqft of "${product.title}" to your cart?\n\nPrice: $${typeof product.price === 'string' ? product.price.replace(/[^0-9.]/g, '') : product.price}/sqft\nTotal: $${((typeof product.price === 'string' ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : product.price) * sqft).toFixed(2)}`
        );
        
        if (!confirmed) return;
        
        setIsAdding(true);
        try {
            await addToCart(product, sqft);
            setQuantity(""); // Clear input after successful add
            alert(`Successfully added ${sqft} sqft of "${product.title}" to your cart!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart. Please try again.');
        } finally {
            setIsAdding(false);
        }
    };


    if(!product) {
        return (
            <>
                <div className="main-content">
                    <div id="left">
                        <div className="main-image">
                            <img src={defaultImage} alt="" />
                        </div>
                        <div className="thumbnails">
                            <img src={defaultImage} alt="" />
                            <img src={defaultImage} alt="" />
                            <img src={defaultImage} alt="" />
                        </div>
                    </div>
    
                    <div id="right">
                        <div className="title-section">
                            <div className="title">
                                <p id="main">Deafult Title</p>
                                <p id="sub">Default Category</p>
                            </div>
    
                            <div className="price-link">
                                <div className="title-left">
                                    <p>$</p>
                                </div>
                                <div className="title-right">
                                    <a href="">See in my room</a>
                                </div>
                            </div>
    
                           
                        </div>
    
                        <div className="description">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p>
                                    Default Description
                                </p>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <button 
                                        style={{ 
                                            padding: '8px 16px',
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={handleAddToCart}
                                        disabled={isAdding}
                                    >
                                        {isAdding ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                    <button 
                                        style={{ 
                                            padding: '8px 16px',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => console.log('Add to project clicked')}
                                    >
                                        Add to Project
                                    </button>
                                </div>
                            </div>
    
                            <a href="">Product Details</a>
                            <a href="">Reviews</a>
                        
                        </div>
                    </div>
                </div>
    
                <SuggestedProducts 
                    currentProductId={productId} 
                    category={null} 
                    maxSuggestions={3} 
                />
            </>
        )
    }
    return (
        <>
            <div className="main-content">
                <div id="left">
                    <div className="main-image">
                        <img src={mainImage || product.image} alt="" />
                    </div>
                    <div className="thumbnails">
                        <img 
                            src={product.image} 
                            alt="" 
                            onClick={() => setMainImage(product.image)}
                        />
                        <img 
                            src={product.image1} 
                            alt="" 
                            onClick={() => setMainImage(product.image1)}
                        />
                        <img 
                            src={product.image2} 
                            alt="" 
                            onClick={() => setMainImage(product.image2)}
                        />
                        <img 
                            src={product.image3} 
                            alt="" 
                            onClick={() => setMainImage(product.image3)}
                        />
                    </div>
                </div>

                <div id="right">
                    <div className="title-section">
                        <div className="title">
                            <p id="main">{product.title}</p>
                            <p id="sub">{product.description}</p>
                        </div>

                        <div className="price-link">
                            <div className="title-left">
                                <p>${product.price}/sqft</p>
                            </div>
                            <div className="title-right">
                                <a href="">See in my room</a>
                            </div>
                        </div>

                    </div>

                    <div className="description">
                        <p>
                            {product.overview}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <label htmlFor="quantity" style={{ fontSize: '14px' }}>Sqft:</label>
                                    <input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder="1"
                                        style={{
                                            width: '60px',
                                            padding: '4px 8px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </div>
                                <button 
                                    style={{ 
                                        padding: '8px 16px',
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={handleAddToCart}
                                    disabled={isAdding}
                                >
                                    {isAdding ? 'Adding...' : 'Add to Cart'}
                                </button>
                                <button 
                                    style={{ 
                                        padding: '8px 16px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => console.log('Add to project clicked')}
                                >
                                    Add to Project
                                </button>
                            </div>
                        </div>


                        
                        <a href="">Reviews</a>
                    
                    </div>
                </div>
            </div>

            <SuggestedProducts 
                currentProductId={productId} 
                category={product?.category} 
                maxSuggestions={3} 
            />
        </>
    )
}

ProductDetail.defaultProps = {
    productTitle: "Default title", 
    productCategory: "Default category", 
    price: "Price not available", 
    description: "No description available", 
    mainIm: {defaultImage}, 
    alternate1: {defaultImage}, 
    alternate2: {defaultImage}, 
    suggested1: {defaultImage}, 
    suggested2: {defaultImage}, 
    suggested3: {defaultImage}
}

export default ProductDetail