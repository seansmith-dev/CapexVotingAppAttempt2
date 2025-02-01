import Button from "../../../components/Button/Button.js";
import "./GeoError.css";

function GeoError() {
    return (
        <div className="geo-error">
            <h1 className="geo-error__title">There was an error</h1>
            <h2 class="geo-error__subtitle">You must enable geolocation to vote. <br/> Go back, to home and try vote again</h2>
            <Button buttonType="card" buttonSize="medium" buttonText="Back to Home" buttonWidth="wide" className="guest--btn" buttonNavigateTo="/"/>
        </div>
    );
}

export default GeoError;
