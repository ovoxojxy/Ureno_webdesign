// reset gh react page
// rm -rf dist
// npm run build
// npm run deploy

import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useAuth } from './contexts/authContext'
import { useContext } from 'react'
import { UserContext } from './contexts/authContext/UserContext'
import { AuthProvider } from './contexts/authContext'
import { UserProvider } from './contexts/authContext/UserContext'
import { MessagesProvider } from './components/conversations/MessageContext'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Regular imports for critical path components
import Home from './pages/home.jsx'
import FlooringProduct from './pages/product-page.jsx'
import SignIn from './app/(auth)/sign-in/page'
import SignUp from './components/SignUp'
import ProductDetail from './components/product-detail'
import ProductDetailPage from './pages/productDetailPage'
import EditProfile from './pages/edit-profile'
import SavedItems from './pages/SavedItems'
import Login from './pages/Login'

// Import lazyLoad utility
import { lazyLoad } from './lib/lazyLoad'

// Lazy-loaded components
const DesignerPage = lazyLoad(() => import('./pages/designer'))
const ProfileDashboard = lazyLoad(() => import('./pages/profile'))
const ProjectsDashboard = lazyLoad(() => import('./pages/projectsDashboard'))
const CreateProject = lazyLoad(() => import('./pages/CreateProject'))
const MessagePage = lazyLoad(() => import('./pages/MessagePage'))

// Admin components (likely less frequently used)
const AdminDashboard = lazyLoad(() => import('./components/admin/AdminDashboard'))
const ProductForm = lazyLoad(() => import('./components/admin/ProductForm'))

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
          {/* Loading fallback for lazy-loaded components */}
          <Suspense fallback={<LoadingSpinner />}>
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
          </Suspense>
        </Router>
        </MessagesProvider>
      </UserProvider>
    </ AuthProvider>
  </StrictMode>
);
