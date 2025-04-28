"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import Footer from "@/app/components/Footer";
import RegularNavBar from "@/app/components/RegularNavBar";
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
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [voterType, setVoterType] = useState<"INDUSTRY" | "GUEST" | null>(
        null
    );
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isOriginalButtonVisible, setIsOriginalButtonVisible] =
        useState(false); // State for original button visibility
    const originalButtonRef = useRef<HTMLDivElement>(null); // Ref for the original button container

    const [projects, setProjects] = useState<Project[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Access the URL parameters using window.location (which is only available client-side)
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token'); // Setting the 'code' query parameter to state

        if (!token) {
            router.push('/'); // Redirect to homepage if no code is found
        } else {
            localStorage.setItem('votingToken', token);
            setQrCode(token); // Otherwise, set the QR code state
            console.log("Search params:", window.location.search);
            console.log("QR Code found:", token);
        }
    }, [router]);

    useEffect(() => {
        fetch(`/api/getProjectsList`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch projects");
                }
                return response.json();
            })
            .then((data) => {
                const formattedProjects: Project[] = data.map((item: any) => ({
                    id: item.project_number.toString(), // convert number to string
                    name: item.project_title,
                    faculty: item.faculty_name,
                }));
                setProjects(formattedProjects);
                console.log(data)
            })
            .catch((error) => {
                console.error("Error fetching projects:", error);
                setError("Error fetching projects.");
            });
    }, []);

    useEffect(() => {
        if (error) {
            router.push("/");
        }
    }, [error, router]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsOriginalButtonVisible(entry.isIntersecting);
            },
            {
                root: null, // relative to document viewport
                rootMargin: "0px",
                threshold: 0.1, // trigger if 10% of the element is visible
            }
        );


        const currentButtonRef = originalButtonRef.current;
        if (currentButtonRef) {
            observer.observe(currentButtonRef);
        }

        return () => {
            if (currentButtonRef) {
                observer.unobserve(currentButtonRef);
            }
        };
    }, [voterType]);

    if (projects === null) {
        return null; // Show loading only while fetching
    }

    // Filter projects based on search query
    const filteredProjects = projects ? projects.filter(
        (project) =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.faculty.toLowerCase().includes(searchQuery.toLowerCase())
    )
        : [];

    const handleVote = async () => {
        if (!voterType || !selectedProject) return;

        const token = localStorage.getItem('votingToken');

        if (!token) {
            alert("You must scan a qr code to vote");
            router.push("/");
            return;
        }

        try {
            const res = await fetch(`/api/validate-token?token=${encodeURIComponent(token)}`);
            const data = await res.json();

            if (!res.ok || !data.valid) {
                alert("Invalid or expired token. Access denied.");
                router.push('/');
                return;
            }
        } catch (error) {
            alert("Network error occurred while validating token.");
            return;
        }

        try {
            const response = await fetch(`/api/vote?token=${token}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ project_number: selectedProject, }),
            });

            const responseBody = await response.json();

            if (response.status === 200) {
                //Removing token, since already voted and don't want home showing messages. 
                localStorage.removeItem('votingToken');
                const searchParams = new URLSearchParams(window.location.search);
                searchParams.delete('token'); // Remove token query param
                
                window.history.replaceState(
                    null,
                    '', // Title is not used
                    `${window.location.pathname}?${searchParams.toString()}`
                  );

                alert("Project voted for successfully!");
                router.push('/');
            } else if (response.status === 409) {
                alert("You have already voted.");
                router.push('/');
            } else if (response.status === 404) {
                alert("You can't vote without a QR code.");
                router.push('/');
            } else {
                alert("Error voting for project.");
                router.push('/');
            }
        } catch (error) {
            alert("There was an error voting.");
            router.push('/');
        }


    };

    return (

        <div className="min-h-screen flex flex-col">
            <RegularNavBar heading="Vote Registration" />
            <div className="flex-1 bg-gray-100 p-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="h-[60vh] mb-6 relative overflow-hidden flex justify-center">
                        <div className="bg-gray-700/80 bg-blend-darken absolute inset-0 bg-[url('/campus.jpg')] bg-cover bg-center" />
                        <div className="relative z-10">
                            <CardHeader className="text-center gap-8 md:w-7/10 lg:w-7/10 m-auto text-white">
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
                        <Card className="mb-6 p-6">
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
                                        className="flex-1 max-w-[200px]"
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
                                        className="flex-1 max-w-[200px]"
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
                                                className={`cursor-pointer transition-colors ${selectedProject ===
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

                            <div
                                ref={originalButtonRef}
                                className="mt-6 flex justify-center"
                            >
                                <Button
                                    onClick={() => {
                                        setShowConfirmation(true);
                                        handleVote();  // <-- call it here
                                    }}
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
                                            <span className="font-bold">
                                                {" "}
                                                {
                                                    mockProjects.find(
                                                        (p) =>
                                                            p.id ===
                                                            selectedProject
                                                    )?.name
                                                }
                                            </span>
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
                    {selectedProject &&
                        voterType &&
                        !isOriginalButtonVisible && (
                            <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
                                <div className="mx-auto pointer-events-auto">
                                    <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 flex justify-center items-center">
                                        <Button
                                            onClick={() =>
                                                setShowConfirmation(true)
                                            }
                                            // Button takes full width of its container
                                            className="max-w-4xl w-full text-lg py-6 font-bold shadow-lg m-auto"
                                        >
                                            Submit Vote
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>

            <Footer />
        </div>

    );
}
