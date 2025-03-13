import { useEffect, useState, useRef } from "react";
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
    const [editedProject, setEditedProject] = useState(null);
    const [longDescription, setLongDescription] = useState(""); // Initialize with empty string
    const textareaRef = useRef(null);

    const handleTextChange = (event, setState) => {
        const textarea = event.target;
        setState(event.target.value);
        textarea.style.height = "auto";  // Reset the height to auto to shrink back
        textarea.style.height = textarea.scrollHeight + "px";  // Set it to the scrollHeight

    };
    

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
                    setEditedProject(data); // Initialize the editable project state
                    setLongDescription(data.project_long_description || ""); // Set long description once data is available
                }
                console.log(textareaRef.current.value);
                console.log("checking")
                if (textareaRef.current) {
                    console.log("this is executing")
                    textareaRef.current.style.height = "auto"; // Reset height
                    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; // Adjust height
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
            [name]: value, // Update specific field
        }));
    };

    const handleTeamMemberChange = (index, event) => {
        const { name, value } = event.target;
        const updatedMembers = [...editedProject.team_members];
        updatedMembers[index][name] = value; // Update specific team member field
        setEditedProject((prev) => ({
            ...prev,
            team_members: updatedMembers,
        }));
    };

    const handleAddTeamMember = () => {
        setEditedProject((prev) => ({
            ...prev,
            team_members: [...prev.team_members, { first_name: "", second_name: "" }],
        }));
    };

    const handleRemoveTeamMember = (index) => {
        const updatedMembers = editedProject.team_members.filter((_, i) => i !== index);
        setEditedProject((prev) => ({
            ...prev,
            team_members: updatedMembers,
        }));
    };

    const saveChanges = async () => {
        try {
            const response = await fetch(`/api/updateProject/${projectNumber}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedProject), // Send the updated data
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
                            {editedProject.team_members.map((member, index) => (
                                <div key={index} className="team-member-edit">
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={member.first_name || ""}
                                        onChange={(event) => handleTeamMemberChange(index, event)}
                                        placeholder="First Name"
                                    />
                                    <input
                                        type="text"
                                        name="second_name"
                                        value={member.second_name || ""}
                                        onChange={(event) => handleTeamMemberChange(index, event)}
                                        placeholder="Second Name"
                                    />
                                    <button onClick={() => handleRemoveTeamMember(index)}>Remove</button>
                                </div>
                            ))}
                            <button onClick={handleAddTeamMember}>Add Team Member</button>
                        </div>
                    </div>
                </div>

            </div>

            <main className="about-project">
                <h2 className="about-project__heading">About</h2>
                <div className="project-text__wrapper">
                    <textarea 
                        ref={textareaRef} 
                        name="project_long_description" 
                        value={longDescription} 
                        onChange={(e) => handleTextChange(e, setLongDescription)}
                    />
                </div>
                <p className="about-project__faculty small--text">
                    Faculty: 
                    <input
                        type="text"
                        name="faculty"
                        value={editedProject.faculty || ""}
                        onChange={handleInputChange}
                        placeholder="Faculty"
                    />
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
