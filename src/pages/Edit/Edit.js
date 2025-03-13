import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Edit.css";
import ButtonWithIcon from "../../components/Button/Button-with-icon.js";
import Loading from "../LoadingVote/Loading.js";
import Button from '../../components/Button/Button.js';

function Edit() {
    const { projectNumber } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [error, setError] = useState(null);
    const [editedProject, setEditedProject] = useState(null); // Track changes to project

    useEffect(() => {
        let isMounted = true;

        const timeoutId = setTimeout(() => {
            if (isMounted) {
                setError("Request timed out. Please try again later.");
            }
        }, 5000);

        fetch(`/api/getProject?id=${projectNumber}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch project details");
                }
                return response.json();
            })
            .then((data) => {
                clearTimeout(timeoutId);
                if (isMounted) {
                    setProject(data);
                    setEditedProject(data);  // Initialize the editable project state
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
    }, [projectNumber]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedProject((prev) => ({
            ...prev,
            [name]: value,  // Update specific field
        }));
    };

    const saveChanges = async () => {
        try {
            const response = await fetch(`/api/updateProject/${projectNumber}`, {
                method: "PATCH",  // Use PATCH for partial updates
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedProject),  // Send the updated data
            });

            const responseBody = await response.json();
            if (response.ok) {
                console.log("Project updated successfully:", responseBody);
                alert("Project updated successfully!");
                navigate('/update-projects');  // Redirect after success
            } else {
                console.error("Error updating project:", responseBody);
            }
        } catch (error) {
            console.error("Error updating project:", error);
        }
    };

    const deleteProject = async () => {
        try {
            const response = await fetch(`/api/deleteProject/?projectNumber=${projectNumber}`, {
                method: "DELETE",
            });

            const responseBody = await response.text(); 
            console.log("Response Body:", responseBody);

            if (response.ok) {
                console.log("Project deleted successfully!");
                alert('Project deleted successfully!');
                navigate('/update-projects');
            } else {
                console.error("Error deleting project:", responseBody);
            }
        } catch (error) {
            console.error("Request failed:", error);
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
                    <span className="project-description__title">
                        <input 
                            type="text" 
                            name="title" 
                            value={editedProject.title || ""} 
                            onChange={handleInputChange} 
                        />
                    </span>
                </h1>

                <div className="team-introduction-wrapper">
                    <div className="team-introduction">
                        <div className="title-wrapper">
                            <p className="team-introduction__title">Team Introduction</p>
                        </div>
                        <div className="team-members-container">
                            {project.team_members.map((member, index) => (
                                <p key={index} className="team-introduction__team-member">
                                    {index + 1}. {member.first_name}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <main className="about-project">
                <h2 className="about-project__heading">About</h2>
                <div className="project-text__wrapper">
                    <textarea 
                        name="project_long_description" 
                        value={editedProject.project_long_description || ""} 
                        onChange={handleInputChange}
                    />
                </div>
                <p className="about-project__faculty small--text">
                    Faculty: {project.faculty}
                </p>

                <Button 
                    onClick={saveChanges} 
                    className="btn--save" 
                    buttonSize="medium-small" 
                    buttonText="Save Changes" 
                />
                <Button 
                    onClick={deleteProject} 
                    className="btn--delete" 
                    buttonSize="medium-small" 
                    buttonText="Delete Project" 
                />
            </main>

            {loadingMessage && <p className="loading-message">{loadingMessage}</p>}
        </div>
    );
}

export default Edit;
