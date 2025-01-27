import * as React from "react";
import { Link } from "react-router-dom";
import "../styles/FlooringProduct.css"; 

const FloorCard = ({productId, image, title, description, price, link}) => {
    return (
        <div className="products">
            <Link to={`/productDetail/${productId}`} className="container">
                <img src={image} alt={title} />
                <div className="prod-title">{title}</div>
                <p>{description}</p>
                <p>{price}</p>
            </Link>
        </div>
       
    )
}

FloorCard.defaultProps = {
    productId: "default-id",
    image: "../assets/images/defaultImage.jpg.webp",
    title: "Default Title",
    description: "No description available",
    price: "Price not available.",
    link: "/productDetail"
}

export default FloorCard