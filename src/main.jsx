// reset gh react page
// rm -rf dist
// npm run build
// npm run deploy

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useAuth } from './contexts/authContext'
import { useContext } from 'react'
import { UserContext } from './contexts/authContext/UserContext'
import { AuthProvider } from './contexts/authContext'
import { UserProvider } from './contexts/authContext/UserContext'
import { MessagesProvider } from './components/conversations/MessageContext'

import Home from './pages/home.jsx'
import FlooringProduct from './pages/product-page.jsx'
import SignIn from './app/(auth)/sign-in/page'
import SignUp from './components/SignUp'
import ProductDetail from './components/product-detail'
import ProductDetailPage from './pages/productDetailPage'
import DesignerPage from './pages/designer'
import ProfileDashboard from './pages/profile'
import AdminDashboard from './components/admin/AdminDashboard'
import ProductForm from './components/admin/ProductForm'
import EditProfile from './pages/edit-profile'
import ProjectsDashboard from './pages/projectsDashboard'
import CreateProject from './pages/CreateProject'
import SavedItems from './pages/SavedItems'
import Login from './pages/Login'
import MessagePage from './pages/MessagePage'

import './styles/index.css'
import './globals.css'
// Login.css will be imported only in the Login component

const ProtectedAdminRoute = ({ children }) => {
  const { currentUser } = useAuth()
  const { profile } = useContext(UserContext);

  if (!currentUser || !profile?.isAdmin) {
    return null;
  }

  return children
}

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <MessagesProvider>
        <Router basename="/Ureno_webdesign/">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product-page" element={<FlooringProduct />} />
            <Route path="/productDetail/:productId" element={<ProductDetailPage />} />
            <Route path="/designerPage" element={<DesignerPage />} />
            <Route path="/ProfileDashboard" element={<ProfileDashboard />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
            <Route path="/admin/add" element={<ProtectedAdminRoute><ProductForm /></ProtectedAdminRoute>} />
            <Route path="/projects" element={<ProjectsDashboard />} />
            <Route path="/projects/new" element={<CreateProject />} />
            <Route path="/savedItems" element={<SavedItems />} />
            <Route path="/messages" element={<MessagePage />} />
          </Routes>
        </Router>
        </MessagesProvider>
      </UserProvider>
    </ AuthProvider>
  </StrictMode>
);
