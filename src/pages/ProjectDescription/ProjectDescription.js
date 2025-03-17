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
    const [isLoading, setIsLoading] = useState(true);
    const [isVoting, setIsVoting] = useState(false);

    useEffect(() => {
        const fetchProjectData = async () => {
            if (isLoading) {
                return <Loading />; // Show loading when fetching project data
            }
    
            if (error) {
                return <div className="error-message">{error}</div>;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/api/getProject?id=${project_number}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch project details");
                }
                const data = await response.json();
                setProject(data);
            } catch (err) {
                setError("Error fetching project details.");
            } finally {
                setIsLoading(false); // Always hide loading after fetch
            }
        };

        fetchProjectData();
    }, [project_number]);

    const handleVote = async () => {

        if (isLoading) {
            return <Loading />; // Show loading when fetching project data
        }

        if (error) {
            return <div className="error-message">{error}</div>;
        }

        const token = localStorage.getItem("voteToken");
    
        if (!token) {
            alert("Error: No token found. Please scan the QR code again.");
            navigate("/projects-list");
            return;
        }
    
        setIsVoting(true);
        setIsLoading(true);
    
        // Step 1: Validate Token
        try {
            const res = await fetch(`/api/validate-token?token=${encodeURIComponent(token)}`);
            const data = await res.json();
    
            if (!res.ok || !data.valid) {
                alert("Invalid or expired token. Access denied.");
                navigate('/projects-list');
                return;
            }
        } catch (error) {
            alert("Network error occurred while validating token.");
            setIsVoting(false);
            setIsLoading(false);
            return;
        }
    
        // Step 2: Check Geolocation
        if (!navigator.geolocation) {
            alert("Geolocation not supported. Enable location services to vote.");
            navigate("/not-allowed");
            return;
        }
    
        try {
            const locationAllowed = await new Promise((resolve, reject) => {
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
    
                            if (!locationData.allowed) {
                                alert("You are not allowed to vote from this location.");
                                navigate("/not-allowed");
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        } catch (error) {
                            alert("Error checking location. Try again later.");
                            navigate("/network-error");
                            resolve(false);
                        }
                    },
                    () => {
                        alert("Failed to get geolocation.");
                        navigate("/geo-error");
                        resolve(false);
                    }
                );
            });
    
            if (!locationAllowed) {
                setIsVoting(false);
                setIsLoading(false);
                return; // STOP execution if location is not allowed.
            }
        } catch (error) {
            alert("Unexpected error in geolocation.");
            setIsVoting(false);
            setIsLoading(false);
            return;
        }
    
        // Step 3: Proceed to Vote API (only if geolocation was successful)
        try {
            const response = await fetch(`/api/vote?token=${token}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(project),
            });
    
            const responseBody = await response.json();
    
            if (response.status === 200) {
                alert("Project voted for successfully!");
                navigate('/vote-success');
            } else if (response.status === 409) {
                alert("You have already voted.");
                navigate('/no-vote-twice');
            } else if (response.status === 404) {
                alert("You can't vote without a QR code.");
                navigate('/');
            } else {
                alert("Error voting for project.");
                navigate('/projects-list');
            }
        } catch (error) {
            alert("There was an error voting.");
            navigate('/');
        }
    
        setIsVoting(false);
        setIsLoading(false);
    };

    return (
        <div className="project-description">
            <div className="text-wrapper">
                <h1 className="hero__heading page-title">
                    Project {project.project_number} <br />
                    <span className="project-description__title">{project.project_title}</span>
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
