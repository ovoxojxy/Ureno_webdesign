import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/firestore";
import defaultImage from "../assets/images/Image-not-found.png"
import SuggestedProducts from "./SuggestedProducts"

const ProductDetail = () => {

    const { productId } = useParams()
    const [product, setProduct] = useState(null)
    const [mainImage, setMainImage] = useState(null)

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
    
                            <a href="">View specifications</a>
                        </div>
    
                        <div className="description">
                            <p>
                                Default Description
                            </p>
    
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
                                <p>{product.price}</p>
                            </div>
                            <div className="title-right">
                                <a href="">See in my room</a>
                            </div>
                        </div>

                        <a href="">View specifications</a>
                    </div>

                    <div className="description">
                        <p>
                            {product.description}
                        </p>

                        <p>
                            {product.overview}
                        </p>

                        <a href="">Product Details</a>
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