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
import DesignerPage from './pages/designer'
import ProfileDashboard from './pages/profile'
import { UserProvider } from './contexts/authContext/UserContext'
import AdminDashboard from './components/admin/AdminDashboard'
import ProductForm from './components/admin/ProductForm'
import { useAuth } from './contexts/authContext'
import { useContext } from 'react'
import { UserContext } from './contexts/authContext/UserContext'

const ProtectedAdminRoute = ({ children }) => {
  const { currentUser } = useAuth()
  const { profile } = useContext(UserContext);

  if (!currentUser || !profile?.isAdmin) {
    return null;
  }

  return children
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <Router basename="/Ureno_webdesign/">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product-page" element={<FlooringProduct />} />
            <Route path="/productDetail/:productId" element={<ProductDetailPage />} />
            <Route path="/designerPage" element={<DesignerPage />} />
            <Route path="/ProfileDashboard" element={<ProfileDashboard />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
            <Route path="/admin/add" element={<ProtectedAdminRoute><ProductForm /></ProtectedAdminRoute>} />
          </Routes>
        </Router>
      </UserProvider>
    </ AuthProvider>
  </StrictMode>
);
