import * as React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import "../styles/FlooringProduct.css"; 

const FloorCard = ({productId, image, title, description, price, link}) => {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = React.useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Quick add confirmation
        const confirmed = window.confirm(
            `Add 1 sqft of "${title}" to your cart?\n\nPrice: ${price}`
        );
        
        if (!confirmed) return;
        
        setIsAdding(true);
        try {
            const product = {
                id: productId,
                title,
                description,
                price,
                image,
                category: 'flooring'
            };
            await addToCart(product, 1);
            alert(`Successfully added "${title}" to your cart!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart. Please try again.');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="products">
            <Link to={`/productDetail/${productId}`} className="container">
                <img src={image} alt={title} />
                <div className="prod-title">{title}</div>
                <p>{description}</p>
                <p>{price}</p>
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    style={{
                        marginTop: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        width: '100%'
                    }}
                >
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                </button>
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