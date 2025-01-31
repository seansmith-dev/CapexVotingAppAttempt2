import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Loading.css";

function Loading() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loadingMessage, setLoadingMessage] = useState("Loading...");
    
    // Parse query parameters
    const searchParams = new URLSearchParams(location.search);
    const shouldCheckGeo = searchParams.get("checkGeo") === "true"; 

    useEffect(() => {
        if (!shouldCheckGeo) return; // Don't check geolocation unless `checkGeo=true`

        setLoadingMessage("Checking your location...");

        if (!navigator.geolocation) {
            setLoadingMessage("Geolocation not supported.");
            setTimeout(() => navigate("/not-allowed"), 2000);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch("/api/check-location", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ latitude, longitude }),
                    });

                    const data = await response.json();
                    if (data.allowed) {
                        setTimeout(() => navigate("/vote-success"), 2000);
                    } else {
                        // setLoadingMessage("You are not on campus. Voting is not allowed.");
                        setTimeout(() => navigate("/not-allowed"), 2000);
                    }
                } catch (error) {
                    // setLoadingMessage("Network error: There was a network error checking location.");
                    setTimeout(() => navigate("/network-error"), 2000);
                }
            },
            () => {
                setLoadingMessage("Unable to retrieve your location. To vote, you must enable geolocation");
                setTimeout(() => navigate("/geo-error"), 2000);
            }
        );
    }, [navigate, shouldCheckGeo]);

    return (
        <div className="loading">
            <h1 className="loading__title">{loadingMessage}</h1>
            <div className="spinner"></div>
        </div>
    );
}

export default Loading;
