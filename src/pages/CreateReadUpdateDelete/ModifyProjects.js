import "./ModifyProjects.css";
import Button from "../../components/Button/Button.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../LoadingVote/Loading.js";

function UpdateProjects() {
    const [projects, setProjects] = useState(null); // Start with null for loading state
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/getProjectsList.js`)
            .then((response) => response.json())
            .then((data) => {
                setProjects(data);
            })
            .catch((error) => {
                console.error("Error fetching projects:", error);
                setError("Error fetching projects.");
                navigate("/error");
            });
    }, [navigate]);

    if (error) {
        return <div>{error}</div>;
    }

    if (projects === null) {
        return <Loading />; // Show loading only while fetching
    }

    return (
        <div className="admin-page">
            <h1 className="admin-page__title">Modify Projects</h1>
            <Button 
                buttonType="card" 
                buttonSize="large" 
                buttonText="Create Project" 
                buttonCardNo="three" 
                className="btn--create-project" 
                buttonNavigateTo="/create"
            />
            {projects.length > 0 ? (
                <div className="leaderboard">
                    {projects.map((project) => (
                        <div key={project.project_number} className="modify-team">
                            <h2 className="leaderboard__team">Project {project.project_number}</h2>
                            <Button 
                                buttonType="card" 
                                buttonSize="medium-small" 
                                buttonText="Edit" 
                                buttonCardNo="three" 
                                buttonNavigateTo={`/edit/${project.project_number}`} 
                                className="btn--edit"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p>No projects available. Click "Create Project" to add one.</p>
            )}
        </div>
    );
}

export default UpdateProjects;
