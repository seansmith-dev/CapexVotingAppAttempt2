import "./NoVoteTwice.css"; 
import Button from "../../components/Button/Button.js";

function NoVoteTwice(){
    return(
        
        <div className="no-vote-twice">
            <h1 className="no-vote-twice__title">Bad news!</h1>
            <h2 className="no-vote-twice__subtitle">Your can't vote twice</h2>
            <Button buttonType="card" buttonSize="medium" buttonText="Back to Home" buttonWidth="wide" className="guest--btn" buttonNavigateTo="/"/>
        </div>
    );
}
export default NoVoteTwice;