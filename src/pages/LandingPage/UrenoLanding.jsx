import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/UrenoSmall.png'
import FirstImage from '../../assets/images/seo_image.png'
import SecondImage from '../../assets/images/Rocket.png'
import ThirdImage from '../../assets/images/metrics.png'
import FourthImage from '../../assets/images/Estimate.png'
import { CiLocationOn } from "react-icons/ci";
import { IoBarChartOutline } from "react-icons/io5";
import { IoPieChartOutline } from "react-icons/io5";
import { HiCubeTransparent } from "react-icons/hi2";

import styles from './UrenoLanding.module.css';

const UrenoLearnMore = () => {
  const [isNavbarActive, setIsNavbarActive] = useState(false);
  const [isHeaderActive, setIsHeaderActive] = useState(false);
  const [isGoTopActive, setIsGoTopActive] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarActive(!isNavbarActive);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Header becomes sticky
      if (window.scrollY >= 10) {
        setIsHeaderActive(true);
      } else {
        setIsHeaderActive(false);
      }

      // Go-top button visibility
      if (window.scrollY >= 800) {
        setIsGoTopActive(true);
      } else {
        setIsGoTopActive(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <header className={`${isHeaderActive ? 'active' : ''}`} data-header>
        <div className={`${styles.overlay} ${isNavbarActive ? 'active' : ''}`} data-overlay onClick={toggleNavbar}></div>

        <div className={`${styles.container}`}>
          <Link to="/" className={`${styles.logo}`}>
            <img
                    src={Logo}
                    alt="SEO illustration"
                />
          </Link>

          <button className={`${styles.navOpenBtn}`} data-nav-open-btn onClick={toggleNavbar}>
            <ion-icon name="menu-outline"></ion-icon>
          </button>

          <nav className={`${styles.navbar} ${isNavbarActive ? 'active' : ''}`} data-navbar>
            <button className={`${styles.navCloseBtn}`} data-nav-close-btn onClick={toggleNavbar}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
            <Link to='/'>
              <button className={`${styles.btn} ${styles.btnPrimary}`}>Let's Get Started</button>
            </Link>
            
          </nav>
        </div>
      </header>

      <main>
        <article>
        <section className={`${styles.hero}`} id="hero">
            <div className={`${styles.container}`}>
              <div className={`${styles.heroContent}`}>
                <h1 className={`${styles.h1} ${styles.heroTitle}`}>Make renovations faster, cheaper, and radically more transparent!</h1>
              </div>

              <figure className={`${styles.heroBanner}`}>
                <img
                    src={FirstImage}
                    alt="SEO illustration"
                />
              </figure>
            </div>
          </section>

          <section className={`${styles.service}`} id="service">
            <div className={`${styles.container}`}>
              <h2 className={`${styles.h2} ${styles.sectionTitle}`}>Launch Renovation Projects with Confidence</h2>
              <p className={`${styles.sectionText}`}>Say goodbye to phone-tag and unclear estimates. URENO gives homeowners instant pricing, contractor matching, and a real-time dashboard so projects start faster and finish smarter.</p>

              <ul className={`${styles.serviceList}`}>
                <li>
                  <div className={`${styles.serviceCard}`}>
                    <div className={`${styles.cardIcon}`}><CiLocationOn size={80} /></div>

                    
                    <h3 className={`${styles.h4} ${styles.cardTitle}`}>Connect with Trusted Contractors</h3>

                    <p className={`${styles.cardText}`}>URENO connects homeowners with vetted local contractors—ranked by availability, cost, and performance, with no hidden fees.</p>
                  </div>
                </li>

                <li>
                  <div className={`${styles.serviceCard}`}>
                    <div className={`${styles.cardIcon}`}><IoBarChartOutline size={80} /></div>

                    <h3 className={`${styles.h4} ${styles.cardTitle}`}>Track Progress</h3>

                    <p className={`${styles.cardText}`}>From permit status to paint drying, timelines, payments, and milestones—all in one place.</p>
                  </div>
                </li>

                <li>
                  <div className={`${styles.serviceCard}`}>
                    <div className={`${styles.cardIcon}`}><IoPieChartOutline size={80} /></div>

                    <h3 className={`${styles.h4} ${styles.cardTitle}`}>Shop Renovation Materials Seamlessly</h3>

                    <p className={`${styles.cardText}`}>Choose from transparent, pre-priced flooring and paint options sourced from vetted manufacturers. </p>
                  </div>
                </li>

                <li>
                  <div className={`${styles.serviceCard}`}>
                    <div className={`${styles.cardIcon}`}><HiCubeTransparent size={80} /></div>

                    <h3 className={`${styles.h4} ${styles.cardTitle}`}>Built-In Cost Transparency and Fair Pricing</h3>

                    <p className={`${styles.cardText}`}>Contractors save time bidding, and homeowners avoid surprise costs—thanks to milestone-based billing and upfront estimates.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section className={`${styles.about}`} id="about">
            <div className={`${styles.container}`}>
              <div className={`${styles.aboutTop}`}>
                <figure className={`${styles.aboutBanner}`}>
                  <img
                    src={SecondImage}
                    alt="SEO illustration"
                />
                </figure>

                <div className={`${styles.aboutContent}`}>
                  

                  <h2 className={`${styles.h3} ${styles.sectionTitle}`}>From Click to Contractor - Renocvation, Simplified</h2>

                  <p className={`${styles.sectionText}`}>URENO skips the search engine race and puts homeowners directly in control. With instant square-footage pricing, verified local contractors, and real-time dashboards, projects start faster and stay on track.</p>

                  <p className={`${styles.sectionText}`}>Forget chasing we bring the full renovation journey into one seamless, digital workflow. Ready to cut costs, save time, and rebuild trust in the renovation process?</p>
                </div>
              </div>

              <div className={`${styles.aboutBottom}`}>
                <figure className={`${styles.aboutBanner}`}>
                  <img
                    src={ThirdImage}
                    alt="SEO illustration"
                  />
                </figure>
                <div className={`${styles.aboutBottomFlex}`}>
                  <div className={`${styles.aboutContent}`}>
                    <h3 className={`${styles.h4} ${styles.aboutBottomTitle}`}>Project Insights & Smart Tracking</h3>
                    <p className={`${styles.sectionText}`}>Use a set of sophisticated techniques and tools used to analyze complex data sets and extract valuable insights that go beyond traditional business intelligence methods. Here we can include machine learning, and data mining techniques to uncover patterns, predict future trends, and support decision-making processes</p>
                  </div>
                  <div className={`${styles.aboutContent}`}>
                    <h3 className={`${styles.h4} ${styles.aboutBottomTitle}`}>Data That Drives Every Decision</h3>
                    <ul className={`${styles.aboutBottomList}`}>
                      <li className={`${styles.aboutBottomItem}`}>
                        <p className={`${styles.sectionText}`}>Predict renovation timelines based on project size and complexity</p>
                      </li>
                      <li className={`${styles.aboutBottomItem}`}>
                        <p className={`${styles.sectionText}`}>Monitor license status, materials, and progress in real time</p>
                      </li>
                      <li className={`${styles.aboutBottomItem}`}>
                        <p className={`${styles.sectionText}`}>Support smarter decision-making with transparent cost breakdowns</p>
                      </li>
                      <li className={`${styles.aboutBottomItem}`}>
                        <p className={`${styles.sectionText}`}>Automate payments tied to verified milestones</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={`${styles.features}`} id="features">
            <div className={`${styles.container}`}>
              <h2 className={`${styles.h3} ${styles.sectionTitle}`}>URENO isn’t just a platform, it’s a full-stack solution for modernizing renovation.</h2>
              <div className={`${styles.featuresSplit}`}>
                <div className={styles.featuresColumn}>
                  <li>
                    <div className={`${styles.featuresCard}`}>
                      <div className={`${styles.cardIcon}`}>
                        <ion-icon name="analytics-outline"></ion-icon>
                      </div>
                      <div className="card-content">
                        <h3 className={`${styles.h4} ${styles.cardTitle}`}>Real-Time Project Intelligence</h3>
                        <p className={`${styles.sectionText}`}>Use URENO’s milestone-based dashboards and smart algorithms to track permits, materials, and contractor timelines—turning raw data into decisions that cut delays and save money.</p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className={`${styles.featuresCard}`}>
                      <div className={`${styles.cardIcon}`}>
                        <ion-icon name="mail-open-outline"></ion-icon>
                      </div>
                      <div className="card-content">
                        <h3 className={`${styles.h4} ${styles.cardTitle}`}>Transparent Cost Breakdown</h3>
                        <p className={`${styles.sectionText}`}>From square footage estimates to labor margins, URENO keeps homeowners informed and contractors accountable—with every dollar tied to a verified step in the process.</p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className={`${styles.featuresCard}`}>
                      <div className={`${styles.cardIcon}`}>
                        <ion-icon name="film-outline"></ion-icon>
                      </div>
                      <div className="card-content">
                        <h3 className={`${styles.h4} ${styles.cardTitle}`}>Built-In Customer Communication</h3>
                        <p className={`${styles.sectionText}`}>Automated notifications and project updates keep homeowners engaged, informed, and stress-free—no follow-up calls or email chains required.</p>
                      </div>
                    </div>
                  </li>
                </div>
                <div className={styles.featuresColumn}>
                  <li>
                    <div className={`${styles.featuresCard}`}>
                      <div className={`${styles.cardIcon}`}>
                        <ion-icon name="globe-outline"></ion-icon>
                      </div>
                      <div className="card-content">
                        <h3 className={`${styles.h4} ${styles.cardTitle}`}>Visual Progress Tracking</h3>
                        <p className={`${styles.sectionText}`}>Photos, updates, and contractor check-ins show exactly what’s happening on site—so there’s no confusion at the finish line.</p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className={`${styles.featuresCard}`}>
                      <div className={`${styles.cardIcon}`}>
                        <ion-icon name="magnet-outline"></ion-icon>
                      </div>
                      <div className="card-content">
                        <h3 className={`${styles.h4} ${styles.cardTitle}`}>Smart Discovery Tools</h3>
                        <p className={`${styles.sectionText}`}>Homeowners can browse pre-priced renovation options, compare contractor availability, and schedule projects—all from one interface.</p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className={`${styles.featuresCard}`}>
                      <div className={`${styles.cardIcon}`}>
                        <ion-icon name="layers-outline"></ion-icon>
                      </div>
                      <div className="card-content">
                        <h3 className={`${styles.h4} ${styles.cardTitle}`}>Dynamic Contractor Matching</h3>
                        <p className={`${styles.sectionText}`}>Projects are routed to licensed contractors based on availability, location, and past performance—boosting job satisfaction and completion speed on both sides.</p>
                      </div>
                    </div>
                  </li>
                </div>
              </div>
            </div>
          </section>

          <section className={`${styles.pricing}`} id="pricing">
            <div className={`${styles.container}`}>
              <div className={`${styles.pricingContent}`}>
                

                <h2 className={`${styles.h3} ${styles.sectionTitle}`}>One seamless platform for every project</h2>

                <p className={`${styles.sectionText}`}>URENO simplifies the entire renovation journey—from estimate to final walkthrough. Every feature is built with clarity and speed in mind, whether you’re a first-time homeowner or a seasoned contractor.</p>

                <form action="" className={`${styles.heroForm}`}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    required
                    className={styles.inputField}
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className={styles.inputField}
                  />

                  <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Join our newsletter</button>
                </form>
              </div>

              <figure className={`${styles.pricingBanner}`}>
                <img
                    src={FourthImage}
                    alt="SEO illustration"
                />
              </figure>
            </div>
          </section>

          <section className={`${styles.faq}`} id="faq">
            <div className={`${styles.container}`}>
              <p className={`${styles.sectionSubtitle}`}>Frequently Asked Questions</p>

              <p className={`${styles.faqBottomLink}`}>
                Have any more questions?
                <a href="#">Ask your question here</a>
              </p>
            </div>
          </section>

          
        </article>
      </main>


      <button 
        className={`${styles.goTopBtn} ${isGoTopActive ? styles.active : ''}`} 
        data-go-top 
        onClick={scrollToTop}
      >
        <ion-icon name="arrow-up-outline"></ion-icon>
      </button>
    </>
  );
};

export default UrenoLearnMore;