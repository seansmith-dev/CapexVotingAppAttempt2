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
                    {/* Purpose Section */}
                    <section className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Purpose of the Application</h3>
                        <p className="text-gray-600">
                            The Capstone Project Expo Voting Application enables attendees to vote for their favorite student projects securely and efficiently using unique QR codes. This system ensures fair and authenticated voting during the Capstone Expo held at Swinburne University.
                        </p>
                    </section>

                    {/* How to Vote Section */}
                    <section className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">How to Vote – Step-by-Step Guide</h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xl font-semibold text-blue-600 mb-2">1. Access the Application</h4>
                                <p className="text-gray-600">
                                    Visit the voting website link shared by Swinburne staff or found on the event signage.
                                    (e.g., https://capstoneexpo.swinburne.edu.au/vote)
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xl font-semibold text-blue-600 mb-2">2. Start the Voting Process</h4>
                                <p className="text-gray-600">
                                    On the homepage, click the "Vote Now" button to begin.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xl font-semibold text-blue-600 mb-2">3. Scan Your QR Code</h4>
                                <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
                                    <li>When prompted, allow the browser to access your device's camera</li>
                                    <li>Position your QR code within the camera frame until it is detected</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-xl font-semibold text-blue-600 mb-2">4. Select Your Voter Type</h4>
                                <p className="text-gray-600">Select either:</p>
                                <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
                                    <li>Industry if you are a professional or invited guest</li>
                                    <li>Guest if you are a general attendee or student</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-xl font-semibold text-blue-600 mb-2">5. Search for a Project</h4>
                                <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
                                    <li>Use the search field to find projects by title or faculty</li>
                                    <li>Select the project you wish to vote for</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-xl font-semibold text-blue-600 mb-2">6. Submit Your Vote</h4>
                                <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
                                    <li>Click "Submit" or "Vote Now"</li>
                                    <li>Confirm your selection in the pop-up dialog box</li>
                                    <li>A success message will appear once your vote is recorded</li>
                                </ul>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <p className="text-yellow-800 font-medium">
                                    Note: To be able to vote you must be in Swinburne University's Hawthorn campus.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Common Issues Section */}
                    <section className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Common Issues and How to Resolve Them</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-lg font-semibold text-blue-600">1. Camera not working</h4>
                                <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
                                    <li>Check if camera permissions are granted in your browser settings</li>
                                    <li>Close other applications using the camera</li>
                                    <li>Refresh the page or restart the browser</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-blue-600">2. QR code not scanning</h4>
                                <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
                                    <li>Keep the QR code steady and within the frame</li>
                                    <li>Clean the camera lens</li>
                                    <li>Ensure good lighting and avoid screen glare</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-blue-600">3. Location not detected</h4>
                                <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
                                    <li>Enable device and browser location services</li>
                                    <li>Allow location access when prompted</li>
                                    <li>Reconnect to Wi-Fi or mobile data if needed</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-blue-600">4. Unable to submit vote</h4>
                                <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
                                    <li>Ensure stable internet connectivity</li>
                                    <li>Verify that the QR code hasn't been used before</li>
                                    <li>Try refreshing the page or reloading the app</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-blue-600">5. Redirected to homepage repeatedly</h4>
                                <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
                                    <li>Check that the QR code is valid and unused</li>
                                    <li>Make sure you are on Swinburne Hawthorn campus</li>
                                    <li>Clear browser cache and try again</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions (FAQs)</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-lg font-semibold text-blue-600">Can I vote more than once?</h4>
                                <p className="text-gray-600">No. Each QR code allows only one vote and cannot be reused.</p>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-blue-600">Can I vote from outside Swinburne Hawthorn campus?</h4>
                                <p className="text-gray-600">No. Voting is restricted to users physically located at the Swinburne Hawthorn campus.</p>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-blue-600">How do I know my vote was successful?</h4>
                                <p className="text-gray-600">You will receive a confirmation message once your vote has been submitted.</p>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-blue-600">What should I do if my QR code doesn't work?</h4>
                                <p className="text-gray-600">Make sure the QR code hasn't already been used and follow the troubleshooting tips above.</p>
                            </div>
                        </div>
                    </section>

                    {/* Important Notes Section */}
                    <section className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Important Notes</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Keep your QR code confidential. Sharing your code may result in invalid votes.</li>
                            <li>Ensure your device is charged, has internet access, and supports camera use before arriving at the event.</li>
                        </ul>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
} 