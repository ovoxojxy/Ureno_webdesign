import { Link } from "react-router-dom";
import floorBackground from '../assets/images/flooring-background.png'
import paintBackground from '../assets/images/paint-background.png'
import Footer from "../components/footer";
import Nav from "../components/nav";
import NewNav from "@/components/ui/newNav";
import Logo from '../assets/images/Large_logo.png'

import '../styles/index.css'

export default function Home() {
    return (
<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ureno</title>
  <NewNav />
  <div className="center-logo">
    <div className="container">
      <img
        src={Logo}
        alt="SEO illustration"
        style={{ width: "200px", height: "auto" }}
      />
      <p>Renovation Made Simple</p>
      {/* <button className="btn try-now">Try it Now</button> */}

      <Link to="/learnmore">
        <button className="btn try-now">Learn More</button>
      </Link>
      
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
        <h1>Explore our flooring options</h1>
      </div>
    </div>
    <div className="floor-content">
      <div className="flooring fadeInRight">
        <Link to='/paint-page'>
          <img src={paintBackground} alt="blue painted walls" />
        </Link>
        
      </div>
      <div className="paint-txt fadeInLeft">
        <h1>Explore our paint options</h1>
      </div>
    </div>
  </div>
  <Footer />
</>
    );
}