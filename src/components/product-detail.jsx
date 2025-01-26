import * as React from "react";
import { Link } from "react-router-dom";
import mainImage from "../assets/images/Harvest-grove-rigid.png"
import alt1 from "../assets/images/harvest-alt1.png"
import alt2 from "../assets/images/harvest-alt2.png"
import defaultImage from "../assets/images/Image-not-found.png"

const ProductDetail = () => {
    return (
        <>
            <div className="main-content">
                <div id="left">
                    <div className="main-image">
                        <img src={defaultImage} alt="" />
                    </div>
                    <div className="thumbnails">
                        <img src={defaultImage} alt="" />
                        <img src={defaultImage} alt="" />
                        <img src={defaultImage} alt="" />
                    </div>
                </div>

                <div id="right">
                    <div className="title-section">
                        <div className="title">
                            <p id="main">Product title</p>
                            <p id="sub">Product category</p>
                        </div>

                        <div className="price-link">
                            <div className="title-left">
                                <p>price</p>
                            </div>
                            <div className="title-right">
                                <a href="">See in my room</a>
                            </div>
                        </div>

                        <a href="">View specifications</a>
                    </div>

                    <div className="description">
                        <p>
                        Luxury vinyl flooring is 100% waterproof and stands up to most
                        anything life throws its way! 5mm DuraLux Performance Harvest Grove
                        Rigid Core Luxury Vinyl Plank - Foam Back is a highly durable and
                        waterproof flooring option that is suitable for any room in the house,
                        including basements, sunrooms, and full bathrooms. Plus, its rigid
                        stone-based core makes each plank dent-resistant and
                        scratch-resistant, so DuraLux Performance is perfect for high-traffic
                        areas.
                        </p>

                        <ul>
                            <li>
                                Install up to 6,400 square feetNo need for transition molding.
                            </li>
                            
                            <li>
                                You can install it right awayPre-installation acclimation is
                                unnecessary.
                            </li>
                            
                            <li>Attached foam underlayment makes for a quieter, warmer floor.</li>
                        
                            <li>
                                Can be installed on, above, and below grade-level (perfect for
                                basements!) and over most existing hard-surface flooring, including
                                slightly irregular subfloors.
                            </li>
                            
                            <li>
                            This DuraLux Performance product is backed by a lifetime res./ 15 yr
                            comm. warranty.
                            </li>
                        
                            <li>
                                It is recommended to use Sentinel Protect Plus Underlayment for
                                optimal sound absorption and moisture resistance or a standard vapor
                                barrier like 6mil PE Film.
                            </li>
                        </ul>

                        <a href="">Product Details</a>
                        <a href="">Reviews</a>
                    
                    </div>
                </div>
            </div>

            <div className="secondary-content">
                <div className="suggestedProduct">
                    <div className="container">
                        <img src={defaultImage} alt="{title}" />
                        <div className="prod-title">
                            {"{"}title{"}"}
                        </div>
                        <p>
                            {"{"}description{"}"}
                        </p>
                        <p> 
                            {"{"}price{"}"}
                        </p>
                    </div>
                </div>
                
                <div className="suggestedProduct">
                    <div className="container">
                        <img src={defaultImage} alt="{title}" />
                        <div className="prod-title">
                            {"{"}title{"}"}
                        </div>
                        <p>
                            {"{"}description{"}"}
                        </p>
                        <p>
                            {"{"}price{"}"}
                        </p>
                    </div>
                </div>

                <div className="suggestedProduct">
                    <div className="container">
                        <img src={defaultImage} alt="{title}" />
                        <div className="prod-title">
                        {"{"}title{"}"}
                        </div>
                        <p>
                        {"{"}description{"}"}
                        </p>
                        <p>
                        {"{"}price{"}"}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetail