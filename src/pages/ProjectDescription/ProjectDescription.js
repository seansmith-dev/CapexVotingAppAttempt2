import './ProjectDescription.css'
import ButtonWithIcon from '../../components/Button/Button-with-icon';

function ProjectDescription(){
    return(
        <div className="project-description">
            <div className="text-wrapper">
               
                    <h1 className="hero__heading page-title">Project 1 <br/> <span className="project-description__title">Voting app</span></h1>
               
                <div className="team-introduction-wrapper">
                
                    <div className="team-introduction">
                            <div className="title-wrapper">
                                <p className="team-introduction__title">Team introduction</p>
                            </div>
                        
                        <div className="team-members-container">
                            <p className="team-introduction__team-member">1. Sean Smith (Team Leader)</p>
                            <p className="team-introduction__team-member">2. Mohammad Obaidullah Abid</p>
                            <p className="team-introduction__team-member">3. Syed Fawad Amir</p>
                            <p className="team-introduction__team-member">4. Eshmam Nawar</p>
                            <p className="team-introduction__team-member">5. Raisa Anzum Rahman</p>
                            <p className="team-introduction__team-member">6. Tashahud Ahmed</p>
                        </div>
                    </div>
                </div>
                <ButtonWithIcon buttonType="primary" size="medium" text="Vote" buttonNavigateTo="/loading"/>
            </div>
            <main className="about-project">
                <h2 className="about-project__heading">About</h2>
                <div class="project-text__wrapper">
                    <p className="about-project__text">The CAPEX Voting App is a web-based application designed for Swinburne University's final year project expo, where attendees can vote for the best project and poster. The app simplifies the voting process by allowing attendees to scan QR codes placed at the event, without requiring additional registration. </p>
                    <p className="about-project__text">Attendees are categorized as students or guests, with only students optionally providing their student ID for voting. The app ensures secure, fair voting and complies with data privacy regulations, while aligning with the university's branding and being adaptable across platforms. Key functionalities include real-time vote updates and prevention of duplicate votes.</p>
                </div>
                <p className="about-project__faculty small--text">Faculty: Computer science</p>
            </main>
            
            
        </div>
    )

}

export default ProjectDescription;