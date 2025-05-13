"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Upload, FileUp } from "lucide-react";
import Cookies from "js-cookie";
import Papa from "papaparse";
import AdminLayout from "@/app/layouts/admin";
import { useEffect} from "react";

const faculties = [
    "Science, Computing and Engineering Technologies",
    "Health, Arts and Design",
    "Business, Law and Entrepreneurship",
];

interface Project {
    name: string;
    faculty: string;
}


// Mock data for projects
const mockProjects = [
    {
        name: "Smart Campus Navigation System",
        faculty: "Science, Computing and Engineering Technologies",
    },
    {
        name: "AI-Powered Student Assistant",
        faculty: "Health, Arts and Design",
    },
    {
        name: "Sustainable Energy Solutions",
        faculty: "Business, Law and Entrepreneurship",
    },
];

export default function CreateProject() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        faculty: "",
        newFaculty: "",
        projectCode: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [showNewFacultyInput, setShowNewFacultyInput] = useState(false);
    const [customFaculties, setCustomFaculties] = useState<string[]>([]);

    // Build unique faculties list from projects and custom faculties
    const uniqueFaculties = Array.from(
        new Set([...projects.map((project) => project.faculty), ...customFaculties])
    );

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/adminLogin');
                if (!response.ok) {
                    toast.error("Please login to create projects");
                    router.push('/admin');
                }
            } catch (err) {
                console.error('Session check failed:', err);
                toast.error("Session check failed. Please login again.");
                router.push('/admin');
            }
        };
        checkSession();
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
                const formattedProjects = data.map((item: any) => ({
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

    const handleAddNewFaculty = () => {
        if (formData.newFaculty.trim()) {
            // Add the new faculty to custom faculties
            setCustomFaculties([...customFaculties, formData.newFaculty.trim()]);
            // Update form data
            setFormData({
                ...formData,
                faculty: formData.newFaculty.trim(),
                newFaculty: "",
            });
            setShowNewFacultyInput(false);
            toast.success("New faculty added successfully!");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === "text/csv") {
            setFile(selectedFile);
        } else {
            toast.error("Please upload a valid CSV file");
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === "text/csv") {
            setFile(droppedFile);
        } else {
            toast.error("Please upload a valid CSV file");
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/createProject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    project_title: formData.name,
                    faculty_name: formData.faculty,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create project");
            }

            // Fetch updated projects list
            const projectsResponse = await fetch("/api/getProjectsList");
            if (!projectsResponse.ok) {
                throw new Error("Failed to fetch updated projects");
            }
            const data = await projectsResponse.json();
            const formattedProjects = data.map((item: any) => ({
                name: item.project_title,
                faculty: item.faculty_name,
            }));
            setProjects(formattedProjects);

            toast.success("Project created successfully!");
            // Clear form
            setFormData({ name: "", faculty: "", newFaculty: "", projectCode: "" });
            setShowNewFacultyInput(false);
        } catch (error) {
            console.error("Error creating project:", error);
            toast.error("Failed to create project. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a CSV file");
            return;
        }

        setIsLoading(true);

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                if (!event.target?.result) {
                    toast.error("Failed to read file");
                    setIsLoading(false);
                    return;
                }

                const csvData = event.target.result as string;
                
                const response = await fetch("/api/createProject", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ csvData }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to upload projects");
                }

                const result = await response.json();
                
                // Show success message with summary
                toast.success(
                    `Successfully processed ${result.successful.length} projects. ${
                        result.failed.length > 0
                            ? `${result.failed.length} projects failed to process.`
                            : ""
                    }`
                );

                // If there were any failures, show them in a toast
                if (result.failed.length > 0) {
                    result.failed.forEach((failure: any) => {
                        toast.error(
                            `Failed to process project "${failure.project.project_name}": ${failure.error}`
                        );
                    });
                }

                // Refresh the projects list
                const projectsResponse = await fetch("/api/getProjectsList");
                if (projectsResponse.ok) {
                    const data = await projectsResponse.json();
                    const formattedProjects = data.map((item: any) => ({
                        name: item.project_title,
                        faculty: item.faculty_name,
                    }));
                    setProjects(formattedProjects);
                }

                setFile(null);
                setIsLoading(false);
            };

            reader.onerror = () => {
                toast.error("Failed to read file");
                setIsLoading(false);
            };

            reader.readAsText(file);
        } catch (error) {
            console.error("Error uploading projects:", error);
            toast.error("Failed to upload projects. Please try again.");
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form data
        if (!formData.name.trim()) {
            toast.error("Please enter a project name");
            return;
        }

        if (!formData.faculty.trim()) {
            toast.error("Please select a faculty");
            return;
        }

        if (!formData.projectCode.trim()) {
            toast.error("Please enter a project code");
            return;
        }

        const projectData = {
            project_title: formData.name.trim(),
            faculty_name: formData.faculty.trim(),
            project_code: formData.projectCode.trim(),
        };

        try {
            const response = await fetch('/api/createProject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });

            console.log("Sending project data:", JSON.stringify(projectData, null, 2));

            const responseData = await response.json();

            if (response.status === 201) {
                toast.success('Project created successfully!');
                // Clear form
                setFormData({ name: "", faculty: "", newFaculty: "", projectCode: "" });
                // Refresh projects list
                const projectsResponse = await fetch("/api/getProjectsList");
                if (projectsResponse.ok) {
                    const data = await projectsResponse.json();
                    const formattedProjects = data.map((item: any) => ({
                        name: item.project_title,
                        faculty: item.faculty_name,
                    }));
                    setProjects(formattedProjects);
                }
            }
            else if (response.status === 409) {
                toast.error(responseData.message || 'Project with this title already exists!');
            }
            else if (response.status === 408) {
                toast.error(responseData.message || 'Your team has already created a project.');
            }
            else {
                toast.error('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while creating the project.');
        }
    };

    return (
        <AdminLayout heading="Create New Project">
            <div className="flex flex-col flex-1  p-10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            Create New Project
                        </h1>

                        <Tabs defaultValue="manual" className="space-y-6">
                            <TabsList className="justify-center w-full">
                                <TabsTrigger value="manual">
                                    Manual Entry
                                </TabsTrigger>
                                <TabsTrigger value="upload">
                                    Upload CSV
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="manual">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Project Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Enter project name"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="projectCode">
                                            Project Code
                                        </Label>
                                        <Input
                                            id="projectCode"
                                            value={formData.projectCode}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    projectCode: e.target.value,
                                                })
                                            }
                                            placeholder="Enter project code"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="faculty">Faculty</Label>
                                        {!showNewFacultyInput ? (
                                            <div className="flex gap-2">
                                                <Select
                                                    value={formData.faculty}
                                                    onValueChange={(value) =>
                                                        setFormData({
                                                            ...formData,
                                                            faculty: value,
                                                        })
                                                    }
                                                    required
                                                >
                                                    <SelectTrigger className="flex-1">
                                                        <SelectValue placeholder="Select faculty" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {uniqueFaculties.map((faculty) => (
                                                            <SelectItem
                                                                key={faculty}
                                                                value={faculty || "default"}
                                                            >
                                                                {faculty}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setShowNewFacultyInput(
                                                            true
                                                        )
                                                    }
                                                >
                                                    Add New Faculty
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Input
                                                    id="newFaculty"
                                                    value={formData.newFaculty}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            newFaculty:
                                                                e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter new faculty name"
                                                    className="flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={
                                                        handleAddNewFaculty
                                                    }
                                                >
                                                    Add
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowNewFacultyInput(
                                                            false
                                                        );
                                                        setFormData({
                                                            ...formData,
                                                            newFaculty: "",
                                                        });
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                        >
                                            {isLoading
                                                ? "Creating..."
                                                : "Create Project"}
                                        </Button>
                                    </div>
                                </form>
                            </TabsContent>

                            <TabsContent value="upload">
                                <form
                                    onSubmit={handleUploadSubmit}
                                    className="space-y-6"
                                >
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                    >
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer"
                                        >
                                            <div className="flex flex-col items-center">
                                                <Upload className="w-12 h-12 text-gray-400 mb-4" />

                                                {file ? (
                                                    <p className="mt-2 text-sm text-gray-500">
                                                        Selected file:{" "}
                                                        {file.name}
                                                    </p>
                                                ) : (
                                                    <>
                                                        <p className="mb-2 text-sm font-medium text-foreground">
                                                            Drag and drop your
                                                            CSV file here, or{" "}
                                                            <span className="font-semibold text-primary">
                                                                click to select
                                                            </span>
                                                            .
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mb-4">
                                                            Please make sure the
                                                            file is in the
                                                            following format.
                                                        </p>

                                                        {/* Format example using <pre> */}
                                                        <pre className="p-3 rounded-md bg-muted/50 text-left text-xs font-mono text-foreground/80 max-w-xs w-full sm:max-w-sm overflow-x-auto">
                                                            <code>
                                                                name,faculty
                                                                {"\n"}
                                                                project_name,faculty_name
                                                            </code>
                                                        </pre>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                router.push("/admin/dashboard")
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isLoading || !file}
                                        >
                                            {isLoading
                                                ? "Uploading..."
                                                : "Upload Projects"}
                                        </Button>
                                    </div>
                                </form>
                            </TabsContent>
                        </Tabs>

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-4">
                                Existing Projects
                            </h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Project Name</TableHead>
                                        <TableHead>Faculty</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.map((project) => (
                                        <TableRow>
                                            <TableCell>
                                                {project.name}
                                            </TableCell>
                                            <TableCell>
                                                {project.faculty}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
