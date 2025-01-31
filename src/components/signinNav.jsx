import React from 'react'
import { Link } from 'react-router-dom'
import profileSVG from '../assets/images/profile-svgrepo-com.svg'


const SignInNav = () => {
    return (
        <div className="nav">
        <Link to="/">
          <div className="logo">URENO</div>
        </Link>
      </div>
    )
}

export default SignInNav