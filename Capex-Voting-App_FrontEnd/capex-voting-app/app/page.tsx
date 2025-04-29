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
            router.push(`/vote?token=${token}`);
        }
    }, [router]);

    const handleVoteClick = async () => {
        try {
            if ("geolocation" in navigator) {
                /* geolocation is available */
                console.log("Geolocation is available");
            } else {
                /* geolocation IS NOT available */
                console.log("Geolocation is not available");
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("Getting current position");
                    const { latitude, longitude } = position.coords;
                    console.log(
                        `Latitude: ${latitude}, Longitude: ${longitude}`
                    );

                    alert("Latitude: " + latitude + " Longitude: " + longitude);
                    // const response = await fetch("/api/check-location", {
                    //     method: "POST",
                    //     body: JSON.stringify({ latitude, longitude }),
                    // });

                    // const data = await response.json();
                    const data = {
                        allowed: true,
                    };
                    console.log(data);

                    if (data.allowed) {
                        console.log("Showing scanner, " + showScanner);
                        setShowScanner(true);
                    } else {
                        alert(
                            "You are not on campus. Please go to the Swinburne Hawthorn Campus to vote."
                        );
                    }
                },
                (error) => {
                    // Error Callback
                    console.error(
                        `Geolocation error: ${error.message} (Code: ${error.code})`,
                        error
                    );
                    let message = "Unable to retrieve your location.";
                    switch (error.code) {
                        case error.PERMISSION_DENIED: // 1
                            message =
                                "Location permission denied by user. Please enable location access for this site in your browser settings.";
                            break;
                        case error.POSITION_UNAVAILABLE: // 2
                            message =
                                "Location information is unavailable. Check network or GPS settings.";
                            break;
                        case error.TIMEOUT: // 3
                            message =
                                "The request to get user location timed out. Please try again.";
                            break;
                        default:
                            message = `An unknown error occurred (Code: ${error.code}).`;
                            break;
                    }
                    alert(`Geolocation Error: ${message}`);
                },
                {
                    // Geolocation Options
                    enableHighAccuracy: true, // Request higher accuracy
                    timeout: 15000, // 15 seconds timeout
                    maximumAge: 0, // Don't use cached location
                }
            );
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert(
                "Unable to access camera. Please make sure you have granted camera permissions."
            );
        }
    };

    const handleScanSuccess = (decodedText: string) => {
        setShowScanner(false);
        router.push(`${encodeURIComponent(decodedText)}`);
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
