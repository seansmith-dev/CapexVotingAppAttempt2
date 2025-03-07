import React, { useState } from 'react';
import './CreateProject.css';
import Button from '../../components/Button/Button.js';

function CreateProject() {
    const [teamMembers, setTeamMembers] = useState(['']);
    const [shortDescription, setShortDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [projectTitle, setProjectTitle] = useState('');
    const [facultyName, setFacultyName] = useState('');
    const [teamName, setTeamName] = useState('');


    const handleAddMember = (event) => {
        event.preventDefault(); 
        setTeamMembers([...teamMembers, '']);
    };

    const handleRemoveMember = (event) => {
        event.preventDefault(); 
        if (teamMembers.length > 1) {
            setTeamMembers(teamMembers.slice(0, -1));
        }
    };

    const handleTeamMemberChange = (index, event) => {
        const newTeamMembers = [...teamMembers];
        newTeamMembers[index] = event.target.value;
        setTeamMembers(newTeamMembers);
    };

    // Function to auto-resize the textarea
    const handleTextChange = (event, setState) => {
        setState(event.target.value);
        event.target.style.height = "auto";
        event.target.style.height = event.target.scrollHeight + "px";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const projectData = {
            projectTitle,
            shortDescription,
            longDescription,
            facultyName,
            teamName,
            teamMembers,
        };
    
        try {
            const response = await fetch('/api/createProject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });
    
            if (response.ok) {
                alert('Project created successfully!');
            } else {
                console.log('Failed to create project');
                
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        }
    };
    

    

    return (
        <div className="projects">
            <h1 className="project__title">Create a project</h1>
            <form className="project-form" onSubmit={handleSubmit}>
                <label className="project-form__title-top">Project title</label>
                <input type="text" required className="project-form__input" />

                <label className="project-form__title">Project short description</label>
                <textarea 
                    value={shortDescription} 
                    onChange={(e) => handleTextChange(e, setShortDescription)} 
                    className="auto-resize" 
                    required
                ></textarea>

                <label className="project-form__title">Project long description</label>
                <textarea 
                    value={longDescription} 
                    onChange={(e) => handleTextChange(e, setLongDescription)} 
                    className="auto-resize" 
                    required
                ></textarea>

                <label className="project-form__title">Faculty name</label>
                <input type="text" required />

                <label className="project-form__title">Team Name</label>
                <input type="text" required />

                <label className="project-form__title">Team Members</label>

                {teamMembers.map((member, index) => (
                    <div key={index} className="team-member__input">
                        <input
                            type="text"
                            value={member}
                            onChange={(e) => handleTeamMemberChange(index, e)}
                            placeholder={`Team Member ${index + 1}`}
                            required
                        />
                    </div>
                ))}

                <div className="team-member-buttons">
                    <Button onClick={handleAddMember} className="btn--add" buttonSize="medium-small" buttonText="Add"/>
                    <Button onClick={handleRemoveMember} disabled={teamMembers.length <= 1} buttonSize="medium-small"  className="btn--remove" buttonText="Remove"/>
                </div>

                <Button onClick={handleSubmit} type="submit" buttonText="Submit" className="btn--submit"></Button>
            </form>
        </div>
    );
}

export default CreateProject;
