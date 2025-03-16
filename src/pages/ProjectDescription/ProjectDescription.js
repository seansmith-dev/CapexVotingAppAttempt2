import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProjectDescription.css";
import ButtonWithIcon from "../../components/Button/Button-with-icon.js";
import Loading from "../LoadingVote/Loading.js";

function ProjectDescription() {
    const { project_number } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [error, setError] = useState(null);
    const [longDescription, setLongDescription] = useState(""); // Initialize with empty string
    const [shortDescription, setShortDescription] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const [facultyName, setFacultyName] = useState(""); // Initialize faculty name state

    useEffect(() => {

        let isMounted = true;

        const timeoutId = setTimeout(() => {
            if (isMounted) {
                setError("Request timed out. Please try again later.");
            }
        }, 5000);

        fetch(`/api/getProject?id=${project_number}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch project details");
                }
                return response.json();
            })
            .then((data) => {
                clearTimeout(timeoutId);
                if (isMounted) {
                    console.log("Project fetched:", JSON.stringify(data, null, 2));
                    setProject(data);
                    setLongDescription(data.project_long_description || ""); // Set long description once data is available
                    setShortDescription(data.project_short_description || ""); 
                    setProjectTitle(data.project_title);
                    setFacultyName(data.faculty_name)
                }

            })
            .catch((error) => {
                if (isMounted) {
                    setError("Error fetching project details.");
                }
            });

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [project_number]);

    const handleVote = async () => {
        const token = localStorage.getItem("voteToken"); // Retrieve stored token

        if (!token) {
            alert("Error: No token found. Please scan the QR code again.");
            navigate("/no-vote-twice");
            return;
        }

        setLoadingMessage("Validating your access...");

        try {
            console.log("Token from localStorage validate:", token); 
            // Simulating API request for token validation
            const res = await mockValidateTokenAPI(token);
            if (!res.valid) {
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

    // Simulate an API function that checks the token
    const mockValidateTokenAPI = async (token) => {
        // Simulate an API call by checking the token in localStorage
        const storedToken = localStorage.getItem("voteToken");

        // If the token is valid (exists in localStorage), return a valid response
        if (token && token === storedToken) {
            localStorage.removeItem("voteToken"); // Remove after validation (one-time use)
            return { valid: true };
        } else {
            return { valid: false };
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!project) {
        return <Loading />;
    }


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
                                    {index + 1}. {member.first_name} {member.second_name}
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
