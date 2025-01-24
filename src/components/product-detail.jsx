import * as React from "react";
import Nav from "./nav";
import Footer from "./footer";
import FloorCard from "./flooringCards";
import { useParams } from "react-router-dom";
import '../styles/index.css'
import harvestGrove from '../assets/images/Harvest-grove-rigid.png'
import "../styles/FlooringProduct.css"

const ProductDetail = () => {

    const { id } = useParams()

    const product = [{
        id: "harvest-grove-rigid-luxury-vinyl",
        name: "Harvest Grove Rigid Luxury Vinyl",
        description: "A beautiful, durable flooring option.",
        price: "$2.19/sqft",
        image: '../assets/images/Harvest-grove-rigid.png'
    }
]

    return (
        <>
            <Nav />
            <FloorCard
                    image={harvestGrove}
                    title="Harvest Grove Rigid Luxury Vinyl"
                    description="Floor and Decor"
                    price="$2.19/sqft"
                    link="/product/harvest"
                  />
            <Footer />
        </>
        
    )
}

export default ProductDetail