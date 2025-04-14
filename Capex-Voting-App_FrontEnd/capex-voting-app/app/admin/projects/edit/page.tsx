"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Search } from "lucide-react";
import AdminLayout from "@/app/layouts/admin";
import { Label } from "@/components/ui/label";

interface Project {
    id: string;
    name: string;
    faculty: string;
}

// Mock data for projects
const mockProjects: Project[] = [
    {
        id: "1",
        name: "Smart Campus Navigation System",
        faculty: "Faculty of Engineering",
    },
    {
        id: "2",
        name: "AI-Powered Student Assistant",
        faculty: "Faculty of Computer Science",
    },
    {
        id: "3",
        name: "Sustainable Energy Solutions",
        faculty: "Faculty of Engineering",
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

export default function EditProjects() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [editForm, setEditForm] = useState({
        name: "",
        faculty: "",
    });
    useEffect(() => {
        // Commented out actual fetch call
        // fetchProjects();

        // Using mock data instead
        setProjects(mockProjects);
        setIsLoading(false);
    }, []);

    // Commented out actual fetch function
    /*
    const fetchProjects = async () => {
        try {
            const adminToken = Cookies.get("admin-token");
            if (!adminToken) {
                toast.error("Admin session expired. Please login again.");
                router.push("/admin");
                return;
            }

            const response = await fetch("/api/projects", {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch projects");
            }

            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to fetch projects. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    */

    const handleSave = (projectId: string) => {
        // Commented out actual update function
        /*
        try {
            const adminToken = Cookies.get("admin-token");
            if (!adminToken) {
                toast.error("Admin session expired. Please login again.");
                router.push("/admin");
                return;
            }

            const response = await fetch(`/api/projects/${editingProject.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify(editForm),
            });

            if (!response.ok) {
                throw new Error("Failed to update project");
            }

            toast.success("Project updated successfully!");
            fetchProjects();
        } catch (error) {
            console.error("Error updating project:", error);
            toast.error("Failed to update project. Please try again.");
        }
        */

        // Mock update functionality
        setProjects(
            projects.map((project) =>
                project.id === projectId
                    ? { ...project, ...editForm }
                    : project
            )
        );
        toast.success("Project updated successfully!");
    };

    const handleDelete = async (projectId: string) => {
        // Commented out actual delete function
        /*
        try {
            const adminToken = Cookies.get("admin-token");
            if (!adminToken) {
                toast.error("Admin session expired. Please login again.");
                router.push("/admin");
                return;
            }

            const response = await fetch(`/api/projects/${projectId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete project");
            }

            toast.success("Project deleted successfully!");
            fetchProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
            toast.error("Failed to delete project. Please try again.");
        }
        */

        // Mock delete functionality
        setProjects(projects.filter((project) => project.id !== projectId));
        toast.success("Project deleted successfully!");
    };

    const filteredProjects = projects.filter(
        (project) =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.faculty.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout heading="Edit Projects">
            <div className="flex-1 flex flex-col justify-center bg-gray-100 p-8">
                <div className="max-w-6xl m-auto">
                    <div className="bg-white rounded-lg shadow p-6 min-w-[60vw]">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Edit Projects
                            </h1>
                            <Button
                                onClick={() =>
                                    router.push("/admin/projects/create")
                                }
                            >
                                Create New Project
                            </Button>
                        </div>

                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search projects or faculty..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-8">Loading...</div>
                        ) : filteredProjects.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No projects found matching the filters.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Project Name</TableHead>
                                        <TableHead>Faculty</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProjects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell>
                                                {project.name}
                                            </TableCell>
                                            <TableCell>
                                                {project.faculty}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => {
                                                                    setEditForm({
                                                                        name: project.name,
                                                                        faculty: project.faculty,
                                                                    });
                                                                }}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>
                                                                    Edit Project
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    Edit the
                                                                    project
                                                                    details
                                                                    here.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="grid gap-4 py-4">
                                                                <div className="grid gap-2">
                                                                    <Label
                                                                        htmlFor="name"
                                                                        className="text-right"
                                                                    >
                                                                        Project
                                                                        Name
                                                                    </Label>
                                                                    <Input
                                                                        id="project-name"
                                                                        value={
                                                                            editForm.name
                                                                        }
                                                                        onChange={(e)=>{setEditForm({...editForm, name: e.target.value})}}
                                                                    />
                                                                </div>
                                                                <div className="grid gap-2">
                                                                    <Label htmlFor="faculty">
                                                                        Faculty
                                                                    </Label>
                                                                    <Input
                                                                        id="faculty"
                                                                        value={
                                                                            editForm.faculty
                                                                        }
                                                                        onChange={(e)=>{setEditForm({...editForm, faculty: e.target.value})}}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <DialogFooter className="flex justify-end space-x-2">
                                                                <DialogClose
                                                                    asChild
                                                                >
                                                                    <Button variant="outline">
                                                                        Cancel
                                                                    </Button>
                                                                </DialogClose>

                                                                <Button
                                                                    onClick = {() => handleSave(project.id)}
                                                                >
                                                                    Save Changes
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Are you
                                                                    sure?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action
                                                                    cannot be
                                                                    undone. This
                                                                    will
                                                                    permanently
                                                                    delete the
                                                                    project from
                                                                    our
                                                                    database.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            project.id
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
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
