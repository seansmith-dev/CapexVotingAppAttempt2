import React, { useState } from 'react';
import './CreateProject.css';
import Button from '../../components/Button/Button.js';
import { useNavigate } from 'react-router-dom';

function CreateProject() {
    const [team_members, setTeamMembers] = useState([{ first_name: '', last_name: '' }]);
    const [short_description, setShortDescription] = useState('');
    const [long_description, setLongDescription] = useState('');
    const [project_title, setProjectTitle] = useState('');
    const [faculty_name, setFacultyName] = useState('');
    const [team_name, setTeamName] = useState('');
    const navigate = useNavigate();

    const handleAddMember = (event) => {
        event.preventDefault();
        setTeamMembers([...team_members, { first_name: '', last_name: '' }]);
    };


    const handleRemoveMember = (event) => {
        event.preventDefault();
        if (teamMembers.length > 1) {
            setTeamMembers(team_members.slice(0, -1));
        }
    };


    const handleTeamMemberChange = (index, field, event) => {
        const newTeamMembers = [...team_members];
        newTeamMembers[index][field] = event.target.value;
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
            project_title,
            short_description,
            long_description,
            faculty_name,
            team_name,
            team_members,
        };

        try {
            const response = await fetch('/api/createProject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });

            console.log("Sending project data:", JSON.stringify(projectData, null, 2));


            const responseData = await response.json(); // Extract JSON data

            if (response.status === 201) {
                alert('Project created successfully!');
                navigate('/update-projects')
                console.log("201 response status executed");
            }
            else if (response.status === 409) {
                console.log("The alert executed");
                alert(responseData.message || 'Project with this title already exists!');
            }
            else if (response.status === 408) {
                console.log("The response 408 executed");
                alert(responseData.message || 'Your team has already created a project.');
            }
            else {
                console.log("The alert executed");
                alert('Something went wrong.');
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
                <input type="text"
                    value={project_title}
                    onChange={(e) => handleTextChange(e, setProjectTitle)}
                    className="project-form__input"
                    required
                />

                <label className="project-form__title">Project short description</label>
                <textarea
                    value={short_description}
                    onChange={(e) => handleTextChange(e, setShortDescription)}
                    className="auto-resize"
                    required
                ></textarea>

                <label className="project-form__title">Project long description</label>
                <textarea
                    value={long_description}
                    onChange={(e) => handleTextChange(e, setLongDescription)}
                    className="auto-resize"
                    required
                ></textarea>

                <label className="project-form__title">Faculty name</label>
                <input
                    type="text"
                    value={faculty_name}
                    onChange={(e) => setFacultyName(e.target.value)}
                    required />

                <label className="project-form__title">Team Name</label>
                <input
                    type="text"
                    value={team_name}
                    onChange={(e) => setTeamName(e.target.value)}
                    required />

                <label className="project-form__title">Team Members</label>

                {team_members.map((member, index) => (
                    <div key={index} className="team-member__input-form">
                        <div className="team-member-first-name__input">
                            <p className="team-member__text">First name</p>
                            <input
                                type="text"
                                value={member.first_name}
                                onChange={(e) => handleTeamMemberChange(index, 'first_name', e)}
                                placeholder={`First name ${index + 1}`}
                                required
                                className="first--input"
                            />
                        </div>

                        <div className="team-member-second-name__input">
                            <p className="team-member__text">Last name</p>
                            <input
                                type="text"
                                value={member.last_name}
                                onChange={(e) => handleTeamMemberChange(index, 'last_name', e)}
                                placeholder={`Second name ${index + 1}`}
                                required
                                className="second--input"
                            />
                        </div>
                    </div>
                ))}


                <div className="team-member-buttons">
                    <Button onClick={handleAddMember} className="btn--add" buttonSize="medium-small" buttonText="Add" />
                    <Button onClick={handleRemoveMember} disabled={team_members.length <= 1} buttonSize="medium-small" className="btn--remove" buttonText="Remove" />
                </div>

                <Button onClick={handleSubmit} type="submit" buttonText="Submit" className="btn--submit"></Button>
            </form>
        </div>
    );
}

export default CreateProject;
