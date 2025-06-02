import React, { useContext, useState, useRef, useEffect } from 'react'
import Logo from '../../assets/images/UrenoSmall.png'
import { Link, useNavigate } from 'react-router-dom'
import profileSVG from '../../assets/images/profile-svgrepo-com.png'
import { useAuth } from '@/contexts/authContext'
import { doSignOut } from '@/firebase/auth'
import { UserContext } from '@/contexts/authContext/UserContext'
import { useToast } from '@/hooks/use-toast'



const LoggedInHeader = ({ user }) => {
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [loggedOut, setLoggedOut] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const mobileMenuRef = useRef(null)

  const { profile } = useContext(UserContext)
  const { toast } = useToast()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = async () =>{
    setLoggingOut(true)
    const result = await doSignOut()
    setLoggingOut(false)
  
    if (result.success) {
      setLoggedOut(true)
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } else {
      alert("Logout failed. Please try again.")
    }
  }

    return (
        <header className="bg-white">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 items-center justify-between">
      <div className="flex-1 md:flex md:items-center md:gap-12">
        <Link to='/'>
          <img
                    src={Logo}
                    alt="SEO illustration"
                />
        </Link>
            
      </div>

      <div className="md:flex md:items-center md:gap-12">
        <nav aria-label="Global" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">


            <li>
              <Link to="/testchat" className="text-black-500 transition hover:text-gray-500/75">
                AI Designer
              </Link>
            </li>


            <li>
              <Link to='/messages'>
                <p className="text-black-500 transition hover:text-gray-500/75" > Messages </p>
              </Link>
              
            </li>

            <li>
              <Link to="/products" className="text-black-500 transition hover:text-gray-500/75">
                Products
              </Link>
            </li>

            <li>
              {profile?.role === 'contractor' ? (
                <Link to='/available-projects'>
                  <p role='menuitem'className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700">Projects</p>
                </Link>
              ) : (
                <Link to='/projects'>
                  <p role='menuitem'  className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700">Projects</p>
                </Link>
              )}
            </li>
          </ul>
        </nav>

        <div className="hidden md:relative md:block" ref={menuRef}>
          <button
            type="button"
            onClick={toggleMenu}
            className="overflow-hidden rounded-full border border-gray-300 shadow-inner"
          >
            <span className="sr-only">Toggle dashboard menu</span>

            <img
              src={profileSVG}
              alt=""
              className="size-10 object-cover"
            />
          </button>

          {isMenuOpen && (
            <div
              className="absolute end-0 z-10 mt-0.5 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
              role="menu"
            >
            <div className="p-2">
              {profile?.role === 'contractor' ? (
                <Link to='/contractor-dashboard'>
                  <p role='menuitem'className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700">My Profile</p>
                </Link>
              ) : (
                <Link to='/ProfileDashboard'>
                  <p role='menuitem'  className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700">My Profile</p>
                </Link>
              )}

              

              <Link to="/designs" role="menuitem" className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700">
                Designs
              </Link>
              
              <Link to="/reviews" role="menuitem" className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700">
                Reviews
              </Link>
            </div>

            <div className="p-2">
              
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  role="menuitem"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                    />
                  </svg>

                  Logout
                </button>
              
            </div>
          </div>
          )}
        </div>

        <div className="block md:hidden" ref={mobileMenuRef}>
          <button
            onClick={toggleMobileMenu}
            className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {isMobileMenuOpen && (
            <div className="absolute right-4 top-16 z-10 w-56 rounded-md border border-gray-100 bg-white shadow-lg">
              <div className="p-2">
                <Link
                  to="/testchat"
                  className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  AI Designer
                </Link>
                <Link
                  to="/messages"
                  className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                {/* <Link
                  to="/products"
                  className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link> */}
                {profile?.role === 'contractor' ? (
                  <Link
                  to="/available-projects"
                  className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Projects
                  </Link>
              ) : (
                <Link
                  to="/projects"
                  className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Projects
                  </Link>
              )}

                
                {profile?.role === 'contractor' ? (
                  <Link
                    to="/contractor-dashboard"
                    className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                ) : (
                  <Link
                    to="/ProfileDashboard"
                    className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                )}
                <Link
                  to="/designs"
                  className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Designs
                </Link>
                <Link
                  to="/reviews"
                  className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Reviews
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
        </header>
    )
}

export default LoggedInHeader