import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Edit.css";
import ButtonWithIcon from "../../components/Button/Button-with-icon.js";
import Loading from "../LoadingVote/Loading.js";
import Button from '../../components/Button/Button.js';

function Edit() {
    const { projectNumber } = useParams(); // Ensure this matches your route
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true; // Prevent state updates on unmounted component

        const timeoutId = setTimeout(() => {
            if (isMounted) {
                setError("Request timed out. Please try again later.");
            }
        }, 5000); // Timeout after 5 seconds

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
                    console.log("Fetched Projects:", data); 
                    setProject(data);
                }
            })
            .catch((error) => {
                console.error("Error fetching project details:", error);
                if (isMounted) {
                    setError("Error fetching project details.");
                }
            });

        return () => {
            isMounted = false; // Cleanup
            clearTimeout(timeoutId);
        };
    }, [projectNumber]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!project) {
        return <Loading />;
    }

    const deleteProject = async () => {
        try {
            console.log(projectNumber)
          const response = await fetch(`/api/deleteProject/${projectNumber}`, {
            method: "DELETE",
          });
          
        const responseBody = await response.text();  // Use text() to get the raw response
        console.log("Response Body:", responseBody);

          if (response.ok) {
            console.log("Project deleted successfully!");
            alert('Project deleted successfully!');
            navigate('/update-projects')
          } else {
            const errorData = await response.json();
            console.error("Error deleting project:", errorData);
          }
        } catch (error) {
          console.error("Request failed:", error);
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
                    <p className="about-project__text">{project.project_long_description}</p>
                </div>
                <p className="about-project__faculty small--text">Faculty: {project.faculty}</p>

                <Button className="btn--save" buttonSize="medium-small" buttonText="Save Changes" />
                <Button onClick={deleteProject} className="btn--delete" buttonSize="medium-small" buttonText="Delete" />
            </main>
                            
            {loadingMessage && <p className="loading-message">{loadingMessage}</p>}

            

        </div>
    );
}

export default Edit;
