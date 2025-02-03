import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Loading.css";

function Loading() {
    const navigate = useNavigate();
    const [loadingMessage, setLoadingMessage] = useState("Loading...");

    // No automatic navigation anymore; handle error or timeout inside `ProjectDescription`
    return (
        <div className="loading">
            <h1 className="loading__title">{loadingMessage}</h1>
            <div className="spinner"></div>
        </div>
    );
}

export default Loading;
