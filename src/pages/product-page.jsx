import { Link } from "react-router-dom"
import { useEffect } from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/authContext"
import { getFirestore, collection, getDocs } from "firebase/firestore"

import harvestGrove from '../assets/images/Harvest-grove-rigid.png'
import tavertine from '../assets/images/tavertine.png'
import champagne from '../assets/images/champagne.png'
import luxury from '../assets/images/luxury.png'
import champagne2 from '../assets/images/champage2.png'
import harvest from '../assets/images/harvest.png'
import NewNav from "@/components/ui/newNav"
import Footer from "../components/footer"
import FloorCard from "../components/flooringCards"
import "../styles/FlooringProduct.css"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx"


export default function FlooringProduct() {

  const [navHeight, setNavHeight] = useState(0);
  const { userLoggedIn } = useAuth() || { userLoggedIn: false }
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("");
  const productsPerPage = 20

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = getFirestore();
        console.log("Attempting to fetch products from Firestore...");
        const querySnapshot = await getDocs(collection(db, "products"));
        console.log("Products fetched successfully:", querySnapshot.size);
        const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productList);

        
      } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback to hardcoded products
        setProducts([
          {
            id: "HarvestGrove",
            image: harvestGrove,
            title: "Harvest Grove Rigid Luxury Vinyl",
            description: "Floor and Decor",
            price: "$2.19/sqft"
          },
          {
            id: "tavertine",
            image: tavertine,
            title: "Inverness Tavertine Vinyl",
            description: "Floor and Decor",
            price: "$2.19/sqft"
          }
        ]);
      }
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
   <NewNav />
  <div className="body">

  <div className={`main-content ${userLoggedIn ? "logged-in" : ""}`}>
    <h1 className="page-title">Flooring</h1>

    <div className="search">
      <div className="input">
        <input
          type="text"
          className="search-bar"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page on new search
          }}
        />
      </div>
    </div>
    <p>Popular</p>
    <div className="products">
      {currentProducts.map(product => (
        <FloorCard
        key={product.id}
        productId={product.id}
        image={product.image}
        title={product.title}
        description={product.description}
        price={typeof product.price === "number" ? `$${product.price}/sqft` : product.price}
        link={product.link}
        />
      ))}
    </div>
    
    <div className="flex justify-center mt-8 mb-8">
      <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        onClick={() =>
          setCurrentPage(prev => Math.max(prev - 1, 1))
        }
      />
    </PaginationItem>

    {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
      <PaginationItem key={i + 1}>
        <PaginationLink
          isActive={currentPage === i + 1}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    ))}

    <PaginationItem>
      <PaginationNext
        onClick={() =>
          setCurrentPage(prev =>
            Math.min(prev + 1, Math.ceil(filteredProducts.length / productsPerPage))
          )
        }
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>
    </div>
  </div>
  <Footer />
  </div>
  
</>

    );
}