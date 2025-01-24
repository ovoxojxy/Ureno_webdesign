import * as React from "react";
import { Link } from "react-router-dom";
import "../styles/FlooringProduct.css"; 

const FloorCard = ({image, title, description, price, link}) => {
    return (
        <div className="products">
            <Link to={link} className="container">
                <img src={image} alt={title} />
                <div className="prod-title">{title}</div>
                <p>{description}</p>
                <p>{price}</p>
            </Link>
        </div>
       
    )
}

FloorCard.defaultProps = {
    image: "../assets/images/defaultImage.jpg.webp",
    title: "Default Title",
    description: "No description available",
    price: "Price not available.",
    link: "/"
}

export default FloorCard