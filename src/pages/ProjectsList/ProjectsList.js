import { useEffect, useState } from 'react';
import './ProjectsList.css';
import ButtonWithIcon from '../../components/Button/Button-with-icon.js';
import { Link } from 'react-router-dom';

function ProjectsList() {
    const [projects, setProjects] = useState([]);

    
    useEffect(() => {
        fetch(`/api/getProjectsList.js`)
            .then((response) => response.json())
            .then((data) => {
                setProjects(data);
                console.log(data)
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
        <div className="project-menu">
            <div className="project-menu__title-container">
                <h1 className="page-title">Projects List</h1>
                <p className="page-subtitle pm-subtitle">Tap on a project from the list below</p>
            </div>
            <div className="project-list__wrapper">
                <div className="project-list">
                    {projects.map((project) => (
                        <Link key={project.project_id} to={`/project-description/${project.project_id}`}>
                            <div className="project-list__card">
                                <h3 className="pl__card-title">Project {project.project_number}</h3>
                                <p className="pl__short-description">{project.short_description}</p>
                                <p className="pl__faculty small--text">{project.faculty_name}</p>
                                <ButtonWithIcon
                                    buttonType="primary"
                                    size="medium-small"
                                    width="slim"
                                    className="pl__btn-layout"
                                    text="Vote"
                                    buttonNavigateTo={`/project-description/${project.project_id}`}
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProjectsList;
