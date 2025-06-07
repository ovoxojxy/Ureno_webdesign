import React, { useContext, useState, useRef, useEffect } from 'react'
import Logo from '../../assets/images/UrenoSmall.png'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/authContext'
import { UserContext } from '@/contexts/authContext/UserContext'
import { useToast } from '@/hooks/use-toast'


const LoggedOutHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
    return (
      <header className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-1 md:flex md:items-center md:gap-12">
              <a href="#">
                <img
                  src={Logo}
                  alt="SEO illustration"
                />
              </a>
            </div>

            <div className="md:flex md:items-center md:gap-12">
              <nav aria-label="Global" className="hidden md:block">
                <ul className="flex items-center gap-6 text-sm" style={{fontFamily: 'Sansation'}}>
                  <li>
                    <Link
                      to="/testchat"
                      className="text-black-500 transition hover:text-gray-500/75"
                      style={{fontFamily: 'Sansation'}}
                    >
                      AI Designer
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="hidden md:flex md:items-center md:gap-4">
                <Link to="/sign-in">  
                  <p className="btn try-now" href="#" style={{marginTop: 0, fontFamily: 'Sansation'}}>Login</p>
                </Link>
                <Link to='/sign-up'>
                  <p className="btn try-now" href="#" style={{marginTop: 0, fontFamily: 'Sansation'}}>Register</p>
                </Link>
                
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
                        style={{fontFamily: 'Sansation'}}
                      >
                        AI Designer
                      </Link>
                      <a
                        href="#"
                        className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{fontFamily: 'Sansation'}}
                      >
                        Login
                      </a>
                      <a
                        href="#"
                        className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{fontFamily: 'Sansation'}}
                      >
                        Register
                      </a>
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

export default LoggedOutHeader