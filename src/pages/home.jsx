import { Link } from "react-router-dom";
import floorBackground from '../assets/images/flooring-background.png'
import paintBackground from '../assets/images/paint-background.png'
import Footer from "../components/footer";
import Nav from "../components/nav";

import '../styles/index.css'

export default function Home() {
    return (
<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ureno</title>
  <Nav />
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
  <Footer />
</>
    );
}