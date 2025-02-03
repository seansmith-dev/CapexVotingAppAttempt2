import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProjectDescription.css";
import ButtonWithIcon from "../../components/Button/Button-with-icon.js";
import Loading from "../LoadingVote/Loading.js";

function ProjectDescription() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setError("Request timed out. Please try again later.");
            navigate("/error"); // Navigate to an error page after a delay
        }, 5000); // Timeout after 5 seconds

        fetch(`/api/projects?id=${projectId}`)
            .then((response) => response.json())
            .then((data) => {
                clearTimeout(timeoutId); // Clear the timeout once data is fetched
                setProject(data);
            })
            .catch((error) => {
                clearTimeout(timeoutId);
                console.error("Error fetching project details:", error);
                setError("Error fetching project details.");
                navigate("/error"); // Navigate to error page
            });

        return () => clearTimeout(timeoutId); // Clean up the timeout on unmount
    }, [projectId, navigate]);

    if (error) {
        return <div>{error}</div>; // Optionally show a fallback error message
    }

    if (!project) {
        return <Loading />;
    }

    const handleVote = async () => {
        const token = localStorage.getItem("voteToken"); // Retrieve stored token
        

        if (!token) {
            alert("Error: No token found. Please scan the QR code again.");
            navigate("/");
            return;
        }

        setLoadingMessage("Validating your access...");

        try {
            
            const res = await fetch(`/api/validate-token?token=${token}`);
            const data = await res.json();

            if (!data.valid) {
                alert("Invalid or expired token. Access denied.");
                navigate("/");
                return;
            }

            setLoadingMessage("Checking your location...");

            if (!navigator.geolocation) {
                alert("Geolocation not supported. Enable location services to vote.");
                navigate("/not-allowed");
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

                        const locationData = await response.json();
                        if (locationData.allowed) {
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
        } catch (error) {
            setLoadingMessage("Network error while checking location.");
            setTimeout(() => navigate("/network-error"), 2000);
        }
    };

    return (
        <div className="project-description">
            <div className="text-wrapper">
                <h1 className="hero__heading page-title">
                    Project {project.project_number} <br />
                    <span className="project-description__title">{project.title}</span>
                </h1>

                <div className="team-introduction-wrapper">
                    <div className="team-introduction">
                        <div className="title-wrapper">
                            <p className="team-introduction__title">Team Introduction</p>
                        </div>
                        <div className="team-members-container">
                            {project.team_members?.map((member, index) => (
                                <p key={index} className="team-introduction__team-member">
                                    {index + 1}. {member}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                <ButtonWithIcon
                    buttonType="primary"
                    size="medium"
                    text="Vote"
                    onClick={handleVote} // Calls validation & geolocation on click
                />
            </div>

            <main className="about-project">
                <h2 className="about-project__heading">About</h2>
                <div className="project-text__wrapper">
                    <p className="about-project__text">{project.long_description}</p>
                </div>
                <p className="about-project__faculty small--text">Faculty: {project.faculty}</p>
            </main>

            {loadingMessage && <p className="loading-message">{loadingMessage}</p>}
        </div>
    );
}

export default ProjectDescription;
