import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";
import NewNav from "@/components/ui/newNav";
import Footer from "../components/footer";
import YellowSwatches from "../components/YellowSwatches";
import "../styles/FlooringProduct.css";

export default function YellowShadesPage() {
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

        {/* Yellow Swatches Heading */}
        <h2 style={{
          textAlign: 'center',
          fontSize: '1.8rem',
          marginBottom: '1.5rem',
          color: '#333'
        }}>
          Explore our shades of yellow.
        </h2>
        {/* Yellow Swatches Component */}
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto',
          padding: '0 1rem 4rem'
        }}>
          <YellowSwatches />
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
              About Yellow Paint Colors
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
                background: '#fffbeb',
                border: '1px solid #fde68a'
              }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#d69e2e' }}>
                  Bright & Cheerful
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6', margin: '0' }}>
                  Yellow colors bring sunshine and positivity to any space. Perfect for 
                  kitchens, children's rooms, or anywhere you want to create an uplifting atmosphere.
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                borderRadius: '8px',
                background: '#fffbeb',
                border: '1px solid #fde68a'
              }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#d69e2e' }}>
                  Versatile Tones
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6', margin: '0' }}>
                  From soft butter to vibrant lemon, our yellow collection offers 
                  a range of tones from subtle to bold.
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                borderRadius: '8px',
                background: '#fffbeb',
                border: '1px solid #fde68a'
              }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#d69e2e' }}>
                  Design Tips
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6', margin: '0' }}>
                  Use lighter yellows to brighten dark spaces and deeper yellows for warmth. 
                  Pair with whites and grays for a modern look.
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