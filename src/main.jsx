// reset gh react page
// rm -rf dist
// npm run build
// npm run deploy


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './styles/index.css'
import './globals.css'
import Home from './pages/home.jsx'
import FlooringProduct from './pages/product-page.jsx'
import SignIn from './app/(auth)/sign-in/page'
import SignUp from './components/SignUp'
import ProductDetail from './components/product-detail'
import ProductDetailPage from './pages/productDetailPage'
import { AuthProvider } from './contexts/authContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <Router basename="/Ureno_webdesign/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product-page" element={<FlooringProduct />} />
        <Route path="/productDetail/:productId" element={<ProductDetailPage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </Router>
    </ AuthProvider>
  </StrictMode>
);
