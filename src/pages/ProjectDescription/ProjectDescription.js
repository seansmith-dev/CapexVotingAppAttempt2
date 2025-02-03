import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectDescription.css';
import ButtonWithIcon from '../../components/Button/Button-with-icon.js';
import Loading from '../LoadingVote/Loading.js';

function ProjectDescription() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);

    useEffect(() => {
        fetch(`/api/projects?id=${projectId}`)
            .then(response => response.json())
            .then(data => setProject(data))
            .catch(error => console.error("Error fetching project details:", error));
    }, [projectId]);

    if (!project) {
        return <Loading />; // Show loading while fetching project
    }

    const handleVote = () => {
        const token = localStorage.getItem("voteToken"); // Retrieve stored token
        if (!token) {
            alert("Error: No token found. Please scan the QR code again.");
            navigate("/"); // Send them back to restart
            return;
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
                    buttonNavigateTo={`/loading?checkGeo=true&token=${token}`} // Use function to navigate with token
                />
            </div>

            <main className="about-project">
                <h2 className="about-project__heading">About</h2>
                <div className="project-text__wrapper">
                    <p className="about-project__text">{project.long_description}</p>
                </div>
                <p className="about-project__faculty small--text">Faculty: {project.faculty}</p>
            </main>
        </div>
    );
}

export default ProjectDescription;
