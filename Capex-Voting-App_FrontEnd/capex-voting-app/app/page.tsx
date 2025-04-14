"use client";

import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRScanner from "./components/QRScanner";
import RegularNavBar from "./components/RegularNavBar";

export default function Home() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });
    const [showScanner, setShowScanner] = useState(false);

    

    useEffect(() => {
        const fetchRemainingTime = async () => {
            try {
                // const response = await fetch('/api/remaining-time');
                // const data = await response.json();

                //for testing we explicitly set this
                const data = {
                    hours: 4,
                    minutes: 28,
                };
                setTimeLeft({ hours: data.hours, minutes: data.minutes });
            } catch (error) {
                console.error("Error fetching remaining time:", error);
            }
        };

        fetchRemainingTime();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.minutes === 0) {
                    return { hours: prev.hours - 1, minutes: 59 };
                }
                return {hours:prev.hours, minutes: prev.minutes - 1 };
            });
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

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
        router.push(`/projects?data=${encodeURIComponent(decodedText)}`);
    };

    const handleScanError = (error: any) => {
        console.error("QR Code scan error:", error);
    };

    return (
        <div className="min-h-screen max-w-screen relative flex flex-col">
            {/* Navbar */}
            <RegularNavBar heading="Capstone Project Expo 2024"/>

            <div className="relative z-10 flex flex-col items-center justify-center p-4 mx-auto bg-[url('/background.png')] bg-cover bg-center bg-blur-md">
                {/* <div className="fixed inset-0 bg-gray-900">
                    <Image
                        src="/background.png"
                        alt="Background"
                        fill
                        className="object-cover blur-sm opacity-50"
                        priority
                    />
                </div> */}
                <div className="fixed h-full w-full backdrop-blur-sm rounded-2xl p-6 "></div>
                <div className="z-10 bg-red-500 rounded-2xl p-6">
                    <h1 className="text-xl md:text-2xl font-bold text-white text-center">
                        Welcome to the Swinburne Capstone Project Expo 2024!
                    </h1>
                </div>
                <div className="text-black bg-white/80 backdrop-blur-sm rounded-2xl p-6 mt-4 space-y-4 text-sm md:text-base">
                    <p>
                        We are thrilled to present this year's innovative
                        projects, showcasing the remarkable talents of our
                        final-year students across various disciplines. This
                        expo serves as a platform where creativity meets
                        real-world application, highlighting the solutions and
                        ideas that aim to shape the future of technology,
                        engineering, and beyond.
                    </p>
                    <p>
                        Explore groundbreaking projects that reflect our
                        commitment to excellence in education, research, and
                        industry collaboration. Each project represents the
                        culmination of years of learning, problem-solving, and
                        dedication, offering a glimpse into the possibilities
                        that lie ahead.
                    </p>
                    <p>
                        We invite you to interact with these projects, engage
                        with our talented students, and be inspired by the next
                        generation of leaders and innovators.
                    </p>
                </div>
            </div>

            {/* Voting Card */}
            <main className="bg-white relative z-10 flex-grow flex flex-col items-center justify-center p-8">
                <div className="bg-zinc-800 rounded-3xl shadow-lg p-8 max-w-md w-full">
                    <div className="bg-black rounded-full py-2 px-6 flex items-center justify-center mb-6">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 text-red-500 mr-4"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-red-500 flex items-center gap-2 text-sm md:text-base text-center">
                            Voting Time Ends in: <br className="md:hidden" />
                            {timeLeft.hours}hrs {timeLeft.minutes} mins
                        </span>
                    </div>

                    <div className="bg-gray-200 text-center py-3 mb-6">
                        <p className="text-black text-sm md:text-base">
                            Click "Vote Now" to see Project list
                        </p>
                    </div>

                    <button
                        onClick={handleVoteClick}
                        className="w-full bg-red-500 text-white text-lg md:text-xl font-semibold py-3 md:py-4 px-6 md:px-8 rounded-2xl hover:bg-red-600 transition-colors"
                    >
                        VOTE NOW
                    </button>
                </div>
            </main>

            <Footer />

            {showScanner && (
                <QRScanner
                    onScanSuccess={handleScanSuccess}
                    onScanError={handleScanError}
                    onClose={() => setShowScanner(false)}
                />
            )}
        </div>
    );
}
