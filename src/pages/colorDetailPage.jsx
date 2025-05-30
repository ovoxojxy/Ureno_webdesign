import { useAuth } from "@/contexts/authContext";
import NewNav from "@/components/ui/newNav";
import Footer from "../components/footer";
import ColorDetail from "../components/color-detail";
import "../styles/productDetailPage.css";

export default function ColorDetailPage() {
  const { userLoggedIn } = useAuth() || { userLoggedIn: false };

  const pageContainerStyle = {
    paddingTop: '80px', // Adjust this if your nav height changes
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  };

  return (
    <>
      <div className="product-detail-page">
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Color Detail</title>
        
        <NewNav />
        <div style={pageContainerStyle}>
          <ColorDetail />
        </div>
        <Footer />
      </div>
    </>
  );
}