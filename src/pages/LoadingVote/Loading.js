import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Loading.css";

function Loading() {
    const navigate = useNavigate();
    const [loadingMessage, setLoadingMessage] = useState("Loading...");

    useEffect(() => {
        setTimeout(() => navigate("/project-description"), 2000); // Move to project description
    }, [navigate]);

    return (
        <div className="loading">
            <h1 className="loading__title">{loadingMessage}</h1>
            <div className="spinner"></div>
        </div>
    );
}

export default Loading;
