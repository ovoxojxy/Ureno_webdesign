// reset gh react page
// rm -rf dist
// npm run build
// npm run deploy


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './styles/index.css'
import Home from './pages/home.jsx'
import FlooringProduct from './pages/product-page.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router basename="/Ureno_webdesign/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product-page" element={<FlooringProduct />} />
      </Routes>
    </Router>
  </StrictMode>
);
