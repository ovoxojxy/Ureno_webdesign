import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import profileSVG from '../assets/images/profile-svgrepo-com.svg'
import { useAuth } from '@/contexts/authContext'
import { doSignOut } from '@/firebase/auth'


const Nav = () => {
    const { userLoggedIn } = useAuth() || { userLoggedIn: false }
    const navigate = useNavigate()

    const handleLogout = async () => {
      await doSignOut ()
      navigate('/')
    }
    return (
        <div className="nav">
        <Link to="/">
          <div className="logo">URENO</div>
        </Link>
        
        <div className="Right">
          <menu>
            <li>AI Design</li>
            <li>Projects</li>
            <li>Messages</li>
          </menu>

          {!userLoggedIn ? (

            <Link to="/sign-in">
            <button className="btn login-btn">
                Log In
            </button>
          </Link>

          ) : ( 

            <button className='btn login-btn' onClick={handleLogout}>
              Log Out
            </button>
            
          )}
          


          <button className="btn profile-btn">
            <object data={profileSVG} type="image/svg+xml">
              <img src={profileSVG} />
            </object>
          </button>
        </div>
      </div>
    )
}

export default Nav