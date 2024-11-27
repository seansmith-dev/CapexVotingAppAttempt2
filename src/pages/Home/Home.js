import './Home.css'
import HeroImage from '../../assets/HeroImage.png';
import TimerImage from '../../assets/timer.png'
import Button from '../../components/Button/Button';

function Home() {
    return (
        <div className="home-wrapper">
            <div className="hero">
                <div className="hero-content">
                    <h1 className="hero-content__heading">Capstone <span className= "hero-content__year">2025</span></h1>
                    <div className='hero-content__btn-text-wrapper'>
                    <p className="hero-content__text">We're super excited your here</p>
                    <Button buttonType="primary" size="large"/> 
                    </div>
                </div>
            </div>

            <div className="vote">
                <div className="voting-display">
                    <div className="voting-display__timer-container">
                        <img class="voting-display__timer-image" src={TimerImage} alt="timer" />
                        <h2 className="voting-display__timer-text">Voting Time Ends in: 4hrs 28 mins</h2>

                    </div>
                    <div className="voting-display__directions">
                        <h3 className="voting-display__direction-text">Click "Vote Now" to see Project list</h3>
                    </div>
                    <div className="voting-display__vote-now-button">
                        <h1>Vote Now</h1>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default (Home);