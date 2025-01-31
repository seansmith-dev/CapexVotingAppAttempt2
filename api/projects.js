// next.js function. Serverless function

export default function handler(req, res) {
    if (req.method === 'GET') {
        const projects = [
            {
                "project_id": 1,
                "project_number": "1",
                "title": "AI-Powered Chatbot",
                "short_description": "A chatbot that uses AI to assist users.",
                "long_description": "This chatbot leverages machine learning and NLP techniques to provide real-time responses to user queries.",
                "team_members": ["Alice", "Bob"],
                "faculty": "Computer Science",
                "no_votes": "4"
            },
            {
                "project_id": 2,
                "project_number": "2",
                "title": "Smart Traffic Management System",
                "short_description": "A system to optimize city traffic flow.",
                "long_description": "The CAPEX Voting App is a web-based application designed for Swinburne University's final year project expo, where attendees can vote for the best project and poster. The app simplifies the voting process by allowing attendees to scan QR codes placed at the event, without requiring additional registration. Attendees are categorized as students or guests, with only students optionally providing their student ID for voting. The app ensures secure, fair voting and complies with data privacy regulations, while aligning with the university's branding and being adaptable across platforms. Key functionalities include real-time vote updates and prevention of duplicate votes.",
                "team_members": ["Sean Smith (Team Leader)", "Mohammad Obaidullah Abid", "Syed Fawad Amir", "Eshmam Nawar", "Raisa Anzum Rahman", "Tashahud Ahmed"],
                "faculty": "Engineering",
                "no_votes": "5"
            },
            {
                "project_id": 3,
                "project_number": "3",
                "title": "Blockchain Voting System",
                "short_description": "A secure, transparent e-voting system.",
                "long_description": "This project utilizes blockchain technology to ensure tamper-proof and verifiable voting processes.",
                "team_members": ["Eve", "Frank"],
                "faculty": "Cybersecurity",
                "no_votes": "7"
            },
            {
                "project_id": 4,
                "project_number": "4",
                "title": "Autonomous Drone Delivery",
                "short_description": "Drones for last-mile package delivery.",
                "long_description": "A drone-based delivery system that autonomously navigates to drop off parcels with high efficiency.",
                "team_members": ["Grace", "Hank"],
                "faculty": "Aerospace Engineering",
                "no_votes": "9"
            },
            {
                "project_id": 5,
                "project_number": "5",
                "title": "Wearable Health Monitor",
                "short_description": "A smartwatch that tracks vital health metrics.",
                "long_description": "This wearable device continuously monitors heart rate, blood oxygen, and other health indicators, providing real-time feedback.",
                "team_members": ["Ivy", "Jack"],
                "faculty": "Biomedical Engineering",
                "no_votes": "2"
            },
            {
                "project_id": 6,
                "project_number": "6",
                "title": "Augmented Reality Learning App",
                "short_description": "An AR app for interactive learning.",
                "long_description": "Students can use augmented reality to interact with 3D models, improving their understanding of complex topics.",
                "team_members": ["Kelly", "Leo"],
                "faculty": "Education Technology",
                "no_votes": "3"
            },
            {
                "project_id": 7,
                "project_number": "7",
                "title": "Smart Home Automation",
                "short_description": "AI-powered home automation system.",
                "long_description": "A centralized system that automates lighting, security, and temperature control based on user behavior.",
                "team_members": ["Mia", "Noah"],
                "faculty": "Electrical Engineering",
                "no_votes": "1"
            },
            {
                "project_id": 8,
                "project_number": "8",
                "title": "Eco-Friendly Water Purifier",
                "short_description": "A solar-powered water purification system.",
                "long_description": "This device removes contaminants from water using solar energy, providing clean water in remote areas.",
                "team_members": ["Olivia", "Paul"],
                "faculty": "Environmental Science",
                "no_votes": "20"
            },
            {
                "project_id": 9,
                "project_number": "9",
                "title": "AI-Based Resume Screening",
                "short_description": "An AI tool to assist HR in hiring.",
                "long_description": "This system scans resumes using machine learning and ranks candidates based on job requirements.",
                "team_members": ["Quinn", "Ryan"],
                "faculty": "Business & Technology",
                "no_votes": "11"
            },
            {
                "project_id": 10,
                "project_number": "10",
                "title": "IoT-Based Smart Farming",
                "short_description": "A precision agriculture solution.",
                "long_description": "IoT sensors monitor soil conditions and automate irrigation, maximizing crop yield and minimizing water waste.",
                "team_members": ["Sophia", "Tom"],
                "faculty": "Agricultural Technology",
                "no_votes": "4"
            }
        ];
        
        // If a projectId is in the URL (e.g., /api/projects/2), fetch that specific project
        const projectId = req.query.id; // Get projectId from URL (e.g., /api/projects/1)

        // If projectId exists, filter the project by ID
        if (projectId) {
            const project = projects.find(p => p.project_id === parseInt(projectId));
            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }
            return res.status(200).json(project); // Return single project
        }

        // Otherwise, return all projects
        const fields = req.query.fields ? req.query.fields.split(',') : null;

        const result = projects.map(project => {
            if (fields) {
                const filteredProject = {};
                fields.forEach(field => {
                    if (project[field]) {
                        filteredProject[field] = project[field];
                    }
                });
                return filteredProject;
            }
            return project;
        });

        res.status(200).json(projects);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
