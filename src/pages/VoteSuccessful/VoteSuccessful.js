import "./VoteSuccessful.css"; 
import Button from "../../components/Button/Button.js";

function VoteSuccessful(){
    return(
        
        <div className="vote-successful">
            <h1 className="vote-successful__title">Good news!</h1>
            <h2 className="vote-successful__subtitle">Your vote was successful.<br/> Thanks for voting! </h2>
            <Button buttonType="card" buttonSize="medium" buttonText="Back to Home" buttonWidth="wide" className="guest--btn" buttonNavigateTo="/"/>
        </div>
    );
}
export default VoteSuccessful;