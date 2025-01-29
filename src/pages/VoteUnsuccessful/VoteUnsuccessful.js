import "./VoteUnsuccessful.css"; 
import Button from "../../components/Button/Button.js";


function VoteUnsuccessful(){
    return(
        
        <div className="vote-unsuccessful">
            <h1 className="vote-unsuccessful__title">Bad news!</h1>
            <h2 className="vote-unsuccessful__subtitle">Your vote was not successful.<br/> Go back, to home and try vote again </h2>
            <Button buttonType="card" buttonSize="medium" buttonText="Back to Home" buttonWidth="wide" className="guest--btn" buttonNavigateTo="/"/>
        </div>
    );
}
export default VoteUnsuccessful;