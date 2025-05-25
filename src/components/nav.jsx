import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import profileSVG from '../assets/images/profile-svgrepo-com.svg'
import { useAuth } from '@/contexts/authContext'
import { doSignOut } from '@/firebase/auth'
import UserDropDown from './userDropDown'


const Nav = () => {
    const { userLoggedIn } = useAuth() || { userLoggedIn: false }
    const navigate = useNavigate()

    const [loggingOut, setLoggingOut] = useState(false)
    const [loggedOut, setLoggedOut] = useState(false)

    const handleLogout = async () => {
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
        <div className="nav">
        <Link to="/">
          <div className="logo">URENO</div>
        </Link>
        
        <div className="Right">
          <menu>
            <Link to="/testchat">
              <li>AI Design</li>
            </Link>
            
            {userLoggedIn && (
              <>
                <Link to='/messages'>
                  <li>Messages</li>
                </Link>
                
                <Link to='/projects'>
                  <li>Projects</li>
                </Link>
                
              </>
            )}
          </menu>

        
          {!userLoggedIn ? (
            <Link to="/sign-in">
              <button className="btn login-btn">
                Log In
              </button>
            </Link>
          ) : loggingOut ? (
            <span className="text-sm text-gray-500">Logging out...</span>
          ) : loggedOut ? (
            <span className="text-sm text-green-600">Logged out!</span>
          ) : (
            <button className="btn login-btn" onClick={handleLogout}>
              Log Out
            </button>
          )}
          

          {!userLoggedIn ? (

            <button className="btn profile-btn">
              <object data={profileSVG} type="image/svg+xml">
                <img src={profileSVG} />
              </object>
            </button>

            ) : ( 
            <UserDropDown />
          )}


          
        </div>
      </div>
    )
}

export default Nav