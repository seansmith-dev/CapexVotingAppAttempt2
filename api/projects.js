// next.js function. Serverless function

export default function handler(req, res) {
    if (req.method === 'GET') {
        const projects = [
            {
                "project_id": 1,
                "project_number": "1",
                "title": "AI-Powered Chatbot",
                "short_description": "A chatbot that uses AI to assist users.",
                "long_description": "This chatbot uses artificial intelligence, machine learning, and natural language processing techniques to facilitate real-time interactions with users. It can provide quick responses to frequently asked questions, assist with task automation, and offer personalized user experiences, making it a versatile tool in both business and customer service settings. The AI behind the system learns over time, improving its accuracy and ability to handle more complex queries, enhancing the user experience. Additionally, the system is designed to integrate with various messaging platforms, ensuring it can be deployed across different channels like websites, mobile apps, and social media platforms.",
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
                "long_description": "This blockchain-based voting system utilizes distributed ledger technology to ensure that every vote is securely recorded and can be verified by any interested party. The system ensures complete transparency and traceability of votes, making it ideal for electoral processes in any setting, including government elections and corporate shareholder voting. With a built-in security framework, the system also provides resistance to tampering and fraud, ensuring the integrity of the voting process. Moreover, the decentralized nature of blockchain prevents any central authority from manipulating the votes, offering a truly democratic and transparent method of voting.",
                "team_members": ["Eve", "Frank", "Grace", "Hank", "Ivy"],
                "faculty": "Cybersecurity",
                "no_votes": "7"
            },
            {
                "project_id": 4,
                "project_number": "4",
                "title": "Autonomous Drone Delivery",
                "short_description": "Drones for last-mile package delivery.",
                "long_description": "This system leverages autonomous drones equipped with advanced navigation and delivery capabilities to efficiently transport packages from central hubs to their destinations. The drones are designed to avoid obstacles, ensure the safety of delivery items, and meet regulatory standards for flight operations in urban areas. The solution aims to reduce delivery times, environmental impact, and the burden on traditional delivery networks. The drones are equipped with cutting-edge sensors, enabling them to operate even in challenging weather conditions, and are able to navigate complex urban environments with minimal human intervention. The project also aims to integrate with existing logistics systems, providing an end-to-end solution for faster and more sustainable package delivery.",
                "team_members": ["Grace", "Hank", "Jack", "Liam"],
                "faculty": "Aerospace Engineering",
                "no_votes": "9"
            },
            {
                "project_id": 5,
                "project_number": "5",
                "title": "Wearable Health Monitor",
                "short_description": "A smartwatch that tracks vital health metrics.",
                "long_description": "This wearable device continuously tracks key health metrics such as heart rate, blood oxygen levels, and activity levels. It provides real-time feedback and alerts the wearer to potential health issues, enabling proactive management of chronic conditions or general wellness. The smartwatch integrates seamlessly with mobile apps to store historical data and generate health reports for users and healthcare providers. In addition to fitness tracking, the device includes features such as sleep monitoring, stress detection, and hydration reminders, making it a comprehensive health management tool. It also supports remote consultations with healthcare professionals by sharing the data through secure channels, helping to ensure better patient care.",
                "team_members": ["Ivy", "Jack"],
                "faculty": "Biomedical Engineering",
                "no_votes": "2"
            },
            {
                "project_id": 6,
                "project_number": "6",
                "title": "Augmented Reality Learning App",
                "short_description": "An AR app for interactive learning.",
                "long_description": "This augmented reality (AR) application offers an interactive and immersive learning experience by overlaying 3D models and simulations onto real-world environments. It enhances students' understanding of complex subjects such as anatomy, physics, and history by providing hands-on, visual learning. The app is designed for educational institutions and can be customized for various subjects and grade levels. It offers a unique way to engage students by allowing them to visualize and interact with otherwise abstract or invisible concepts. The app also includes features like collaborative learning, where students can work together in real-time on shared AR content, creating a more dynamic and engaging educational environment.",
                "team_members": ["Kelly", "Leo", "Mia"],
                "faculty": "Education Technology",
                "no_votes": "3"
            },
            {
                "project_id": 7,
                "project_number": "7",
                "title": "Smart Home Automation",
                "short_description": "AI-powered home automation system.",
                "long_description": "This system automates various aspects of home life, including lighting, temperature control, security, and entertainment, based on user preferences and habits. It utilizes AI algorithms to learn from the user's daily routine, creating a truly personalized living experience. The system can be controlled remotely via smartphones and integrates with other smart home devices to create a seamless ecosystem. Additionally, it provides energy-saving features by optimizing the use of appliances and lighting based on user activity patterns. The system also enhances security by recognizing unusual behavior and providing instant alerts in case of emergencies, contributing to a safer and more efficient home environment.",
                "team_members": ["Mia", "Noah", "Olivia"],
                "faculty": "Electrical Engineering",
                "no_votes": "1"
            },
            {
                "project_id": 8,
                "project_number": "8",
                "title": "Eco-Friendly Water Purifier",
                "short_description": "A solar-powered water purification system.",
                "long_description": "This device uses solar energy to power a filtration system that removes harmful contaminants from water, providing clean drinking water in remote or off-grid areas. The purifier is designed to be low-maintenance, cost-effective, and capable of purifying large amounts of water over extended periods. The system is ideal for use in areas where access to electricity is limited, and the environmental impact of traditional water purification methods is significant. It also helps reduce the reliance on plastic bottles by providing a sustainable, long-term solution for clean water access. The purifier's robust design makes it suitable for both emergency response situations and everyday use in off-the-grid communities.",
                "team_members": ["Olivia", "Paul", "Quinn", "Ryan", "Sophia"],
                "faculty": "Environmental Science",
                "no_votes": "20"
            },
            {
                "project_id": 9,
                "project_number": "9",
                "title": "AI-Based Resume Screening",
                "short_description": "An AI tool to assist HR in hiring.",
                "long_description": "This system utilizes artificial intelligence to automatically screen resumes, ranking candidates based on how well their qualifications match the job requirements. It uses machine learning algorithms to identify key patterns and keywords in resumes, helping HR departments quickly identify top candidates, thereby streamlining the recruitment process and reducing human bias in the selection process. The system also analyzes soft skills by evaluating language usage and phrasing in resumes and cover letters, allowing it to assess a candidate's communication style and cultural fit for the company. Furthermore, it provides detailed reports on each candidate, ensuring that HR teams can make informed decisions.",
                "team_members": ["Quinn", "Ryan"],
                "faculty": "Business & Technology",
                "no_votes": "11"
            },
            {
                "project_id": 10,
                "project_number": "10",
                "title": "IoT-Based Smart Farming",
                "short_description": "A precision agriculture solution.",
                "long_description": "This Internet of Things (IoT) system enables farmers to monitor and optimize crop growth by collecting real-time data on soil conditions, weather patterns, and crop health. Automated irrigation systems are also integrated into the platform, ensuring that crops receive the right amount of water at the right time. The system reduces resource waste, increases crop yield, and enhances sustainable farming practices. Additionally, the platform provides actionable insights through data analytics, helping farmers make more informed decisions about crop rotation, fertilization, and pest control. The system is designed to be scalable, making it suitable for both small-scale family farms and large agricultural enterprises.",
                "team_members": ["Sophia", "Tom", "Ursula"],
                "faculty": "Agriculture Engineering",
                "no_votes": "14"
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
