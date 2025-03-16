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
        const token = localStorage.getItem("voteToken");

        if (!token) {
            alert("Error: No token found. Please scan the QR code again.");
            navigate("/projects-list");
            return;
        }

        setIsVoting(true); // Show loading indicator for voting
        setIsLoading(true);

        try {
            const res = await fetch(`/api/validate-token?token=${encodeURIComponent(token)}`);
            const data = await res.json();

            if (!res.ok || !data.valid) {
                alert("Invalid or expired token. Access denied.");
                return false;
            }

            if (res.status === 401) {
                alert("Invalid or expired token. Access denied.");
                navigate('/projects-list');
                return false;
            }

            if (res.status === 400) {
                alert("Token not provided.");
                return false;
            }

            if (res.status === 200 && data.valid) {
                console.log("Token is valid");
            }

        } catch (error) {
            console.error("Error validating token:", error);
            alert("Network error occurred.");
            return false;
        } finally {
            setIsVoting(false); // Hide loading indicator after request completes
            setIsLoading(false);
        }

        //API to update tables, with vote information
        try {

            const response = await fetch(`/api/vote?token=${token}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(project), // Send the updated data
            });
            console.log("Vote Project:", JSON.stringify(project, null, 2));

            const responseBody = await response.json();
            

            if (response.status ===200) {
                console.log("Project voted for successfully:", responseBody);
                alert("Project voted for successfully!");
                navigate('/');  // Redirect after success
            } else if (response.status === 409){
                console.log("project already voted for")
                alert("Project already voted for!");
                navigate('/no-vote-twice');
            }
            else if (response.status ===404){
                console.log("No QR code used", responseBody);
                alert("You can't vote without a qr code");
                navigate('/');  // Redirect after success
            }
            
            else {
                console.error("Error voting for project:", responseBody);
                navigate('/projects-list');  // Redirect after success
            }
        } catch (error) {
            console.error("Error updating project:", error);
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
