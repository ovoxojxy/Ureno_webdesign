import * as React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import mainImage from "../assets/images/Harvest-grove-rigid.png"
import alt1 from "../assets/images/harvest-alt1.png"
import alt2 from "../assets/images/harvest-alt2.png"
import defaultImage from "../assets/images/Image-not-found.png"

const ProductDetail = () => {

    const { productId } = useParams()
    const products = [
        {
            id: "HarvestGrove",
            productTitle: "Harvest Grove Rigid Luxury Vinyl",
            productCategory:"Floor and Decor",
            price: "$2.19/sqft",
            description: "Default",
            mainIm: {defaultImage},
            alternate1: {defaultImage}, 
            alternate2: {defaultImage}
        },
        
        {

            id: "tavertine",
            productTitle: "Inverness Tavertine Vinyl",
            productCategory:"Floor and Decor",
            price: "$2.19/sqft",
            description: "Default",
            mainIm: {defaultImage},
            alternate1: {defaultImage}, 
            alternate2: {defaultImage}
        },

        {

            id: "Champagne",
            productTitle: "Champagne Limestone Rigid Core Luxury Vinyl",
            productCategory:"Floor and Decor",
            price: "$2.19/sqft",
            description: "Default",
            mainIm: {defaultImage},
            alternate1: {defaultImage}, 
            alternate2: {defaultImage}
        },

        {
            
            id: "Luxury",
            productTitle: "Harvest Grove Rigid Luxury Vinyl",
            productCategory:"Floor and Decor",
            price: "$2.19/sqft",
            description: "Default",
            mainIm: {defaultImage},
            alternate1: {defaultImage}, 
            alternate2: {defaultImage}
        },

        {
            
            id: "Harvest",
            productTitle: "Inverness Tavertine Vinyl",
            productCategory:"Floor and Decor",
            price: "$2.19/sqft",
            description: "Default",
            mainIm: {defaultImage},
            alternate1: {defaultImage}, 
            alternate2: {defaultImage}
        },

        {

            id: "Champagne2",
            productTitle: "Champagne Limestone Rigid Core luxiry Vinyl",
            productCategory:"Floor and Decor",
            price: "$2.19/sqft",
            description: "Default",
            mainIm: {defaultImage},
            alternate1: {defaultImage}, 
            alternate2: {defaultImage}
        }

    ]

    const product = products.find((prod) => prod.id === productId)

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
    
                <div className="secondary-content">
                    <div className="suggestedProduct">
                        <div className="container">
                            <img src={defaultImage} alt="{title}" />
                            <div className="prod-title">
                                {"{"}title{"}"}
                            </div>
                            <p>
                                {"{"}description{"}"}
                            </p>
                            <p> 
                                {"{"}price{"}"}
                            </p>
                        </div>
                    </div>
                    
                    <div className="suggestedProduct">
                        <div className="container">
                            <img src={defaultImage} alt="{title}" />
                            <div className="prod-title">
                                {"{"}title{"}"}
                            </div>
                            <p>
                                {"{"}description{"}"}
                            </p>
                            <p>
                                {"{"}price{"}"}
                            </p>
                        </div>
                    </div>
    
                    <div className="suggestedProduct">
                        <div className="container">
                            <img src={defaultImage} alt="{title}" />
                            <div className="prod-title">
                            {"{"}title{"}"}
                            </div>
                            <p>
                            {"{"}description{"}"}
                            </p>
                            <p>
                            {"{"}price{"}"}
                            </p>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    return (
        <>
            <div className="main-content">
                <div id="left">
                    <div className="main-image">
                        <img src={product.mainIm} alt="" />
                    </div>
                    <div className="thumbnails">
                        <img src={product.mainIm} alt="" />
                        <img src={product.alternate1} alt="" />
                        <img src={product.alternate2} alt="" />
                    </div>
                </div>

                <div id="right">
                    <div className="title-section">
                        <div className="title">
                            <p id="main">{product.productTitle}</p>
                            <p id="sub">{product.productCategory}</p>
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
                            {product.description}
                        </p>

                        <ul>
                            <li>
                                Install up to 6,400 square feetNo need for transition molding.
                            </li>
                            
                            <li>
                                You can install it right awayPre-installation acclimation is
                                unnecessary.
                            </li>
                            
                            <li>Attached foam underlayment makes for a quieter, warmer floor.</li>
                        
                            <li>
                                Can be installed on, above, and below grade-level (perfect for
                                basements!) and over most existing hard-surface flooring, including
                                slightly irregular subfloors.
                            </li>
                            
                            <li>
                            This DuraLux Performance product is backed by a lifetime res./ 15 yr
                            comm. warranty.
                            </li>
                        
                            <li>
                                It is recommended to use Sentinel Protect Plus Underlayment for
                                optimal sound absorption and moisture resistance or a standard vapor
                                barrier like 6mil PE Film.
                            </li>
                        </ul>

                        <a href="">Product Details</a>
                        <a href="">Reviews</a>
                    
                    </div>
                </div>
            </div>

            <div className="secondary-content">
                <div className="suggestedProduct">
                    <div className="container">
                        <img src={defaultImage} alt="{title}" />
                        <div className="prod-title">
                            {"{"}title{"}"}
                        </div>
                        <p>
                            {"{"}description{"}"}
                        </p>
                        <p> 
                            {"{"}price{"}"}
                        </p>
                    </div>
                </div>
                
                <div className="suggestedProduct">
                    <div className="container">
                        <img src={defaultImage} alt="{title}" />
                        <div className="prod-title">
                            {"{"}title{"}"}
                        </div>
                        <p>
                            {"{"}description{"}"}
                        </p>
                        <p>
                            {"{"}price{"}"}
                        </p>
                    </div>
                </div>

                <div className="suggestedProduct">
                    <div className="container">
                        <img src={defaultImage} alt="{title}" />
                        <div className="prod-title">
                        {"{"}title{"}"}
                        </div>
                        <p>
                        {"{"}description{"}"}
                        </p>
                        <p>
                        {"{"}price{"}"}
                        </p>
                    </div>
                </div>
            </div>
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