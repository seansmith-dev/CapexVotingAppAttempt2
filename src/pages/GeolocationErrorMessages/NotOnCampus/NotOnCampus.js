import Button from "../../../components/Button/Button.js";
import "./NotOnCampus.css";

function NotOnCampus() {
    return (
        <div className="not-on-campus-error">
            <h1 className="not-on-campus-error__title">Bad news!</h1>
            <h2 class="not-on-campus-error__subtitle">You can't vote if you're not on campus. <br/> Go back, to home and try vote again </h2>
            <Button buttonType="card" buttonSize="medium" buttonText="Back to Home" buttonWidth="wide" className="guest--btn" buttonNavigateTo="/"/>
        </div>
    );
}

export default NotOnCampus;
