"use client";

import { useState, useEffect } from 'react';

interface Project {
    id: string;
    name: string;
    votes: number;
}

export default function GuestLeaderboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/votes/guest')
            .then(res => res.json())
            .then(data => {
                setProjects(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching leaderboard:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-gray-100 p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6">Guest Votes Leaderboard</h1>
                
                <div className="space-y-4">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className="flex items-center justify-between p-4 border rounded"
                        >
                            <div className="flex items-center">
                                <span className="text-2xl font-bold text-gray-500 mr-4">
                                    #{index + 1}
                                </span>
                                <div>
                                    <p className="font-medium">{project.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {project.votes} votes
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 