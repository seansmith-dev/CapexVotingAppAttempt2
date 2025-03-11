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
