import './Home.css'
import AtcEntrance from '../../assets/atc-entrance.jpg';
import AtcBuilding from '../../assets/ATCbuilding.jpg';
import AtcBuildingLevel1And2 from '../../assets/ATCLevel1And2.jpg';
import AboutImage from '../../assets/aboutCapstone.jpeg';
import ButtonWithIcon from '../../components/Button/Button-with-icon.js';
import Button from '../../components/Button/Button.js';
import { Link } from 'react-router-dom';
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";


function Home() {

    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get("token");
        
        if (token) {
            localStorage.setItem("voteToken", token); // Store token
        }
    }, [location.search]);

    return (
        <div className="home-wrapper">
            <div className="hero">
                    <h1 className="hero__heading page-title">Capstone <span className= "hero__year">2025</span></h1>
                    <p className="hero__text page-subtitle">We're super excited you're here<br/>It's time to vote</p>
                    <ButtonWithIcon buttonType="primary" size="medium" text="Vote" buttonNavigateTo="/voter-registration"/>
            </div>
            <div className="project">
                <div className="lost-text">
                    <h2 className="lost-text__title">Looking for a project?</h2>
                    {/* <p>Click on the links below to find out more..</p> */}
                </div>

                <div className="projects-list">
                    <Link to="/navigation-assistant">
                        <div className="card first--card">
                            
                            <h3 className="card__heading">ATC building</h3>
                            <p className="card__subtitle">Projects are located on the first and second floor of the ATC building</p>
                            
                            <Button buttonType="card" buttonSize="small" buttonText="Still Lost" buttonCardNo="one" buttonNavigateTo="navigation-assistant"/>
                            <img href="#" src={AtcBuilding} className="card__img" alt="ATC building"/>
                            
                        </div>
                    </Link>
                    <Link to="/navigation-assistant">
                        <div className="card second--card"> 
                        
                            <h3 className="card__heading">What to do</h3>
                            <p className="card__subtitle">First head to the ATC building entrance. You will than see a display of the projects inside.</p>
                            
                            <Button buttonType="card" buttonSize="small" buttonText="Navigation Assistant" buttonCardNo="two" buttonNavigateTo="navigation-assistant"/>
                            <img href="#" src={AtcEntrance} className="card__img" alt="ATC entrance"/>
                            
                        </div>
                    </Link>
                    <Link to="/navigation-assistant">
                        <div className="card navigation--assistant third--card">
                            
                            <h3 className="card__heading">Still lost?</h3>
                            <p className="card__subtitle">If your still unable to find your way, try out the navigation assistant below </p>

                            <Button buttonType="card" buttonSize="small" buttonText="Navigation Assistant" buttonCardNo="three" buttonNavigateTo="navigation-assistant"/>
                            <img href="#" src={AtcBuildingLevel1And2} className="card__img card-image-three--positioning" alt="ATC building ATC level 1 and 2"/>
                            
                        </div>
                    </Link>
                </div>
                
            </div>

            <div className="about-wrapper">
                <div className="about">
                    <h2 className="about__title">About Capstone<br/>2025</h2>
                    <img href="#" src={AboutImage} className="about__img" alt="student desk"/>
                    <div className="about__text-container">
                        <p className="about__text">The Capstone 2025 Expo at Swinburne University in Hawthorn is an annual event that showcases the innovative projects developed by final-year students across various disciplines. This expo serves as a platform for students to present their work to industry professionals, faculty, and the broader community, highlighting the practical applications of their academic learning.</p>
                        <p className="about__text">Attendees can expect to explore a diverse range of projects, including engineering designs, digital technologies, creative arts, and more. The event not only demonstrates the students' technical skills and creativity but also emphasizes their readiness to tackle real-world challenges. The Capstone 2025 Expo reflects Swinburne's commitment to fostering industry-relevant education and providing students with opportunities to engage with potential employers and collaborators.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;