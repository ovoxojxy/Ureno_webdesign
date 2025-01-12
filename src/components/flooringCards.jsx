import * as React from "react";

const FloorCard = ({image, title, description, price}) => {
    return (
        <div className="container">
            <img src={image} alt={title} />
            <div className="prod-title">{title}</div>
            <p>{description}</p>
            <p>{price}</p>
        </div>
    )
}

FloorCard.defaultProps = {
    image: "../assets/images/defaultImage.jpg.webp",
    title: "Default Title",
    description: "No description available",
    price: "Price not available.",
}

export default FloorCard