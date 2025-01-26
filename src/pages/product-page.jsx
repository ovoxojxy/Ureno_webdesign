import { Link } from "react-router-dom"
import harvestGrove from '../assets/images/Harvest-grove-rigid.png'
import tavertine from '../assets/images/tavertine.png'
import champagne from '../assets/images/champagne.png'
import luxury from '../assets/images/luxury.png'
import champagne2 from '../assets/images/champage2.png'
import harvest from '../assets/images/harvest.png'
import Nav from "../components/nav"
import Footer from "../components/footer"
import FloorCard from "../components/flooringCards"
import "../styles/FlooringProduct.css"

export default function FlooringProduct() {
    return(
        <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>URENO</title>
  <Nav />
  <div className="main-content">
    <h1>Flooring</h1>
    <div className="search">
      <div className="input">
        <input type="text" className="search-bar" placeholder="Search" />
      </div>
      <div className="filter">Filter</div>
    </div>
    <p>Popular</p>
    <div className="products">
      <FloorCard
        image={harvestGrove}
        title="Harvest Grove Rigid Luxury Vinyl"
        description="Floor and Decor"
        price="$2.19/sqft"
        link="/productDetail"
      />
      <FloorCard
        image={tavertine}
        title="Inverness Tavertine Vinyl"
        description="Floor and Decor"
        price="$2.19/sqft"
      />
      <FloorCard
        image={champagne}
        title="Champagne Limestone Rigid Core Luxury Vinyl"
        description="Floor and Decor"
        price="2.19/sqft"
      />
      <FloorCard
        image={luxury}
        title="Harvest Grove Rigid Luxury Vinyl"
        description="Floor and Decor"
        price="$2.19/sqft"
      />
      <FloorCard
        image={harvest}
        title="Inverness Tavertine Vinyl"
        description="Floor and Decor"
        price="2.19/sqft"
      />
      <FloorCard
      image={champagne2}
      title="Champagne Limestone Rigid Core Luxury Vinyl"
      description="Floor and Decor"
      price="$2.19/sqft"
      />
    </div>
  </div>
  <Footer />
</>

    );
}