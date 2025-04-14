"use client";

import RegularNavBar from "../components/RegularNavBar";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";


export default function ProjectsListPage() {
    const router = useRouter();

    const projectNames = [
        "Capex Voting App",
        "Smart Device",
        "Solar Powered Battery",
        "Ted",
        "HydroFlow",
        "GreenBridge",
        "BrandPulse",
        "StartupSprint"
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <RegularNavBar heading="Capstone Project Expo 2024" />

            {/* Banner image and back button */}
            <div className="relative">
                <img
                    src="/background.png" // Replace with actual banner path
                    alt="Expo Banner"
                    className="w-full object-cover h-40 md:h-52"
                />
                <button
                    onClick={() => router.back()}
                    className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-md"
                >
                    <span className="text-xl">←</span>
                </button>
                <h2 className="absolute bottom-2 left-4 text-xl font-bold text-white bg-black/50 px-4 py-1 rounded-lg">
                    Projects List
                </h2>
            </div>

            {/* Project List */}
            <main className="flex flex-col items-center gap-4 p-4">
                {projectNames.map((project, index) => (
                    <div
                        key={index}
                        className="w-full max-w-sm bg-zinc-100 rounded-xl flex justify-between items-center px-4 py-2 shadow"
                    >
                        <span className="text-sm font-medium">{project}</span>
                        <div className="flex gap-2">
                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs">
                                Edit
                            </button>
                            <button className="text-black hover:text-red-600">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </main>

            <Footer />
        </div>
    );
}
