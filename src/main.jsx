
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
import { MessagesProvider } from './pages/Conversation/MessageContext'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from './components/ui/LoadingSpinner'
import { Toaster } from './components/ui/toaster'


// Regular imports for critical path components
import Home from './pages/home.jsx'
import FlooringProduct from './pages/product-page.jsx'
import PaintProduct from './pages/paint-page.jsx'
import SignIn from './app/(auth)/sign-in/page'
import SignUp from './components/SignUp.jsx'
import ProductDetail from './components/product-detail'
import ProductDetailPage from './pages/productDetailPage'
import ColorDetailPage from './pages/colorDetailPage'
import EditProfile from './pages/Dashboard/edit-profile'
import SavedItems from './pages/SavedItems'
import Login from './pages/Login'
import ChooseRole from './pages/ChooseRole'
import EditProject from './pages/Projects/EditProject'
import AvailableProjects from './pages/Projects/AvailableProjects'
import ContractorDashboard from './pages/Dashboard/contractorDashboard'
import ProjectDetails from './pages/Projects/projectDetails'
import ProjectRequests from './pages/Projects/projectRequests'
import ProjectInquiries from './pages/Projects/ProjectInquiries'
import AIChat from './components/AI_Design/AIChat'
import AIImageGenerator from './components/AI_Design/AiImage'
import ChatUI from './components/AI_Design/ChatUI'
import RedSwatches from './components/Paint/RedSwatches'
import RedShadesPage from './pages/red-shades-page.jsx'
import OrangeShadesPage from './pages/orange-shades-page.jsx'
import YellowShadesPage from './pages/yellow-shades-page.jsx'
import GreenShadesPage from './pages/green-shades-page.jsx'
import BlueShadesPage from './pages/blue-shades-page.jsx'
import PurpleShadesPage from './pages/purple-shades-page.jsx'
import NeutralShadesPage from './pages/neutral-shades-page.jsx'
import WhiteShadesPage from './pages/white-shades-page.jsx'
import AllPaint from './components/Paint/AllPaint'
import TestUI from './pages/testUI'


  
// Import lazyLoad utility
import { lazyLoad } from './lib/lazyLoad'

// const QueryClient = new QueryClient()

// Lazy-loaded components
const DesignerPage = lazyLoad(() => import('./pages/designer'))
const ProfileDashboard = lazyLoad(() => import('./pages/Dashboard/profile'))
const ProjectsDashboard = lazyLoad(() => import('./pages/Projects/projectsDashboard'))
const CreateProject = lazyLoad(() => import('./pages/Projects/newCreateProject'))
const MessagePage = lazyLoad(() => import('./pages/Conversation/MessagePage'))

// Admin components (likely less frequently used)
const AdminDashboard = lazyLoad(() => import('./components/admin/toDelete_AdminDashboard'))
// const ProductForm = lazyLoad(() => import('./components/admin/updatedProductForm'))

import './styles/index.css'
import './globals.css'
import RoleRedirectGate from './contexts/authContext/RoleRedirectGate'
import UrenoLearnMore from './pages/LandingPage/UrenoLanding'
import ProjectDashboard from './pages/Projects/contractorProjDash.jsx'
// Login.css will be imported only in the Login component

const ProtectedAdminRoute = ({ children }) => {
  const { currentUser } = useAuth()
  const { profile } = useContext(UserContext);

  if (!currentUser || profile?.role !== "admin") {
    return null;
  }

  return children
}

const ProtectedContractorRoute = ({ children }) => {
  const { currentUser } = useAuth()
  const { profile } = useContext(UserContext);
  if (!currentUser || !profile || typeof profile.role !== "string") {
    return <LoadingSpinner />
  }
  if (profile.role !== "contractor") {
    return <Navigate to="/" />
  }
  return children
}

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <StrictMode>
    {/* <QueryClientProvider client={QueryClient}> */}
    <AuthProvider>
      <UserProvider>
        <MessagesProvider>
        <Router basename="/Ureno_webdesign/">
        <RoleRedirectGate />
          {/* Loading fallback for lazy-loaded components */}
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product-page" element={<FlooringProduct />} />
              <Route path="/paint-page" element={<PaintProduct />} />
              <Route path="/productDetail/:productId" element={<ProductDetailPage />} />
              <Route path="/colorDetail/:colorId" element={<ColorDetailPage />} />
              <Route path="/designerPage" element={<DesignerPage />} />
              <Route path="/ProfileDashboard" element={<ProfileDashboard />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
              <Route path="/projects" element={<ProjectsDashboard />} />
              <Route path="/projects/new" element={<CreateProject />} />
              <Route path="/savedItems" element={<SavedItems />} />
              <Route path="/messages" element={<MessagePage />} />
              <Route path="/choose-role" element={<ChooseRole />} />
              <Route path="/projects/edit/:projectId" element={<EditProject />} />
              <Route path="/contractor-dashboard" element={<ProtectedContractorRoute><ContractorDashboard /></ProtectedContractorRoute>} />
              <Route path="/available-projects" element={<ProtectedContractorRoute><AvailableProjects /></ProtectedContractorRoute>} />
              <Route path="/projects/view/:projectId" element={<ProtectedContractorRoute><ProjectDetails /></ProtectedContractorRoute>} />
              <Route path="/projects/:id/requests" element={<ProjectRequests />} />
              <Route path="/projects/:id/inquiries" element={<ProjectInquiries />} />
              <Route path="/LearnMore" element={<UrenoLearnMore />} />
              <Route path="/TestChat" element={<AIChat />} />
              <Route path="/TestImage" element={<AIImageGenerator />} />
              <Route path="/ChatUI" element={<ChatUI />} />
              <Route path="/Paint" element={<AllPaint />} />
              <Route path="/red-shades" element={<RedShadesPage />} />
              <Route path="/orange-shades" element={<OrangeShadesPage />} />
              <Route path="/yellow-shades" element={<YellowShadesPage />} />
              <Route path="/green-shades" element={<GreenShadesPage />} />
              <Route path="/blue-shades" element={<BlueShadesPage />} />
              <Route path="/purple-shades" element={<PurpleShadesPage />} />
              <Route path="/neutral-shades" element={<NeutralShadesPage />} />
              <Route path="/white-shades" element={<WhiteShadesPage />} />
              <Route path="/test-ui" element={<ProjectDashboard />} />
            </Routes>
          </Suspense>
          {/* Add Toaster component for toast notifications */}
          <Toaster />
        </Router>
        </MessagesProvider>
      </UserProvider>
    </ AuthProvider>
  {/* </QueryClientProvider > */}
  </StrictMode>
);
