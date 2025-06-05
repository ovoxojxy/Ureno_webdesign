import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firestore";

const ColorDetail = () => {
  const { colorId } = useParams();
  const navigate = useNavigate();
  const [color, setColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColor = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "colors", colorId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const colorData = { id: docSnap.id, ...docSnap.data() };
          setColor(colorData);
        } else {
          setError("Color not found");
        }
      } catch (error) {
        console.error("Error fetching color: ", error);
        setError("Failed to load color details");
      } finally {
        setLoading(false);
      }
    };

    if (colorId) fetchColor();
  }, [colorId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading color details...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Color Not Found</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>{error}</p>
        <button 
          onClick={() => navigate('/red-shades')}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Back to Red Shades
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/red-shades')}
        style={{
          background: 'transparent',
          border: '1px solid #ccc',
          color: '#666',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '2rem',
          fontSize: '0.9rem',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.background = '#f5f5f5';
          e.target.style.borderColor = '#999';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.borderColor = '#ccc';
        }}
      >
        ← Back to Red Shades
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'start'
      }}>
        
        {/* Left Side - Color Display */}
        <div>
          {/* Main Color Display */}
          <div style={{
            width: '100%',
            height: '400px',
            backgroundColor: color.hex,
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '1rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {color.image && (
              <img 
                src={color.image} 
                alt={color.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
                onError={(e) => {
                  // Hide image if it fails to load, showing just the color background
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>
          
          {/* Color Info Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <div style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                HEX CODE
              </div>
              <div 
                style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  color: '#333'
                }}
                onClick={() => copyToClipboard(color.hex)}
                title="Click to copy"
              >
                {color.hex}
              </div>
            </div>
            
            {color.category && (
              <div style={{
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                  CATEGORY
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>
                  {color.category}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Color Details */}
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#333',
            marginBottom: '0.5rem'
          }}>
            {color.name}
          </h1>
          
          {color.brand && (
            <p style={{
              fontSize: '1.1rem',
              color: '#666',
              marginBottom: '2rem'
            }}>
              by {color.brand}
            </p>
          )}

          {color.description && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#333' }}>
                Description
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                {color.description}
              </p>
            </div>
          )}

          {/* Color Properties */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#333' }}>
              Color Properties
            </h3>
            
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {color.finish && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#666' }}>Finish:</span>
                  <span style={{ fontWeight: '500' }}>{color.finish}</span>
                </div>
              )}
              
              {color.coverage && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#666' }}>Coverage:</span>
                  <span style={{ fontWeight: '500' }}>{color.coverage}</span>
                </div>
              )}
              
              {color.price && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#666' }}>Price:</span>
                  <span style={{ fontWeight: '500' }}>{color.price}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => copyToClipboard(color.hex)}
              style={{
                background: color.hex,
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Copy Color Code
            </button>
            
            <button 
              style={{
                background: 'transparent',
                color: '#666',
                border: '1px solid #ccc',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f5f5f5';
                e.target.style.borderColor = '#999';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = '#ccc';
              }}
            >
              Save to Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorDetail;