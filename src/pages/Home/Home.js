import './Home.css'
import HeroImage from '../../assets/HeroImage.png';
import TimerImage from '../../assets/timer.png'
import Button from '../../components/Button/Button';

function Home() {
    return (
        <div className="home-wrapper">
            <div className="hero">
                <div className="container hero--margin">
                    <h1 className="hero__heading">Capstone <span className= "hero__year">2025</span></h1>
                    <p className="hero__text">We're super excited your here</p>
                    <Button buttonType="primary" size="medium"/>
                </div>
            </div>
            <div className="project">
                <div className="container project--navigation">
                    <h1>Looking for a project?</h1>
                    <p>Projects are located on the first and first floor of the ACT building</p>
                    <p>Click on the links below to find out more..</p>
                </div>
            </div>

            <div className="about">

            </div>

            

        </div>
    )
}

export default (Home);