import { Link } from "react-router-dom";
import Footer from "../components/footer";
import NewNav from "@/components/ui/newNav";
import ProductDetail from "../components/product-detail";

import '../styles/productDetailPage.css'


export default function ProductDetailPage() {
    return (
        <>
        <div className="product-detail-page">
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>product detail</title>
            
             <NewNav />
            <ProductDetail />
            <Footer />
        </div>
            
        </>
        
    )
}