import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProjectDescription.css";
import ButtonWithIcon from "../../components/Button/Button-with-icon.js";
import Loading from "../LoadingVote/Loading.js";

function ProjectDescription() {
    const { project_number } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);
    const [isValid, setIsValid] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVoting, setIsVoting] = useState(false); // New state for handling loading during voting

    useEffect(() => {
        let isMounted = true;

        fetch(`/api/getProject?id=${project_number}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch project details");
                }
                return response.json();
            })
            .then((data) => {
                if (isMounted) {
                    setProject(data);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setError("Error fetching project details.");
                }
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [project_number]);

    const handleVote = async () => {
        const token = localStorage.getItem("voteToken"); // Retrieve stored token

        if (!token) {
            alert("Error: No token found. Please scan the QR code again.");
            navigate("/no-vote-twice");
            return;
        }

        setIsVoting(true); // Show loading indicator

        try {
            console.log("Token from localStorage validate:", token);

            // Call the API endpoint
            const res = await fetch(`/api/validate-token?token=${encodeURIComponent(token)}`);
            const data = await res.json();

            if (!res.ok || !data.valid) {
                alert("Invalid or expired token. Access denied.");
                return false;
            }

            if (res.status === 200 && data.valid) {
                console.log("Token is valid");
                return true;
            }

            if (res.status === 401) {
                console.warn("Invalid or expired token");
                alert("Invalid or expired token. Access denied.");
                return false;
            }

            if (res.status === 400) {
                console.warn("Token not provided");
                alert("Token is required.");
                return false;
            }

            console.error("Unexpected error:", data.error);
            alert("An unexpected error occurred. Please try again.");
            return false;

        } catch (error) {
            console.error("Error validating token:", error);
            alert("Network error occurred.");
            return false;
        } finally {
            setIsVoting(false); // Hide loading indicator after request completes
        }
    };

    if (isLoading) {
        return <Loading />; // Show loading when fetching project data
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="project-description">
            <div className="text-wrapper">
                <h1 className="hero__heading page-title">
                    Project {project.project_number} <br />
                    <span className="project-description__title">{project.project_title}</span>
                </h1>

                <ButtonWithIcon
                    buttonType="primary"
                    size="medium"
                    text="Vote"
                    onClick={handleVote}
                    disabled={isVoting} // Disable button while validating token
                />
                
            </div>

            <main className="about-project">
                <h2 className="about-project__heading">About</h2>
                <div className="project-text__wrapper">
                    <p className="about-project__text">{project.project_long_description}</p>
                </div>
                <p className="about-project__faculty small--text">Faculty: {project.faculty_name}</p>
            </main>
        </div>
    );
}

export default ProjectDescription;
