"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import NavBar from "@/app/components/NavBar";
import HomeIcon from "@/app/components/Icons/HomeIcon";
import UserIcon from "@/app/components/Icons/UserIcon";
import OpenBookIcon from "@/app/components/Icons/OpenBookIcon";
import Footer from "@/app/components/Footer";
interface Project {
    id: string;
    name: string;
    faculty: string;
}

// Mock projects - replace with API call
const mockProjects: Project[] = [
    {
        id: "1",
        name: "Smart Campus Navigation System",
        faculty: "Science, Computing and Engineering Technologies",
    },
    {
        id: "2",
        name: "AI-Powered Student Assistant",
        faculty: "Health, Arts and Design",
    },
    {
        id: "3",
        name: "Sustainable Energy Solutions",
        faculty: "Business, Law and Entrepreneurship",
    },
    {
        id: "4",
        name: "Virtual Reality Learning Platform",
        faculty: "Faculty of Education",
    },
    {
        id: "5",
        name: "Blockchain Voting System",
        faculty: "Faculty of Computer Science",
    },
    {
        id: "6",
        name: "Smart Agriculture Monitoring",
        faculty: "Faculty of Agriculture",
    },
    {
        id: "7",
        name: "Healthcare Management System",
        faculty: "Faculty of Medicine",
    },
    {
        id: "8",
        name: "Eco-Friendly Packaging Solutions",
        faculty: "Faculty of Design",
    },
    {
        id: "9",
        name: "Autonomous Delivery Robot",
        faculty: "Faculty of Engineering",
    },
    { id: "10", name: "Digital Art Gallery", faculty: "Faculty of Arts" },
];

export default function VotePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const qrCode = searchParams.get("code");

    const [voterType, setVoterType] = useState<"INDUSTRY" | "GUEST" | null>(
        null
    );
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const links = [
        { href: "/", text: "Home", icon: <HomeIcon /> },
        { href: "/admin", text: "Admin", icon: <UserIcon /> },
        { href: "/guide", text: "Application Guide", icon: <OpenBookIcon /> },
    ];

    if (!qrCode) {
        router.push("/");
        return null;
    }

    // Filter projects based on search query
    const filteredProjects = mockProjects.filter(
        (project) =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.faculty.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleVote = async () => {
        if (!voterType || !selectedProject) return;

        try {
            // TODO: Uncomment when API is ready
            // await fetch("/api/votes", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({
            //         qrCode,
            //         voterType,
            //         projectId: selectedProject,
            //     }),
            // });

            // For now, just show success and redirect
            alert("Vote registered successfully!");
            router.push("/");
        } catch (error) {
            console.error("Error submitting vote:", error);
            alert("Failed to submit vote. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar heading="Vote Registration" links={links} />
            <div className="flex-1 bg-gray-100 p-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="h-[60vh] mb-6 relative overflow-hidden flex justify-center">
                        <div className="bg-gray-700/80 bg-blend-darken absolute inset-0 bg-[url('/campus.jpg')] bg-cover bg-center" />
                        <div className="relative z-10">
                            <CardHeader className="text-center gap-8 w-7/10 m-auto text-white">
                                <CardTitle className="text-3xl">
                                    {voterType
                                        ? "Cast Your Vote Now"
                                        : "Welcome to Voter Registration"}
                                </CardTitle>
                                <CardDescription className="text-xl text-gray-100">
                                    {voterType
                                        ? "Choose one project to cast your vote. Remember, you can only vote once."
                                        : "Please select your voter type to proceed"}
                                </CardDescription>
                            </CardHeader>
                        </div>
                    </Card>

                    {!voterType ? (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="text-2xl text-center">
                                    You are a...
                                </CardTitle>
                                <div className="w-1/10 h-1 bg-red-700 mx-auto my-4 rounded-full" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        variant={
                                            voterType === "INDUSTRY"
                                                ? "default"
                                                : "outline"
                                        }
                                        size="lg"
                                        className="min-w-[200px]"
                                        onClick={() => {
                                            setVoterType("INDUSTRY");
                                            setSearchQuery("");
                                            setSelectedProject(null);
                                        }}
                                    >
                                        Industry Voter
                                    </Button>
                                    <Button
                                        variant={
                                            voterType === "GUEST"
                                                ? "default"
                                                : "outline"
                                        }
                                        size="lg"
                                        className="min-w-[200px]"
                                        onClick={() => {
                                            setVoterType("GUEST");
                                            setSearchQuery("");
                                            setSelectedProject(null);
                                        }}
                                    >
                                        Guest Voter
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setVoterType(null)}
                                    className="flex items-center gap-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Back to Voter Type Selection
                                </Button>
                                <div className="w-1/3">
                                    <Input
                                        type="text"
                                        placeholder="Search projects..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4">
                                {filteredProjects.length === 0 ? (
                                    <Card className="text-center p-8">
                                        <CardTitle className="text-xl text-gray-500">
                                            No projects found
                                        </CardTitle>
                                        <CardDescription className="mt-2">
                                            Try adjusting your search query
                                        </CardDescription>
                                    </Card>
                                ) : (
                                    <RadioGroup
                                        value={selectedProject || ""}
                                        onValueChange={setSelectedProject}
                                        className="grid gap-4"
                                    >
                                        {filteredProjects.map((project) => (
                                            <Card
                                                key={project.id}
                                                className={`cursor-pointer transition-colors ${
                                                    selectedProject ===
                                                    project.id
                                                        ? "ring-2 ring-blue-500"
                                                        : "hover:bg-gray-50"
                                                }`}
                                                onClick={() =>
                                                    setSelectedProject(
                                                        project.id
                                                    )
                                                }
                                            >
                                                <CardHeader className="flex flex-row items-center gap-4">
                                                    <RadioGroupItem
                                                        value={project.id}
                                                        id={project.id}
                                                    />
                                                    <div>
                                                        <CardTitle className="text-lg font-bold">
                                                            {project.name}
                                                        </CardTitle>
                                                        <CardDescription>
                                                            {project.faculty}
                                                        </CardDescription>
                                                    </div>
                                                </CardHeader>
                                            </Card>
                                        ))}
                                    </RadioGroup>
                                )}
                            </div>

                            <div className="mt-6 flex justify-center">
                                <Button
                                    onClick={() => setShowConfirmation(true)}
                                    disabled={!selectedProject}
                                    className="min-w-[200px] w-full text-lg py-6 font-bold"
                                >
                                    Submit Vote
                                </Button>
                            </div>

                            <AlertDialog
                                open={showConfirmation}
                                onOpenChange={setShowConfirmation}
                            >
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Confirm Your Vote
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This is your only chance to vote.
                                            Once submitted, you cannot change
                                            your vote. Are you sure you want to
                                            vote for{" "}
                                            {
                                                mockProjects.find(
                                                    (p) =>
                                                        p.id === selectedProject
                                                )?.name
                                            }
                                            ?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction onClick={handleVote}>
                                            Confirm Vote
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
