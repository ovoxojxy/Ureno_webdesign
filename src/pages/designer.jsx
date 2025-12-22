import Footer from "../components/footer";
import Nav from "../components/ui/newNav";
import WorldDesigner from "../components/AI_Design/WorldDesigner";

import '../styles/productDetailPage.css'


export default function DesignerPage() {
    return (
        <>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Designer</title>

        <Nav />
        <WorldDesigner />
        <Footer />
            
        
            
        </>
        
    )
}