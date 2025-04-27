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

const faculties = [
    "Science, Computing and Engineering Technologies",
    "Health, Arts and Design",
    "Business, Law and Entrepreneurship",
];

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
    const [formData, setFormData] = useState({
        name: "",
        faculty: "",
        newFaculty: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [projects, setProjects] = useState(mockProjects);
    const [showNewFacultyInput, setShowNewFacultyInput] = useState(false);

    // Build unique faculties list from projects
    const uniqueFaculties = Array.from(
        new Set(projects.map((project) => project.faculty))
    );

    const handleAddNewFaculty = () => {
        if (formData.newFaculty.trim()) {
            // Add the new faculty to the list
            const newProject = {
                id: String(projects.length + 1),
                name: formData.name,
                faculty: formData.newFaculty.trim(),
            };
            setProjects([...projects, newProject]);
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
            /*
            const adminToken = Cookies.get("admin-token");
            if (!adminToken) {
                toast.error("Admin session expired. Please login again.");
                router.push("/admin");
                return;
            }

            const response = await fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to create project");
            }
            */

            // Add new project to the list
            const newProject = {
                name: formData.name,
                faculty: formData.faculty,
            };
            setProjects([...projects, newProject]);

            toast.success("Project created successfully!");
            // Clear form
            setFormData({ name: "", faculty: "", newFaculty: "" });
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
            // Commented out actual API call
            /*
            const adminToken = Cookies.get("admin-token");
            if (!adminToken) {
                toast.error("Admin session expired. Please login again.");
                router.push("/admin");
                return;
            }
            */

            Papa.parse(file, {
                fastMode: true,
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    // Validate headers
                    const headers = results.meta.fields;
                    if (
                        !headers ||
                        !headers.includes("name") ||
                        !headers.includes("faculty")
                    ) {
                        toast.error(
                            "CSV file must have headers 'name' and 'faculty'"
                        );
                        setIsLoading(false);
                        return;
                    }

                    const newProjects = results.data.map((row: any) => ({
                        name: row["name"],
                        faculty: row["faculty"],
                    }));

                    // Add new projects to the list
                    setProjects([...projects, ...newProjects]);

                    // const response = await fetch("/api/projects/upload", {
                    //     method: "POST",
                    //     headers: {
                    //         Authorization: `Bearer ${adminToken}`,
                    //     },
                    //     body: formData,
                    // });

                    // if (!response.ok) {
                    //     throw new Error("Failed to upload projects");
                    // }

                    // Add new projects to the list
                    setProjects([...projects, ...newProjects]);
                    // Add any new faculties to the unique faculties list
                    const newFaculties = new Set(
                        newProjects.map((project) => project.faculty)
                    );
                    const currentFaculties = new Set(
                        projects.map((project) => project.faculty)
                    );

                    toast.success("Projects uploaded successfully!");
                    setFile(null);
                },
                error: (error) => {
                    console.error("Error parsing CSV:", error);
                    toast.error(
                        "Failed to parse CSV file. Please check the format."
                    );
                },
            });
        } catch (error) {
            console.error("Error uploading projects:", error);
            toast.error("Failed to upload projects. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const projectData = {
            project_title: formData.name,
            faculty_name: formData.faculty,
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


            const responseData = await response.json(); // Extract JSON data

            if (response.status === 201) {
                alert('Project created successfully!');
                console.log("201 response status executed");
            }
            else if (response.status === 409) {
                console.log("The alert executed");
                alert(responseData.message || 'Project with this title already exists!');
            }
            else if (response.status === 408) {
                console.log("The response 408 executed");
                alert(responseData.message || 'Your team has already created a project.');
            }
            else {
                console.log("The alert executed");
                alert('Something went wrong.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
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
                                                        {uniqueFaculties.map(
                                                            (faculty) => (
                                                                <SelectItem
                                                                    key={
                                                                        faculty
                                                                    }
                                                                    value={
                                                                        faculty
                                                                    }
                                                                >
                                                                    {faculty}
                                                                </SelectItem>
                                                            )
                                                        )}
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
