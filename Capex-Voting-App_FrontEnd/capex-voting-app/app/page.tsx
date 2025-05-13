"use client";

import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRScanner from "./components/QRScanner";
import RegularNavBar from "./components/RegularNavBar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export default function Home() {
    const router = useRouter();
    const [showScanner, setShowScanner] = useState(false);
    
    useEffect(() => {
        // Check for 'token' in the URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            // Redirect directly to the /vote page with the token
            window.location.href = `/vote?token=${token}`;
        }
    }, [router]);

    const handleVoteClick = async () => {
        try {
            setShowScanner(true);
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert(
                "Unable to access camera. Please make sure you have granted camera permissions."
            );
        }
    };

    const handleScanSuccess = (decodedText: string) => {
        setShowScanner(false);
        console.log("this is the decoded text:", decodedText);
    
        // Strip the base URL from the decodedText to get just the path and query string
        const baseUrl = window.location.origin;  // e.g., 'https://capex-voting-app-attempt2.vercel.app'
        const strippedUrl = decodedText.replace(baseUrl, '');  // Remove the base URL from the decoded text
    
        console.log("Stripped URL (path + query):", strippedUrl);
        
        // Now you can use strippedUrl for the redirection
        window.location.href = strippedUrl; // Reconstruct full URL and redirect
    };
    

    const handleScanError = (error: any) => {
        console.error("QR Code scan error:", error);
    };

    return (
        <>
            <AuroraBackground>
                <motion.div
                    initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="bg-purple-800/20 min-h-screen min-w-screen relative flex flex-col"
                >
                    {/* Navbar */}
                    <RegularNavBar
                        heading="Capstone Project Expo 2024"
                        transparent={true}
                    />

                    <div className="text-center space-y-20 p-16 flex-1 flex flex-col justify-center items-center md:w-7/10 lg:w-7/10 m-auto">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-700">
                            Welcome to Swinburne Capstone Project Expo 2025
                        </h1>
                        <p className="text-xl md:text-2xl lg:text-3xl text-gray-600">
                            Here you can vote for your favourite project in the
                            expo. Your vote matters in recognizing outstanding
                            innovation and creativity.
                        </p>
                        <Button
                            onClick={handleVoteClick}
                            className="relative group overflow-hidden px-8 py-8 font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-700 text-white hover:from-blue-700 hover:to-purple-900 transition-all duration-300 shadow-lg text-xl md:text-2xl lg:text-3xl"
                        >
                            <span className="relative z-10">Vote Now</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Button>
                    </div>

                    {showScanner && (
                        <QRScanner
                            onScanSuccess={handleScanSuccess}
                            onScanError={handleScanError}
                            onClose={() => setShowScanner(false)}
                        />
                    )}
                </motion.div>
            </AuroraBackground>

            <Footer />
        </>
    );
}
