// next.js function. Serverless function

export default function handler(req, res) {
    if (req.method === 'GET') {
        const projects = [
            {
                "project-id": 1,
                "project_number": "1",
                "title": "AI-Powered Chatbot",
                "short_description": "A chatbot that uses AI to assist users.",
                "long_description": "This chatbot leverages machine learning and NLP techniques to provide real-time responses to user queries.",
                "team_members": ["Alice", "Bob"],
                "faculty": "Computer Science",
                "no_votes": "4"
            },
            {
                "project-id": 2,
                "project_number": "2",
                "title": "Smart Traffic Management System",
                "short_description": "A system to optimize city traffic flow.",
                "long_description": "Using IoT sensors and AI, this system dynamically adjusts traffic signals based on real-time vehicle density.",
                "team_members": ["Charlie", "David"],
                "faculty": "Engineering",
                "no_votes": "5"
            },
            {
                "project-id": 3,
                "project_number": "3",
                "title": "Blockchain Voting System",
                "short_description": "A secure, transparent e-voting system.",
                "long_description": "This project utilizes blockchain technology to ensure tamper-proof and verifiable voting processes.",
                "team_members": ["Eve", "Frank"],
                "faculty": "Cybersecurity",
                "no_votes": "7"
            },
            {
                "project-id": 4,
                "project_number": "4",
                "title": "Autonomous Drone Delivery",
                "short_description": "Drones for last-mile package delivery.",
                "long_description": "A drone-based delivery system that autonomously navigates to drop off parcels with high efficiency.",
                "team_members": ["Grace", "Hank"],
                "faculty": "Aerospace Engineering",
                "no_votes": "9"
            },
            {
                "project-id": 5,
                "project_number": "5",
                "title": "Wearable Health Monitor",
                "short_description": "A smartwatch that tracks vital health metrics.",
                "long_description": "This wearable device continuously monitors heart rate, blood oxygen, and other health indicators, providing real-time feedback.",
                "team_members": ["Ivy", "Jack"],
                "faculty": "Biomedical Engineering",
                "no_votes": "2"
            },
            {
                "project-id": 6,
                "project_number": "6",
                "title": "Augmented Reality Learning App",
                "short_description": "An AR app for interactive learning.",
                "long_description": "Students can use augmented reality to interact with 3D models, improving their understanding of complex topics.",
                "team_members": ["Kelly", "Leo"],
                "faculty": "Education Technology",
                "no_votes": "3"
            },
            {
                "project-id": 7,
                "project_number": "7",
                "title": "Smart Home Automation",
                "short_description": "AI-powered home automation system.",
                "long_description": "A centralized system that automates lighting, security, and temperature control based on user behavior.",
                "team_members": ["Mia", "Noah"],
                "faculty": "Electrical Engineering",
                "no_votes": "1"
            },
            {
                "project-id": 8,
                "project_number": "8",
                "title": "Eco-Friendly Water Purifier",
                "short_description": "A solar-powered water purification system.",
                "long_description": "This device removes contaminants from water using solar energy, providing clean water in remote areas.",
                "team_members": ["Olivia", "Paul"],
                "faculty": "Environmental Science",
                "no_votes": "20"
            },
            {
                "project-id": 9,
                "project_number": "9",
                "title": "AI-Based Resume Screening",
                "short_description": "An AI tool to assist HR in hiring.",
                "long_description": "This system scans resumes using machine learning and ranks candidates based on job requirements.",
                "team_members": ["Quinn", "Ryan"],
                "faculty": "Business & Technology",
                "no_votes": "11"
            },
            {
                "project-id": 10,
                "project_number": "10",
                "title": "IoT-Based Smart Farming",
                "short_description": "A precision agriculture solution.",
                "long_description": "IoT sensors monitor soil conditions and automate irrigation, maximizing crop yield and minimizing water waste.",
                "team_members": ["Sophia", "Tom"],
                "faculty": "Agricultural Technology",
                "no_votes": "4"
            }
        ];

        // Get fields to return from query parameters (if any)
        const fields = req.query.fields ? req.query.fields.split(',') : null;

        // Optionally filter projects based on `id` or other query params
        const projectId = req.query.id;

        // Filter projects by `id` if `id` query param is provided
        const filteredProjects = projectId 
            ? projects.filter(project => project['project-id'] === parseInt(projectId))
            : projects;

        // If specific fields are requested, return only those fields
        const result = filteredProjects.map(project => {
            if (fields) {
                const filteredProject = {};
                fields.forEach(field => {
                    if (project[field]) {
                        filteredProject[field] = project[field];
                    }
                });
                return filteredProject;
            }
            return project; // Return full project data if no fields are specified
        });

        res.status(200).json(projects);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
