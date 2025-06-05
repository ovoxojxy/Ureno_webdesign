import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0';
import Color from 'https://cdn.skypack.dev/color';

const AllPaint = () => {
  const navigate = useNavigate();
  const listRef = useRef(null);
  const settersRef = useRef([]);
  const easesRef = useRef({});

  const [config] = useState({
    theme: 'system',
    swatches:8,
    threshold: 120,
    start: 72,
    distance: 42,
    rotation: -5,
    out: 'power2.out',
    in: 'power4.in',
  });

  const [swatches, setSwatches] = useState([]);
  const [touchedSwatch, setTouchedSwatch] = useState(null);

  const generateSwatches = useCallback(() => {
    settersRef.current.length = 0;
    const customColors = ['#bf2d32', '#f4a045', '#fdb702', '#9aba25', '#019196', '#514c7e', '#c0b9a9', '#f0eadc'];
    const colorLabels = ['Reds', 'Oranges', 'Yellows', 'Greens', 'Blues', 'Purples', 'Neutrals', 'Whites & Pastels'];
    const newSwatches = new Array(config.swatches).fill().map((_, index) => {
      const color = customColors[index % customColors.length];
      const label = colorLabels[index % colorLabels.length];
      const newColor = Color(color);
      return {
        color,
        label,
        isDark: newColor.isDark(),
        index,
      };
    });
    setSwatches(newSwatches);
  }, [config.swatches]);

  const syncWave = useCallback(({ clientX: pointerX, type, target }) => {
    let x = pointerX;
    if (type === 'focus') {
      x = target.getBoundingClientRect().left;
    }

    const list = listRef.current;
    if (!list) return;

    for (let i = 0; i < list.children.length; i++) {
      if (!settersRef.current[i])
        settersRef.current[i] = gsap.utils.pipe(
          ({ distance, width }) => {
            const clamped = gsap.utils.clamp(
              -config.threshold,
              config.threshold,
              distance + width * 0.5
            );
            return { clamped, width };
          },
          ({ clamped, width }) => {
            const mapped = gsap.utils.mapRange(
              -config.threshold,
              config.threshold,
              -1,
              1
            )(clamped);
            return { mapped, active: Math.abs(clamped) <= width * 0.4 };
          },
          ({ mapped, active }) => {
            const offset = active ? 0 : 0;
            return mapped > 0
              ? 1 - easesRef.current.in(mapped) - offset
              : 1 - easesRef.current.out(Math.abs(mapped)) - offset;
          },
          gsap.quickSetter(list.children[i], '--power')
        );
      const child = list.children[i];
      const { left, width } = child.getBoundingClientRect();

      settersRef.current[i]({
        distance: x - (left + width * 0.5),
        width,
      });
    }
  }, [config.threshold]);

  const settleWave = useCallback(() => {
    for (const setter of settersRef.current) setter(0);
  }, []);

  const handleSwatchClick = useCallback((event) => {
    if (event.target.tagName === 'BUTTON') {
      const colorCategory = event.target.dataset.category;
      const swatchIndex = parseInt(event.target.dataset.index);
      
      // Check if this is a touch device
      const isTouchDevice = 'ontouchstart' in window;
      
      if (isTouchDevice) {
        // For touch devices: first tap shows hover state, second tap navigates
        if (touchedSwatch === swatchIndex) {
          // Second tap - navigate
          navigateToColorPage(colorCategory);
          setTouchedSwatch(null);
        } else {
          // First tap - show hover state
          setTouchedSwatch(swatchIndex);
          // Reset touched state after 3 seconds if no second tap
          setTimeout(() => setTouchedSwatch(null), 3000);
        }
      } else {
        // For non-touch devices: immediate navigation
        navigateToColorPage(colorCategory);
      }
    }
  }, [navigate, touchedSwatch]);

  const navigateToColorPage = useCallback((colorCategory) => {
    if (colorCategory === 'Reds') {
      navigate('/red-shades');
    } else if (colorCategory === 'Oranges') {
      navigate('/orange-shades');
    } else if (colorCategory === 'Yellows') {
      navigate('/yellow-shades');
    } else if (colorCategory === 'Greens') {
      navigate('/green-shades');
    } else if (colorCategory === 'Blues') {
      navigate('/blue-shades');
    } else if (colorCategory === 'Purples') {
      navigate('/purple-shades');
    } else if (colorCategory === 'Neutrals') {
      navigate('/neutral-shades');
    } else if (colorCategory === 'Whites & Pastels') {
      navigate('/white-shades');
    }
    // Add other color categories as needed
  }, [navigate]);

  const update = useCallback(() => {
    document.documentElement.dataset.theme = config.theme;
    const list = listRef.current;
    if (list) {
      list.style.setProperty('--offset-y', config.start);
      list.style.setProperty('--distance', config.distance);
      list.style.setProperty('--rotate', config.rotation);
      list.style.setProperty('--swatch-count', config.swatches);
    }
    easesRef.current.in = gsap.parseEase(config.in);
    easesRef.current.out = gsap.parseEase(config.out);
  }, [config]);

  useEffect(() => {
    easesRef.current = {
      in: gsap.parseEase(config.in),
      out: gsap.parseEase(config.out),
    };
  }, [config.in, config.out]);

  useEffect(() => {
    generateSwatches();
  }, [generateSwatches]);

  useEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    // Config panel removed for production use
  }, [generateSwatches, update]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Reddit+Mono:wght@200..900&display=swap');
        @import url('https://unpkg.com/normalize.css') layer(normalize);

        :global(:root) {
          --ease: linear(
            0 0%,
            0.2342 12.49%,
            0.4374 24.99%,
            0.6093 37.49%,
            0.6835 43.74%,
            0.7499 49.99%,
            0.8086 56.25%,
            0.8593 62.5%,
            0.9023 68.75%,
            0.9375 75%,
            0.9648 81.25%,
            0.9844 87.5%,
            0.9961 93.75%,
            1 100%
          );
          --font-size-min: 16;
          --font-size-max: 20;
          --font-ratio-min: 1.2;
          --font-ratio-max: 1.33;
          --font-width-min: 375;
          --font-width-max: 1500;
        }

        :global(html) {
          color-scheme: light dark;
        }

        :global([data-theme='light']) {
          color-scheme: light only;
        }

        :global([data-theme='dark']) {
          color-scheme: dark only;
        }

        :global(*),
        :global(*:after),
        :global(*:before) {
          box-sizing: border-box;
        }

        :global(body) {
          background: light-dark(#fff, #000);
          display: grid;
          place-items: center;
          min-height: 100vh;
          font-family: 'SF Pro Text', 'SF Pro Icons', 'AOS Icons', 'Helvetica Neue',
            Helvetica, Arial, sans-serif, system-ui;
        }

        :global(body::before) {
          --size: 45px;
          --line: color-mix(in hsl, canvasText, transparent 70%);
          content: '';
          height: 100vh;
          width: 100vw;
          position: fixed;
          background: linear-gradient(
                90deg,
                var(--line) 1px,
                transparent 1px var(--size)
              )
              50% 50% / var(--size) var(--size),
            linear-gradient(var(--line) 1px, transparent 1px var(--size)) 50% 50% /
              var(--size) var(--size);
          mask: linear-gradient(-20deg, transparent 60%, white);
          top: 0;
          transform-style: flat;
          pointer-events: none;
          z-index: -1;
        }

        .header-container {
          width: 100%;
          text-align: center;
          padding-top: 10rem;
        }

        .container {
          width: 1080px;
          max-width: calc(90vw - 2rem);
          padding: 0.5rem;
          clip-path: inset(-100% -100% 0 -100%);
          position: relative;
          touch-action: none;
          margin-top: 0;
        }

        h3 {
          font-weight: 600;
          font-size: 2rem;
          text-align: center;
          margin: 0;
          color: #333;
        }

        ul {
          display: grid;
          grid-template-columns: repeat(calc(var(--swatch-count) + 3), 1fr);
          list-style-type: none;
          padding: 0;
          margin: 0;
          pointer-events: none;
          translate: 0 calc(var(--offset-y) * 1%);
        }

        li {
          position: relative;
          aspect-ratio: 1 / 4;
          pointer-events: all;
          --delay: calc(sin(((var(--i)) / var(--swatch-count)) * 45deg) * 1s);
          animation: enter 0.2s var(--delay) var(--ease) both;
        }

        li button:hover {
          translate: 0 calc(clamp(0.9, var(--power), 1) * (var(--distance, 40) * -1%));
        }

        @keyframes enter {
          0% {
            translate: 0 100%;
          }
        }

        [data-dark='true'] button {
          color: #fff;
        }

        [data-dark='false'] button {
          color: #000;
        }

        li button {
          container-type: inline-size;
          font-family: 'Reddit Mono', serif;
          font-weight: 600;
          background: var(--color);
          border-radius: 1.2rem;
          width: 400%;
          aspect-ratio: 3/4;
          display: grid;
          place-items: start;
          position: absolute;
          border: 0;
          padding: 1rem;
          rotate: calc(var(--power, 0) * (calc(var(--rotate, 0) * 1deg)));
          translate: 0 calc(clamp(0, var(--power), 1) * (var(--distance, 40) * -1%));
          transition: translate 0.12s, rotate 0.12s;
          transition-timing-function: var(--ease);
          outline-color: red;
          outline-offset: 0.2em;
          cursor: pointer;
        }

        li button span {
          pointer-events: none;
          font-size: 10cqi;
          opacity: 0;
          translate: 0 50%;
          transition: all 0.22s var(--ease);
        }

        li button:hover span,
        li button:focus-visible span,
        li button.touch-active span {
          opacity: 1;
          translate: 0 0;
        }

        li button.touch-active {
          translate: 0 calc(clamp(0.9, var(--power), 1) * (var(--distance, 40) * -1%));
        }

        .bear-link {
          color: canvasText;
          position: fixed;
          top: 1rem;
          left: 1rem;
          width: 48px;
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          opacity: 0.8;
        }

        .bear-link:hover,
        .bear-link:focus-visible {
          opacity: 1;
        }

        .bear-link svg {
          width: 75%;
        }
      `}</style>

      <div className="header-container">
        <h3>Shop By Color.</h3>
      </div>
      <div className="container">
        <ul
          className="swatches"
          ref={listRef}
          onClick={handleSwatchClick}
          onPointerMove={syncWave}
          onPointerLeave={settleWave}
          onFocus={syncWave}
          onBlur={settleWave}
        >
          {swatches.map((swatch) => (
            <li
              key={swatch.index}
              data-dark={swatch.isDark}
              style={{
                '--color': swatch.color,
                '--i': swatch.index,
              }}
            >
              <button 
                data-color={swatch.color} 
                data-category={swatch.label}
                data-index={swatch.index}
                className={touchedSwatch === swatch.index ? 'touch-active' : ''}
              >
                <span>{swatch.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AllPaint;