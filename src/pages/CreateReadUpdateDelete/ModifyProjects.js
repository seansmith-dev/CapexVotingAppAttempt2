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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editedProject, setEditedProject] = useState(null);
    const [longDescription, setLongDescription] = useState(""); 
    const textareaRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const timeoutId = setTimeout(() => {
            if (isMounted) {
                setError("Request timed out. Redirecting to admin page.");
                setLoading(false);
                navigate("/update-projects");
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
                    if (!data || Object.keys(data).length === 0) {
                        setError("Project not found. Redirecting to admin page.");
                        setLoading(false);
                        navigate("/update-projects");
                    } else {
                        setProject(data);
                        setEditedProject(data);
                        setLongDescription(data.project_long_description || "");
                        setLoading(false);
                    }
                }
            })
            .catch((error) => {
                if (isMounted) {
                    setError("Error fetching project details.");
                    setLoading(false);
                    navigate("/update-projects");
                }
            });

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [projectNumber, navigate]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="project-description">
            <div className="text-wrapper">
                <h1 className="hero__heading page-title">
                    Project {project.project_number} <br />
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
                        onChange={(e) => setLongDescription(e.target.value)}
                    />
                </div>
                <p className="about-project__faculty small--text">
                    Faculty:
                    <input
                        type="text"
                        name="faculty"
                        value={editedProject.faculty || ""}
                        onChange={(e) => setEditedProject({ ...editedProject, faculty: e.target.value })}
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
        </div>
    );
}

export default Edit;
