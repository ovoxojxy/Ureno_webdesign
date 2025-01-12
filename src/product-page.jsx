import { Link } from "react-router-dom"
import profileSVG from './assets/images/profile-svgrepo-com.svg'
import harvestGrove from './assets/images/Harvest-grove-rigid.png'
import tavertine from './assets/images/tavertine.png'
import champagne from './assets/images/champagne.png'
import luxury from './assets/images/luxury.png'
import champagne2 from './assets/images/champage2.png'
import harvest from './assets/images/harvest.png'
import "./FlooringProduct.css"

export default function FlooringProduct() {
    return(
        <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="./FlooringProduct.css" />
  <title>URENO</title>
  <div className="nav">
    <div className="logo">
        URENO
    </div>
    <div className="Right">
      <menu>
        <li>AI Design</li>
        <li>Projects</li>
        <li>Messages</li>
      </menu>
      <button className="btn login-btn">Log In</button>
      <button className="btn profile-btn">
        <object data="images/profile-svgrepo-com.svg" type="image/svg+xml">
          <img src="images/profile-svgrepo-com.svg" />
        </object>
      </button>
    </div>
  </div>
  <div className="main-content">
    <h1>Flooring</h1>
    <div className="search">
      <div className="input">
        <input type="text" className="search-bar" defaultValue="Search" />
      </div>
      <div className="filter">Filter</div>
    </div>
    <p>Popular</p>
    <div className="products">
      <div className="container">
        <img src={harvestGrove} alt="" />
        <div className="prod-title">Harvest Grove Rigid Luxury Vinyl</div>
        <p>Floor and Decor</p>
        <p>$2.19/sqft</p>
      </div>
      <div className="container">
        <img src={tavertine} alt="" />
        <div className="prod-title">Inverness Tavertine Vinyl</div>
        <p>Floor and Decor</p>
        <p>$2.19/sqft</p>
      </div>
      <div className="container">
        <img src={champagne} alt="" />
        <div className="prod-title">
          Champagne Limestone Rigid Core Luxury Vinyl
        </div>
        <p>Floor and Decor</p>
        <p>$2.19/sqft</p>
      </div>
      <div className="container">
        <img src={luxury} alt="" />
        <div className="prod-title">Harvest Grove Rigid Luxury Vinyl</div>
        <p>Floor and Decor</p>
        <p>$2.19/sqft</p>
      </div>
      <div className="container">
        <img src={harvest} alt="" />
        <div className="prod-title">Inverness Tavertine Vinyl</div>
        <p>Floor and Decor</p>
        <p>$2.19/sqft</p>
      </div>
      <div className="container">
        <img src={champagne2} alt="" />
        <div className="prod-title">
          Champagne Limestone Rigid Core Luxury Vinyl
        </div>
        <p>Floor and Decor</p>
        <p>$2.19/sqft</p>
      </div>
    </div>
  </div>
</>

    );
}