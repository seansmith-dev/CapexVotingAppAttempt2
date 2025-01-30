import './VoterRegistration.css';
import Button from "../../components/Button/Button.js";




function VoterRegistration(){
    return(
        <div className="voter-registration">
            <h1 className="voter-registration__title">Before voting we need you to fill in a couple details</h1>
            <div className="vote">
                <h2 className="vote__question">Are you a...</h2>
                <Button buttonType="card" buttonSize="medium" buttonText="Student" buttonWidth="wide" className="student--btn" buttonNavigateTo="/projects-list"/><br/>
                <Button buttonType="card" buttonSize="medium" buttonText="Guest" buttonWidth="wide" className="guest--btn" buttonNavigateTo="/projects-list"/>
            </div>
        </div>

    );
}

export default VoterRegistration;