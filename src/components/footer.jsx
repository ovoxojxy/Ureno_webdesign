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
            <div className="social-sites">
                <object data={facebook} type="image/svg+xml">
                <img src={facebook} />
                </object>
                <object data={instagram} type="image/svg+xml">
                <img src={instagram} />
                </object>
                <object data={linkedin} type="image/svg+xml">
                <img src={linkedin} />
                </object>
                <object data={youtube} type="image/svg+xml">
                <img src={youtube} />
                </object>
            </div>
            </div>
            <div className="right">
            <menu>
                <li>Topic</li>
                <li>Page</li>
                <li>Page</li>
                <li>Page</li>
            </menu>
            <menu>
                <li>Topic</li>
                <li>Page</li>
                <li>Page</li>
                <li>Page</li>
            </menu>
            <menu>
                <li>Topic</li>
                <li>Page</li>
                <li>Page</li>
                <li>Page</li>
            </menu>
            </div>
        </div>
    )
}

export default Footer 