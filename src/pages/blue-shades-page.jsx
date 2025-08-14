import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import NewNav from "../components/ui/newNav";
import Footer from "../components/footer";
import BlueSwatches from "../components/Paint/BlueSwatches";
import "../styles/FlooringProduct.css";

export default function BlueShadesPage() {
  const [navHeight, setNavHeight] = useState(0);
  const { userLoggedIn } = useAuth() || { userLoggedIn: false };
  const navigate = useNavigate();

  useEffect(() => {
    const updateNavHeight = () => {
      const navElement = document.querySelector(".nav");
      if (navElement) {
        setNavHeight(navElement.offsetHeight);
      }
    };

    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);
    return () => window.removeEventListener("resize", updateNavHeight);
  }, []);

  const pageContainerStyle = {
    marginTop: `${navHeight}px`,
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  };

  return (
    <>
      <NewNav />
      <div className="page-container" style={pageContainerStyle}>
        
        {/* Header Section with Back Button */}
        <div style={{
          color: 'white',
          padding: '6rem 2rem 2rem', // Top padding increased to 6rem
          marginBottom: '2rem'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <button 
              onClick={() => navigate('/paint-page')}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid black',
                color: 'black',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              ← Back to All Colors
            </button>
          </div>
        </div>

        {/* Blue Swatches Heading */}
        <h2 style={{
          textAlign: 'center',
          fontSize: '1.8rem',
          marginBottom: '1.5rem',
          color: '#333'
        }}>
          Explore our shades of blue.
        </h2>
        {/* Blue Swatches Component */}
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto',
          padding: '0 1rem 4rem'
        }}>
          <BlueSwatches />
        </div>

        {/* Information Section */}
        <div style={{
          background: 'white',
          padding: '3rem 2rem',
          marginTop: '2rem'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '1.5rem',
              color: '#333'
            }}>
              About Blue Paint Colors
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginTop: '2rem',
              textAlign: 'left'
            }}>
              
              <div style={{
                padding: '1.5rem',
                borderRadius: '8px',
                background: '#ebf8ff',
                border: '1px solid #90cdf4'
              }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#3182ce' }}>
                  Serene & Peaceful
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6', margin: '0' }}>
                  Blue colors evoke tranquility and spaciousness. Perfect for 
                  bedrooms, bathrooms, or any space where you want to create a calm, relaxing atmosphere.
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                borderRadius: '8px',
                background: '#ebf8ff',
                border: '1px solid #90cdf4'
              }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#3182ce' }}>
                  Timeless Appeal
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6', margin: '0' }}>
                  From navy to sky blue, our blue collection offers 
                  classic colors that never go out of style and work in any decor.
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                borderRadius: '8px',
                background: '#ebf8ff',
                border: '1px solid #90cdf4'
              }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#3182ce' }}>
                  Design Tips
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6', margin: '0' }}>
                  Use lighter blues to make spaces feel larger and deeper blues for drama. 
                  Pair with whites and silvers for a crisp, clean aesthetic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}