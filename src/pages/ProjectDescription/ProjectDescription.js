import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProjectDescription.css';
import ButtonWithIcon from '../../components/Button/Button-with-icon.js';
import Loading from '../LoadingVote/Loading.js';

function ProjectDescription() {
    const { projectId } = useParams(); // Get project ID from the URL
    const [project, setProject] = useState(null);

    useEffect(() => {
        fetch(`/api/projects?id=${projectId}`) // Fetch the selected project's details
            .then(response => response.json())
            .then(data => setProject(data))
            .catch(error => console.error("Error fetching project details:", error));
    }, [projectId]);

    if (!project) {
        return <Loading />; // Display while fetching
    }

    // Function to split description into two paragraphs based on word count
    const splitDescription = (description, wordLimit = 48) => {
        const words = description.split(' ');
    
        // Start by looking for a break at wordLimit
        let breakPoint = wordLimit;
    
        // If the word at the wordLimit is not a sentence end, look for the next good break point
        while (breakPoint < words.length && !['.', '!', '?'].includes(words[breakPoint].slice(-1))) {
            breakPoint++;
        }
        
        breakPoint++;
        // Now we have a better breakPoint
        const firstPart = words.slice(0, breakPoint).join(' ');
        const secondPart = words.slice(breakPoint).join(' ');
    
        return { firstPart, secondPart };
    };
    
    const { firstPart, secondPart } = splitDescription(project.long_description);
    

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
                    buttonNavigateTo="/loading?checkGeo=true"
                />
            </div>

            <main className="about-project">
                <h2 className="about-project__heading">About</h2>
                <div className="project-text__wrapper">
                    <p className="about-project__text">{firstPart}</p>
                    {secondPart && <p className="about-project__text">{secondPart}</p>}
                </div>
                <p className="about-project__faculty small--text">Faculty: {project.faculty}</p>
            </main>
        </div>
    );
}

export default ProjectDescription;
