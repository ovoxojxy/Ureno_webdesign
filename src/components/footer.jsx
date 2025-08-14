import React from 'react'
import facebook from '../assets/images/icons8-facebook.svg'
import instagram from '../assets/images/icons8-instagram.svg'
import linkedin from '../assets/images/icons8-linkedin.svg'
import youtube from '../assets/images/icons8-youtube-logo.svg'

const Footer = () => {
    return (
        <div className="footer">
            <div className="left">
            <div className="logo">URENO</div>
            </div>
            <div className="right">
            <menu>
                <li>Support</li>
                <li>Contact Us</li>
            </menu>
            </div>
        </div>
    )
}

export default Footer 