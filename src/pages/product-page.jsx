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
import { useEffect } from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/authContext"
import { getFirestore, collection, getDocs } from "firebase/firestore"

export default function FlooringProduct() {

  const [navHeight, setNavHeight] = useState(0);
  const { userLoggedIn } = useAuth() || { userLoggedIn: false }
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList); 
    }

    fetchProducts();
  }, []);
  useEffect(() => {
    const updateNavHeight = () => {
      const navElement = document.querySelector(".nav")
      if (navElement) {
        setNavHeight(navElement.offsetHeight)
      }
    }

    updateNavHeight()
    window.addEventListener("resize", updateNavHeight)

    return () => {
      window.removeEventListener("resize", updateNavHeight)
    }
  }, [])

    return(
        <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>URENO</title>
  <Nav />
  <div className="body">

  <div className={`main-content ${userLoggedIn ? "logged-in" : ""}`}>
    <h1>Flooring</h1>
    <div className="search">
      <div className="input">
        <input type="text" className="search-bar" placeholder="Search" />
      </div>
      <div className="filter">Filter</div>
    </div>
    <p>Popular</p>
    <div className="products">
      {/* <FloorCard 
        productId="HarvestGrove"
        image={harvestGrove}
        title="Harvest Grove Rigid Luxury Vinyl"
        description="Floor and Decor"
        price="$2.19/sqft"
        link="/productDetail"
      />
      <FloorCard
        productId= "tavertine"
        image={tavertine}
        title="Inverness Tavertine Vinyl"
        description="Floor and Decor"
        price="$2.19/sqft"
      />
      <FloorCard
        productId= "Champagne"
        image={champagne}
        title="Champagne Limestone Rigid Core Luxury Vinyl"
        description="Floor and Decor"
        price="2.19/sqft"
      />
      <FloorCard
        productId= "Luxury"
        image={luxury}
        title="Harvest Grove Rigid Luxury Vinyl"
        description="Floor and Decor"
        price="$2.19/sqft"
      />
      <FloorCard
        productId= "Harvest"
        image={harvest}
        title="Inverness Tavertine Vinyl"
        description="Floor and Decor"
        price="2.19/sqft"
      />
      <FloorCard
      productId= "Champagne2"
      image={champagne2}
      title="Champagne Limestone Rigid Core Luxury Vinyl"
      description="Floor and Decor"
      price="$2.19/sqft"
      />*/}

      {products.map(product => (
        <FloorCard
        key={product.id}
        productId={product.id}
        image={product.image}
        title={product.title}
        description={product.description}
        price={product.price}
        link={product.link}
        />
      ))}
    </div>
  </div>
  <Footer />
  </div>
  
</>

    );
}