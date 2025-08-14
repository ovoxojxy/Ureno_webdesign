import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import NewNav from "../components/ui/newNav";
import Footer from "../components/footer";
import AllPaint from "../components/Paint/AllPaint";
import "../styles/FlooringProduct.css";

export default function PaintProduct() {
  const [navHeight, setNavHeight] = useState(0);
  const { userLoggedIn } = useAuth() || { userLoggedIn: false };

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
        
        {/* Paint Color Selection Component */}
        <div style={{ 
          maxWidth: '1400px', 
          margin: '4rem auto 0',  // adds top margin
          padding: '0 3rem 4rem'
        }}>
          <AllPaint />
        </div>

        {/* Features Section */}
        <div style={{
          background: 'white',
          padding: '4rem 2rem',
          marginTop: '3rem'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ 
              textAlign: 'center', 
              fontSize: '2.5rem', 
              marginBottom: '3rem',
              color: '#333'
            }}>
              Why Choose Our Paint Colors?
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              marginTop: '2rem'
            }}>
              
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                borderRadius: '12px',
                background: '#f8f9fa',
                border: '1px solid #e9ecef'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #ff6b6b, #feca57)',
                  borderRadius: '50%',
                  margin: '0 auto 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  🎨
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
                  Premium Quality
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  High-quality paints with excellent coverage, durability, and color retention 
                  that will keep your walls looking fresh for years.
                </p>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '2rem',
                borderRadius: '12px',
                background: '#f8f9fa',
                border: '1px solid #e9ecef'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #74b9ff, #0984e3)',
                  borderRadius: '50%',
                  margin: '0 auto 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  🌈
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
                  Vast Color Selection
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Choose from hundreds of carefully curated colors organized by family, 
                  making it easy to find your perfect shade.
                </p>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '2rem',
                borderRadius: '12px',
                background: '#f8f9fa',
                border: '1px solid #e9ecef'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #55a3ff, #003d82)',
                  borderRadius: '50%',
                  margin: '0 auto 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  ✨
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
                  Expert Support
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Get personalized color recommendations and professional advice 
                  to help you make the perfect choice for your project.
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