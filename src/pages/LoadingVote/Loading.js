import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Loading.css";

function Loading() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loadingMessage, setLoadingMessage] = useState("Loading...");
    
    const searchParams = new URLSearchParams(location.search);
    const shouldCheckGeo = searchParams.get("checkGeo") === "true"; 
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setLoadingMessage("No token found. Access denied.");
            setTimeout(() => navigate("/not-allowed"), 2000);
            return;
        }

        // Validate the token first
        setLoadingMessage("Validating your access...");
        fetch(`/api/validate-token?token=${token}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.valid) {
                    setLoadingMessage("Invalid or expired token. Access denied.");
                    setTimeout(() => navigate("/not-allowed"), 2000);
                    return;
                }

                // If geolocation is required, check it
                if (shouldCheckGeo) {
                    checkGeolocation();
                } else {
                    setTimeout(() => navigate("/vote-success"), 2000);
                }
            })
            .catch(() => {
                setLoadingMessage("Network error during validation.");
                setTimeout(() => navigate("/network-error"), 2000);
            });
    }, [token, shouldCheckGeo, navigate]);

    const checkGeolocation = () => {
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
                        setLoadingMessage("You are not on campus. Voting is not allowed.");
                        setTimeout(() => navigate("/not-allowed"), 2000);
                    }
                } catch (error) {
                    setLoadingMessage("Network error while checking location.");
                    setTimeout(() => navigate("/network-error"), 2000);
                }
            },
            () => {
                setLoadingMessage("Unable to retrieve location. Enable geolocation to vote.");
                setTimeout(() => navigate("/geo-error"), 2000);
            }
        );
    };

    return (
        <div className="loading">
            <h1 className="loading__title">{loadingMessage}</h1>
            <div className="spinner"></div>
        </div>
    );
}

export default Loading;
