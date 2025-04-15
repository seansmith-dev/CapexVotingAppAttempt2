"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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

    const links = [
        { href: "/", text: "Home", icon: <HomeIcon /> },
        { href: "/admin", text: "Admin", icon: <UserIcon /> },
        { href: "/guide", text: "Application Guide", icon: <OpenBookIcon /> },
    ];

    if (!qrCode) {
        router.push("/");
        return null;
    }

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
                    <Card className=" mb-6">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl">
                                {voterType
                                    ? "Cast Your Vote Now"
                                    : "Welcome to Voter Registration"}
                            </CardTitle>
                            <CardDescription className="text-lg">
                                {voterType
                                    ? "Choose one project to cast your vote. Remember, you can only vote once."
                                    : "Please select your voter type to proceed"}
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {!voterType ? (
                        <div className="flex justify-center gap-4">
                            <Button
                                variant={
                                    voterType === "INDUSTRY"
                                        ? "default"
                                        : "outline"
                                }
                                size="lg"
                                className="min-w-[200px]"
                                onClick={() => setVoterType("INDUSTRY")}
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
                                onClick={() => setVoterType("GUEST")}
                            >
                                Guest Voter
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-4">
                                {mockProjects.map((project) => (
                                    <Card
                                        key={project.id}
                                        className={`cursor-pointer transition-colors ${
                                            selectedProject === project.id
                                                ? "border-blue-500 bg-blue-50"
                                                : "hover:bg-gray-50"
                                        }`}
                                        onClick={() =>
                                            setSelectedProject(project.id)
                                        }
                                    >
                                        <CardHeader>
                                            <CardTitle>
                                                {project.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {project.faculty}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-center">
                                <Button
                                    onClick={() => setShowConfirmation(true)}
                                    disabled={!selectedProject}
                                    className="min-w-[200px]"
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
        </div>
    );
}
