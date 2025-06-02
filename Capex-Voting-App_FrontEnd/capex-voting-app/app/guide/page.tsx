"use client";

import RegularNavBar from "../components/RegularNavBar";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import "./guide.css";

export default function GuidePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <RegularNavBar heading="Application Guide" />

            {/* Banner image and back button */}
            <div className="relative">
                <img
                    src="/background.png"
                    alt="Guide Banner"
                    className="w-full object-cover h-40 md:h-52"
                />
                <button
                    onClick={() => router.back()}
                    className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-md"
                >
                    <span className="text-xl">←</span>
                </button>
                <h2 className="absolute bottom-2 left-4 text-xl font-bold text-white bg-black/50 px-4 py-1 rounded-lg">
                    Application Guide
                </h2>
            </div>

            {/* Guide Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <section className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">How to Use This Application</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xl font-semibold text-blue-600 mb-2">1. Voting Process</h4>
                                <p className="text-gray-600">
                                    To vote for your favorite project:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
                                    <li>Navigate to the Projects List page</li>
                                    <li>Browse through the available projects</li>
                                    <li>Click on a project to view its details</li>
                                    <li>Use the voting interface to cast your vote</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-xl font-semibold text-blue-600 mb-2">2. QR Code Scanning</h4>
                                <p className="text-gray-600">
                                    For quick access to project information:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
                                    <li>Use the QR code scanner on the home page</li>
                                    <li>Point your camera at the project's QR code</li>
                                    <li>You'll be automatically directed to the project page</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-xl font-semibold text-blue-600 mb-2">3. Navigation Assistant</h4>
                                <p className="text-gray-600">
                                    To find your way around the expo:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
                                    <li>Access the Navigation Assistant from the menu</li>
                                    <li>Enter your current location</li>
                                    <li>Select your destination</li>
                                    <li>Follow the provided directions</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Tips for Best Experience</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Ensure you have a stable internet connection</li>
                            <li>Allow camera access for QR code scanning</li>
                            <li>Keep your device charged during the expo</li>
                            <li>Use the navigation assistant for efficient movement</li>
                        </ul>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
} 