import React from 'react'
import { Link } from 'react-router-dom'
import profileSVG from '../assets/images/profile-svgrepo-com.svg'


const Nav = () => {
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
          <Link to="sign-in">
            <button className="btn login-btn">
                Log In
            </button>
          </Link>
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