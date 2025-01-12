import { Link } from "react-router-dom";
import floorBackground from '../assets/images/flooring-background.png'
import paintBackground from '../assets/images/paint-background.png'
import profileSVG from '../assets/images/profile-svgrepo-com.svg'
import facebook from '../assets/images/icons8-facebook.svg'
import instagram from '../assets/images/icons8-instagram.svg'
import linkedin from '../assets/images/icons8-linkedin.svg'
import youtube from '../assets/images/icons8-youtube-logo.svg'

import '../styles/index.css'

export default function Home() {
    return (
<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="../styles/index.css" />
  <title>Ureno</title>
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
      <button className="btn login-btn">Log In</button>
      <button className="btn profile-btn">
        <object data={profileSVG} type="image/svg+xml">
          <img src={profileSVG} />
        </object>
      </button>
    </div>
  </div>
  <div className="center-logo">
    <div className="container">
      <h1>URENO</h1>
      <p>Renovation Made Simple</p>
      <button className="btn try-now">Try it Now</button>
    </div>
  </div>
  <div className="services">
    <div className="our-services">
      <p>Our Services</p>
    </div>
    <div className="floor-content">
      <div className="flooring fadeInRight">
        <p>
          <Link to="/product-page">
            <img
              src={floorBackground}
              alt="light oak wooden floor"
            />
          </Link>
        </p>
      </div>
      <div className="floor-txt fadeInRight">
        <h3>flooring</h3>
        <p>
          Lorem ipsum dolor sit amet. A reiciendis repellat in cupiditate
          temporibus est tenetur architecto sed voluptatibus saepe.
        </p>
      </div>
    </div>
    <div className="paint-content">
      <div className="painting fadeInLeft">
        <img src={paintBackground} alt="blue painted walls" />
      </div>
      <div className="paint-txt fadeInLeft">
        <h3>paint</h3>
        <p>
          Lorem ipsum dolor sit amet. A reiciendis repellat in cupiditate
          temporibus est tenetur architecto sed voluptatibus saepe.
        </p>
      </div>
    </div>
  </div>
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
</>
    );
}