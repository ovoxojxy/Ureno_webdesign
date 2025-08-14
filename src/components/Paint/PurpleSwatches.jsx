import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPaintColorsByCategory } from '../../firebase/firestore';

const PurpleSwatches = () => {
  const navigate = useNavigate();
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Organize database colors into strips for the color wall layout
  const organizeColorsIntoStrips = (paintColors) => {
    if (!paintColors.length) return [];
    
    // Convert colors to HSL for better sorting
    const colorsWithHSL = paintColors.map(color => ({
      ...color,
      hsl: hexToHSL(color.hex)
    }));
    
    // Group by hue ranges first (different purple tones)
    const hueGroups = {};
    colorsWithHSL.forEach(color => {
      const hue = color.hsl.h;
      // Group by hue ranges: blue-purples (250-280), pure purples (280-320), red-purples (320-360)
      let hueGroup;
      if (hue >= 280 && hue <= 320) {
        hueGroup = 'pure-purple'; // Pure purples
      } else if (hue >= 250 && hue < 280) {
        hueGroup = 'blue-purple'; // Blue-purples
      } else if (hue > 320 || hue < 20) {
        hueGroup = 'red-purple'; // Red-purples (includes wraparound)
      } else {
        hueGroup = 'other'; // Other purples
      }
      
      if (!hueGroups[hueGroup]) hueGroups[hueGroup] = [];
      hueGroups[hueGroup].push(color);
    });
    
    // Sort each hue group by saturation and lightness
    Object.keys(hueGroups).forEach(group => {
      hueGroups[group].sort((a, b) => {
        // Primary sort: saturation (high to low for vibrancy)
        const satDiff = b.hsl.s - a.hsl.s;
        if (Math.abs(satDiff) > 10) return satDiff;
        
        // Secondary sort: lightness (light to dark)
        return b.hsl.l - a.hsl.l;
      });
    });
    
    // Combine groups in a pleasing order
    const groupOrder = ['blue-purple', 'pure-purple', 'red-purple', 'other'];
    const sortedColors = [];
    groupOrder.forEach(groupName => {
      if (hueGroups[groupName]) {
        sortedColors.push(...hueGroups[groupName]);
      }
    });
    
    // Organize into strips with gradient consideration
    const stripsCount = Math.min(10, Math.ceil(sortedColors.length / 9));
    const colorsPerStrip = Math.ceil(sortedColors.length / stripsCount);
    
    const colorStrips = [];
    for (let i = 0; i < stripsCount; i++) {
      const stripStart = i * colorsPerStrip;
      const stripEnd = Math.min(stripStart + colorsPerStrip, sortedColors.length);
      let stripColors = sortedColors.slice(stripStart, stripEnd);
      
      // Sort each strip by lightness for vertical gradient
      stripColors.sort((a, b) => b.hsl.l - a.hsl.l);
      
      // Add strip information to each color
      const stripWithInfo = stripColors.map((color, index) => ({
        ...color,
        strip: i,
        position: index
      }));
      
      colorStrips.push(stripWithInfo);
    }
    
    // Determine max strip length and pad shorter strips with nulls
    const maxStripLength = Math.max(...colorStrips.map(strip => strip.length));
    const paddedStrips = colorStrips.map(strip => {
      const newStrip = [...strip];
      while (newStrip.length < maxStripLength) {
        newStrip.push(null);
      }
      return newStrip;
    });
    setColors(paddedStrips);
  };

  // Convert hex to HSL
  const hexToHSL = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Extract lightness from hex color
  const extractLightness = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return (max + min) / 2 * 100;
  };

  // Helper function to convert HSL to HEX
  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const handleColorClick = (color) => {
    // Navigate to color detail page using the color's database ID
    navigate(`/colorDetail/${color.id}`);
  };

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
  };

  useEffect(() => {
    const fetchPurpleColors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch purple paint colors from database
        const purplePaintColors = await getPaintColorsByCategory('purples');
        
        if (purplePaintColors.length > 0) {
          // Use real database colors
          const organizedColors = organizeColorsIntoStrips(purplePaintColors);
          // setColors is called inside organizeColorsIntoStrips after padding
        } else {
          // Fallback to generated colors if no database colors found
          console.warn('No purple paint colors found in database, using generated colors');
          const generatedColors = generateFallbackColors();
          setColors(generatedColors);
        }
      } catch (err) {
        console.error('Error fetching paint colors:', err);
        setError(err.message);
        
        // Fallback to generated colors on error
        const generatedColors = generateFallbackColors();
        setColors(generatedColors);
      } finally {
        setLoading(false);
      }
    };

    fetchPurpleColors();
  }, []);

  // Fallback function for when database is empty or fails
  const generateFallbackColors = () => {
    const colorStrips = [];
    
    for (let strip = 0; strip < 10; strip++) {
      const baseHue = 270 + (strip * 5); // Purple hues range from 270-320
      const baseSaturation = 70 + (strip * 3);
      
      const stripColors = [];
      
      for (let shade = 0; shade < 9; shade++) {
        const lightness = 90 - (shade * 10);
        const adjustedSaturation = Math.min(baseSaturation + (shade * 2), 100);
        
        stripColors.push({
          id: `fallback-${strip}-${shade}`,
          name: `Purple ${strip + 1}-${shade + 1}`,
          hex: hslToHex(baseHue, adjustedSaturation, lightness),
          lightness: lightness,
          strip: strip,
          position: shade
        });
      }
      
      colorStrips.push(stripColors);
    }
    
    return colorStrips;
  };

  return (
    <>
      <style jsx>{`
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #805ad5;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          font-size: 1rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .color-wall {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .color-strips-container {
          background: #e2e8f0;
          padding: 1rem;
          border-radius: 8px;
        }

        .color-strip {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          max-width: 120px;
        }

        .color-chip {
          aspect-ratio: 1;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .color-chip:hover {
          transform: scale(1.05);
          z-index: 10;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          border: 2px solid #333;
        }

        .color-chip:first-child {
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
        }

        .color-chip:last-child {
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
        }

        .color-info-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.9);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
          z-index: 1000;
        }

        .color-chip:hover .color-info-tooltip {
          opacity: 1;
        }

        .selected-color-panel {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          z-index: 1000;
          min-width: 250px;
          border: 1px solid #e2e8f0;
        }

        .selected-color-panel h3 {
          margin: 0 0 1rem 0;
          font-size: 1.2rem;
          color: #333;
        }

        .color-preview {
          width: 100%;
          height: 80px;
          border-radius: 8px;
          margin-bottom: 1rem;
          border: 1px solid #e2e8f0;
        }

        .color-details {
          font-size: 0.9rem;
          color: #666;
        }

        .hex-value {
          font-family: 'Courier New', monospace;
          background: #f7fafc;
          padding: 0.5rem;
          border-radius: 6px;
          margin: 0.5rem 0;
          cursor: pointer;
          text-align: center;
          border: 1px solid #e2e8f0;
        }

        .hex-value:hover {
          background: #edf2f7;
          border-color: #cbd5e0;
        }

        .strip-labels {
          display: flex;
          gap: 2px;
          justify-content: center;
          margin-bottom: 1rem;
          padding: 0 1rem;
        }

        .strip-label {
          flex: 1;
          max-width: 120px;
          text-align: center;
          font-size: 0.8rem;
          color: #666;
          font-weight: 500;
        }

        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #999;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          color: #333;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="container">

        {loading ? (
          <div className="color-wall">
            <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Loading paint colors...</div>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '3px solid #f3f3f3', 
                borderTop: '3px solid #805ad5',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}></div>
            </div>
          </div>
        ) : (
          <div className="color-wall">
            <div className="strip-labels">
              {colors.map((_, i) => (
                <div key={i} className="strip-label">Strip {i + 1}</div>
              ))}
            </div>
            
            <div className="color-strips-container" style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${colors.length}, 1fr)`,
              gap: '4px'
            }}>
              {Array.from({ length: colors[0].length }).map((_, rowIndex) => (
                colors.map((strip, colIndex) => {
                  const color = strip[rowIndex];
                  return color ? (
                    <div
                      key={`${colIndex}-${rowIndex}`}
                      className="color-chip"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleColorClick(color)}
                    >
                      <div className="color-info-tooltip">
                        {color.name}<br/>{color.hex}
                      </div>
                    </div>
                  ) : (
                    <div key={`${colIndex}-${rowIndex}`} className="color-chip" style={{ backgroundColor: "transparent", border: "none" }} />
                  );
                })
              ))}
            </div>
          </div>
        )}

        {selectedColor && (
          <div className="selected-color-panel">
            <button 
              className="close-button"
              onClick={() => setSelectedColor(null)}
            >
              ×
            </button>
            <h3>{selectedColor.name}</h3>
            <div
              className="color-preview"
              style={{ backgroundColor: selectedColor.hex }}
            />
            <div 
              className="hex-value"
              onClick={() => copyToClipboard(selectedColor.hex)}
              title="Click to copy"
            >
              {selectedColor.hex}
            </div>
            <div className="color-details">
              {selectedColor.brand && <span>Brand: {selectedColor.brand}<br/></span>}
              {selectedColor.finish && <span>Finish: {selectedColor.finish}<br/></span>}
              Strip: {selectedColor.strip + 1}<br/>
              Position: {selectedColor.position + 1}<br/>
              Click hex code to copy
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PurpleSwatches;