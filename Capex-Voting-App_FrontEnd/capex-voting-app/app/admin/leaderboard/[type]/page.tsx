"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import AdminLayout from "../../../layouts/admin";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { use } from "react";

import { Search, Trophy } from "lucide-react";

interface Project {
    id: string;
    name: string;
    faculty: string;
    votes: number;
    rank?: number;
}

interface LeaderboardProps {
    params: Promise<{
        type: string;
    }>;
}


// Mock data for guest leaderboard
const mockProjects: Project[] = [
    {
        id: "1",
        name: "Smart Campus Navigation System",
        faculty: "Faculty of Engineering",
        votes: 245,
    },
    {
        id: "2",
        name: "AI-Powered Student Assistant",
        faculty: "Faculty of Engineering",
        votes: 198,
    },
    {
        id: "3",
        name: "Sustainable Energy Solutions",
        faculty: "Faculty of Engineering",
        votes: 176,
    },
    {
        id: "4",
        name: "Virtual Reality Learning Platform",
        faculty: "Faculty of Engineering",
        votes: 154,
    },
    {
        id: "5",
        name: "Blockchain Voting System",
        faculty: "Faculty of Engineering",
        votes: 132,
    },
    {
        id: "6",
        name: "Smart Agriculture Monitoring",
        faculty: "Faculty of Engineering",
        votes: 121,
    },
    {
        id: "7",
        name: "Healthcare Management System",
        faculty: "Faculty of Engineering",
        votes: 98,
    },
    {
        id: "8",
        name: "Eco-Friendly Packaging Solutions",
        faculty: "Faculty of Engineering",
        votes: 87,
    },
    {
        id: "9",
        name: "Autonomous Delivery Robot",
        faculty: "Faculty of Engineering",
        votes: 76,
    },
    {
        id: "10",
        name: "Digital Art Gallery",
        faculty: "Faculty of Engineering",
        votes: 65,
    },
];

export default function Leaderboard({ params }: LeaderboardProps) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const leaderboardType =
        resolvedParams.type === "industry" ? "Industry" : "Guest";

    useEffect(() => {
        // Commented out actual fetch call
        fetchLeaderboard();

        // Using mock data instead
        // mockProjects.map((project) => {
        //     project.votes = Math.floor(Math.random() * 1000);
        // });
        // mockProjects.sort((a, b) => b.votes - a.votes);
        // mockProjects.forEach((project, index) => {
        //     project.rank = index + 1;
        // });
        setProjects(mockProjects);
        setLoading(false);
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const adminToken = Cookies.get("admin-token");
            if (!adminToken) {
                toast.error("Admin session expired. Please login again.");
                router.push("/admin");
                return;
            }

            const response = await fetch(
                `/api/getLeaderboard?leaderboard_type=${resolvedParams.type}`,
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                }
            );
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error("Failed to fetch leaderboard");
            }

            console.log("This is the data retrieved",data)

            setProjects(data);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            toast.error("Failed to fetch leaderboard. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(
        (project) =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.faculty.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout heading={`${leaderboardType} Leaderboard`}>
            <div className=" p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-8">Loading...</div>
                        ) : filteredProjects.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">
                                    No projects found matching the filters.
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">
                                            Rank
                                        </TableHead>
                                        <TableHead>Project Name</TableHead>
                                        <TableHead className="hidden md:inline lg:inline">
                                            Faculty
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Votes
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProjects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell>
                                                <div className="flex justify-center">
                                                    {project.rank &&
                                                    project.rank <= 3 ? (
                                                        <Trophy
                                                            className={`h-4 w-4 ${
                                                                project.rank ===
                                                                1
                                                                    ? "text-yellow-500"
                                                                    : project.rank ===
                                                                      2
                                                                    ? "text-gray-400"
                                                                    : "text-amber-700"
                                                            }`}
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-center">
                                                            {project.rank}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {project.name}
                                            </TableCell>
                                            <TableCell className="hidden md:inline lg:inline">
                                                {project.faculty}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {project.votes}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
