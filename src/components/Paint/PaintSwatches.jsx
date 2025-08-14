import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Pane } from 'https://cdn.skypack.dev/tweakpane@4.0.4';
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0';
import Color from 'https://cdn.skypack.dev/color';

const PaintSwatches = () => {
  const listRef = useRef(null);
  const settersRef = useRef([]);
  const easesRef = useRef({});
  const ctrlRef = useRef(null);

  const [config, setConfig] = useState({
    theme: 'system',
    swatches: 12,
    threshold: 120,
    start: 72,
    distance: 42,
    rotation: -5,
    out: 'power2.out',
    in: 'power4.in',
  });

  const [swatches, setSwatches] = useState([]);

  const generateSwatches = useCallback(() => {
    settersRef.current.length = 0;
    const newSwatches = new Array(config.swatches).fill().map((_, index) => {
      const color = `hsl(0, 0%, ${Math.round(
        (0.25 + (index / config.swatches) * 0.75) * 100
      )}%)`;
      const newColor = Color(color);
      return {
        color,
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

  const copyColor = useCallback((event) => {
    if (event.target.tagName === 'BUTTON') {
      navigator.clipboard
        .writeText(event.target.dataset.color)
        .then(() => {
          const markup = event.target.innerHTML;
          event.target.innerHTML = '<span>Copied!</span>';
          setTimeout(() => {
            event.target.innerHTML = markup;
          }, 2000);
        })
        .catch((err) => {
          console.error('Failed to copy text to clipboard:', err);
        });
    }
  }, []);

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
    const easings = {
      none: 'none',
      'power1.in': 'power1.in',
      'power2.in': 'power2.in',
      'power3.in': 'power3.in',
      'power4.in': 'power4.in',
      'power1.out': 'power1.out',
      'power2.out': 'power2.out',
      'power3.out': 'power3.out',
      'power4.out': 'power4.out',
      'power1.inOut': 'power1.inOut',
      'power2.inOut': 'power2.inOut',
      'power3.inOut': 'power3.inOut',
      'power4.inOut': 'power4.inOut',
      'back.in': 'back.in',
      'back.out': 'back.out',
      'back.inOut': 'back.inOut',
      'sine.in': 'sine.in',
      'sine.out': 'sine.out',
      'sine.inOut': 'sine.inOut',
      'circ.in': 'circ.in',
      'circ.out': 'circ.out',
      'circ.inOut': 'circ.inOut',
    };

    const ctrl = new Pane({
      title: 'Config',
      expanded: false,
    });

    ctrlRef.current = ctrl;

    const sync = (event) => {
      if (
        !document.startViewTransition ||
        event.target.controller.view.labelElement.innerText !== 'Theme'
      )
        return update();
      document.startViewTransition(() => update());
    };

    ctrl.addBinding(config, 'threshold', {
      label: 'Threshold',
      min: 50,
      max: 400,
      step: 1,
    });
    ctrl.addBinding(config, 'in', {
      label: 'Ease In',
      options: easings,
    });
    ctrl.addBinding(config, 'out', {
      label: 'Ease Out',
      options: easings,
    });
    ctrl.addBinding(config, 'start', {
      min: 50,
      max: 90,
      step: 1,
      label: 'Start',
    });
    ctrl.addBinding(config, 'distance', {
      min: 10,
      max: 60,
      step: 1,
      label: 'Travel',
    });
    ctrl.addBinding(config, 'rotation', {
      min: -15,
      max: 15,
      step: 1,
      label: 'Rotate',
    });
    ctrl
      .addBinding(config, 'swatches', {
        label: 'Count',
        min: 6,
        max: 20,
        step: 1,
      })
      .on('change', () => generateSwatches());
    ctrl.addBinding(config, 'theme', {
      label: 'Theme',
      options: {
        System: 'system',
        Light: 'light',
        Dark: 'dark',
      },
    });

    ctrl.on('change', (event) => {
      setConfig(prev => ({ ...prev, [event.target.key]: event.value }));
      sync(event);
    });

    return () => {
      if (ctrlRef.current) {
        ctrlRef.current.dispose();
      }
    };
  }, [config, generateSwatches, update]);

  return (
    <>
      <style jsx>{`
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

        .container {
          width: 1080px;
          max-width: calc(90vw - 2rem);
          padding: 1rem;
          clip-path: inset(-100% -100% 0 -100%);
          position: relative;
          touch-action: none;
          margin-top: 3rem;
        }

        h3 {
          font-weight: 600;
          font-size: 2rem;
          position: absolute;
          bottom: 100%;
          left: 2rem;
          margin: 0;
        }

        ul {
          margin: 0 auto;
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
        li button:focus-visible span {
          opacity: 1;
          translate: 0 0;
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

      <div className="container">
        <h3>greys.</h3>
        <ul
          className="swatches"
          ref={listRef}
          onClick={copyColor}
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
              <button data-color={swatch.color}>
                <span>{swatch.color}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default PaintSwatches;