// reset gh react page
// rm -rf dist
// npm run build
// npm run deploy


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './home.jsx'
import FlooringProduct from './product-page.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router basename="/Ureno_webdesign">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product-page" element={<FlooringProduct />} />
      </Routes>
    </Router>
  </StrictMode>
);
