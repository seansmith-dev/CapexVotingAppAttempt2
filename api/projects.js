// next.js function. Serverless function

export default function handler(req, res) {
    if (req.method === 'GET') {
        const projects = [
            {
                "project_id": 1,
                "project_number": "1",
                "title": "AI-Powered Chatbot",
                "short_description": "A chatbot that uses AI to assist users.",
                "long_description": "This chatbot uses artificial intelligence, machine learning, and natural language processing techniques to facilitate real-time interactions with users. It can provide quick responses to frequently asked questions, assist with task automation, and offer personalized user experiences, making it a versatile tool in both business and customer service settings.",
                "team_members": ["Alice", "Bob", "Charlie", "David"],
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
                "long_description": "This blockchain-based voting system utilizes distributed ledger technology to ensure that every vote is securely recorded and can be verified by any interested party. The system ensures complete transparency and traceability of votes, making it ideal for electoral processes in any setting, including government elections and corporate shareholder voting.",
                "team_members": ["Eve", "Frank", "Grace", "Hank", "Ivy"],
                "faculty": "Cybersecurity",
                "no_votes": "7"
            },
            {
                "project_id": 4,
                "project_number": "4",
                "title": "Autonomous Drone Delivery",
                "short_description": "Drones for last-mile package delivery.",
                "long_description": "This system leverages autonomous drones equipped with advanced navigation and delivery capabilities to efficiently transport packages from central hubs to their destinations. The drones are designed to avoid obstacles, ensure the safety of delivery items, and meet regulatory standards for flight operations in urban areas. The solution aims to reduce delivery times, environmental impact, and the burden on traditional delivery networks.",
                "team_members": ["Grace", "Hank", "Jack", "Liam"],
                "faculty": "Aerospace Engineering",
                "no_votes": "9"
            },
            {
                "project_id": 5,
                "project_number": "5",
                "title": "Wearable Health Monitor",
                "short_description": "A smartwatch that tracks vital health metrics.",
                "long_description": "This wearable device continuously tracks key health metrics such as heart rate, blood oxygen levels, and activity levels. It provides real-time feedback and alerts the wearer to potential health issues, enabling proactive management of chronic conditions or general wellness. The smartwatch integrates seamlessly with mobile apps to store historical data and generate health reports for users and healthcare providers.",
                "team_members": ["Ivy", "Jack"],
                "faculty": "Biomedical Engineering",
                "no_votes": "2"
            },
            {
                "project_id": 6,
                "project_number": "6",
                "title": "Augmented Reality Learning App",
                "short_description": "An AR app for interactive learning.",
                "long_description": "This augmented reality (AR) application offers an interactive and immersive learning experience by overlaying 3D models and simulations onto real-world environments. It enhances students' understanding of complex subjects such as anatomy, physics, and history by providing hands-on, visual learning. The app is designed for educational institutions and can be customized for various subjects and grade levels.",
                "team_members": ["Kelly", "Leo", "Mia"],
                "faculty": "Education Technology",
                "no_votes": "3"
            },
            {
                "project_id": 7,
                "project_number": "7",
                "title": "Smart Home Automation",
                "short_description": "AI-powered home automation system.",
                "long_description": "This system automates various aspects of home life, including lighting, temperature control, security, and entertainment, based on user preferences and habits. It utilizes AI algorithms to learn from the user's daily routine, creating a truly personalized living experience. The system can be controlled remotely via smartphones and integrates with other smart home devices to create a seamless ecosystem.",
                "team_members": ["Mia", "Noah", "Olivia"],
                "faculty": "Electrical Engineering",
                "no_votes": "1"
            },
            {
                "project_id": 8,
                "project_number": "8",
                "title": "Eco-Friendly Water Purifier",
                "short_description": "A solar-powered water purification system.",
                "long_description": "This device uses solar energy to power a filtration system that removes harmful contaminants from water, providing clean drinking water in remote or off-grid areas. The purifier is designed to be low-maintenance, cost-effective, and capable of purifying large amounts of water over extended periods. The system is ideal for use in areas where access to electricity is limited, and the environmental impact of traditional water purification methods is significant.",
                "team_members": ["Olivia", "Paul", "Quinn", "Ryan", "Sophia"],
                "faculty": "Environmental Science",
                "no_votes": "20"
            },
            {
                "project_id": 9,
                "project_number": "9",
                "title": "AI-Based Resume Screening",
                "short_description": "An AI tool to assist HR in hiring.",
                "long_description": "This system utilizes artificial intelligence to automatically screen resumes, ranking candidates based on how well their qualifications match the job requirements. It uses machine learning algorithms to identify key patterns and keywords in resumes, helping HR departments quickly identify top candidates, thereby streamlining the recruitment process and reducing human bias in the selection process.",
                "team_members": ["Quinn", "Ryan"],
                "faculty": "Business & Technology",
                "no_votes": "11"
            },
            {
                "project_id": 10,
                "project_number": "10",
                "title": "IoT-Based Smart Farming",
                "short_description": "A precision agriculture solution.",
                "long_description": "This Internet of Things (IoT) system enables farmers to monitor and optimize crop growth by collecting real-time data on soil conditions, weather patterns, and crop health. Automated irrigation systems are also integrated into the platform, ensuring that crops receive the right amount of water at the right time. The system reduces resource waste, increases crop yield, and enhances sustainable farming practices.",
                "team_members": ["Sophia", "Tom", "Ursula"],
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
