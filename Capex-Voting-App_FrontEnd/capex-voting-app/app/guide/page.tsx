"use client";

import RegularNavBar from "../components/RegularNavBar";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import "./guide.css";
import React from "react";
import { CheckCircle, Info, HelpCircle, ChevronDown, Search, UserCheck, Wifi, MapPin } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "motion/react";

export default function GuidePage() {
    const router = useRouter();

    // FAQ Categories
    const faqCategories = [
        { key: 'all', label: 'All', icon: <HelpCircle className="w-4 h-4 mr-1 text-purple-500" /> },
        { key: 'voting', label: 'Voting', icon: <UserCheck className="w-4 h-4 mr-1 text-emerald-500" /> },
        { key: 'technical', label: 'Technical', icon: <Wifi className="w-4 h-4 mr-1 text-amber-500" /> },
        { key: 'access', label: 'Access', icon: <MapPin className="w-4 h-4 mr-1 text-slate-500" /> },
    ];

    // FAQ Data with category
    const faqData = [
        {
            q: "Can I vote more than once?",
            a: "No. Each QR code allows only one vote and cannot be reused.",
            category: 'voting'
        },
        {
            q: "Can I vote from outside Swinburne Hawthorn campus?",
            a: "No. Voting is restricted to users physically located at the Swinburne Hawthorn campus.",
            category: 'access'
        },
        {
            q: "How do I know my vote was successful?",
            a: "You will receive a confirmation message once your vote has been submitted.",
            category: 'voting'
        },
        {
            q: "What should I do if my camera is not working?",
            a: (
                <ul className="list-decimal list-inside space-y-1 mt-2 text-slate-700">
                    <li>Check if camera permissions are granted in your browser settings</li>
                    <li>Close other applications using the camera</li>
                    <li>Refresh the page or restart the browser</li>
                </ul>
            ),
            category: 'technical'
        },
        {
            q: "Why is my QR code not scanning?",
            a: (
                <ul className="list-decimal list-inside space-y-1 mt-2 text-slate-700">
                    <li>Keep the QR code steady and within the frame</li>
                    <li>Clean the camera lens</li>
                    <li>Ensure good lighting and avoid screen glare</li>
                </ul>
            ),
            category: 'technical'
        },
        {
            q: "What if my location is not being detected?",
            a: (
                <ul className="list-decimal list-inside space-y-1 mt-2 text-slate-700">
                    <li>Enable device and browser location services</li>
                    <li>Allow location access when prompted</li>
                    <li>Reconnect to Wi-Fi or mobile data if needed</li>
                </ul>
            ),
            category: 'access'
        },
        {
            q: "What should I do if I'm unable to submit my vote?",
            a: (
                <ul className="list-decimal list-inside space-y-1 mt-2 text-slate-700">
                    <li>Ensure stable internet connectivity</li>
                    <li>Verify that the QR code hasn't been used before</li>
                    <li>Try refreshing the page or reloading the app</li>
                </ul>
            ),
            category: 'technical'
        },
        {
            q: "Why am I being redirected to the homepage repeatedly?",
            a: (
                <ul className="list-decimal list-inside space-y-1 mt-2 text-slate-700">
                    <li>Check that the QR code is valid and unused</li>
                    <li>Make sure you are on Swinburne Hawthorn campus</li>
                    <li>Clear browser cache and try again</li>
                </ul>
            ),
            category: 'access'
        },
        {
            q: "What should I do if my QR code doesn't work?",
            a: "Make sure the QR code hasn't already been used and follow the troubleshooting tips above.",
            category: 'technical'
        }
    ];

    // FAQ State
    const [faqSearch, setFaqSearch] = React.useState("");
    const [faqCategory, setFaqCategory] = React.useState("all");
    const [openIndexes, setOpenIndexes] = React.useState<number[]>([]);

    // Filtered FAQ
    const filteredFaq = faqData.filter(item => {
        const matchesCategory = faqCategory === 'all' || item.category === faqCategory;
        const matchesSearch = faqSearch.trim() === "" || item.q.toLowerCase().includes(faqSearch.toLowerCase()) || (typeof item.a === 'string' && item.a.toLowerCase().includes(faqSearch.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // Highlight search term
    function highlight(text: string, term: string) {
        if (!term) return text;
        const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
        return text.split(regex).map((part, i) =>
            regex.test(part) ? <span key={i} className="bg-amber-200 text-emerald-900 rounded px-1">{part}</span> : part
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-emerald-50">
            <RegularNavBar heading="Application Guide" />

            {/* Banner image and back button */}
            <div className="relative banner-container">
                <div className="banner-overlay"></div>
                <img
                    src="/background.png"
                    alt="Guide Banner"
                    className="w-full object-cover h-60 md:h-72"
                />
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 p-3 rounded-full z-10 text-white font-bold text-2xl hover:bg-white/20 transition-colors"
                >
                    ←
                </button>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <h2 className="banner-title drop-shadow-lg text-purple-800">Application Guide</h2>
                    <p className="banner-subtitle text-emerald-900">Your Complete Guide to the Capstone Project Expo Voting System</p>
                </div>
            </div>

            {/* Guide Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-10">
                    {/* Purpose Section */}
                    <section className="bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-xl p-8 flex items-start gap-6 border-t-4 border-amber-500">
                        <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
                            <Info className="text-amber-600 w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl md:text-3xl font-extrabold text-amber-900 mb-2">Purpose of the Application</h3>
                            <p className="text-slate-700 text-lg leading-relaxed">
                                The Capstone Project Expo Voting Application empowers attendees to securely and efficiently vote for their favorite student projects using unique QR codes. This ensures fair, authenticated, and real-time voting during the Capstone Expo at Swinburne University.
                            </p>
                        </div>
                    </section>

                    {/* How to Vote Section */}
                    <section className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-lg p-8 border-l-4 border-emerald-500">
                        <div className="flex items-center mb-4">
                            <CheckCircle className="text-emerald-500 w-7 h-7 mr-2" />
                            <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-900">How to Vote – Step-by-Step Guide</h3>
                        </div>
                        <ol className="space-y-5 list-decimal list-inside text-slate-800 text-lg">
                            <li>
                                <span className="font-semibold text-emerald-700">Start the Voting Process:</span> On the homepage, click the <span className="font-bold">"Vote Now"</span> button to begin.
                            </li>
                            <li>
                                <span className="font-semibold text-emerald-700">Scan Your QR Code:</span> Allow the browser to access your device's camera and position your QR code within the frame until detected.
                            </li>
                            <li>
                                <span className="font-semibold text-emerald-700">Select Your Voter Type:</span> Choose <span className="font-bold">Industry</span> if you are a professional/guest, or <span className="font-bold">Guest</span> if you are a general attendee/student.
                            </li>
                            <li>
                                <span className="font-semibold text-emerald-700">Search for a Project:</span> Use the search field to find projects by title or faculty, then select your project.
                            </li>
                            <li>
                                <span className="font-semibold text-emerald-700">Submit Your Vote:</span> Click <span className="font-bold">"Submit"</span> or <span className="font-bold">"Vote Now"</span> and confirm your selection. A success message will appear once your vote is recorded.
                            </li>
                        </ol>
                        <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg flex items-center">
                            <Info className="text-amber-500 w-6 h-6 mr-2" />
                            <span className="text-amber-900 font-medium">Note: To be able to vote you must be in Swinburne University's Hawthorn campus.</span>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-xl p-8 border-t-4 border-purple-400">
                        <div className="flex items-center mb-6">
                            <HelpCircle className="text-purple-400 w-7 h-7 mr-2" />
                            <h3 className="text-2xl md:text-3xl font-extrabold text-purple-900">Frequently Asked Questions</h3>
                        </div>
                        {/* FAQ Search & Category */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div className="relative w-full md:w-1/2">
                                <input
                                    type="text"
                                    value={faqSearch}
                                    onChange={e => setFaqSearch(e.target.value)}
                                    placeholder="Search questions..."
                                    className="w-full px-4 py-2 pl-10 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 shadow-sm"
                                />
                                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {faqCategories.map(cat => (
                                    <button
                                        key={cat.key}
                                        className={`flex items-center px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200 ${faqCategory === cat.key ? 'bg-purple-100 border-purple-500 text-purple-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                        onClick={() => setFaqCategory(cat.key)}
                                    >
                                        {cat.icon}{cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* FAQ Accordion */}
                        <div className="divide-y divide-purple-100 faq-container">
                            {filteredFaq.length === 0 && (
                                <div className="py-8 text-center text-slate-400 text-lg">No questions found.</div>
                            )}
                            {filteredFaq.map((item, idx) => (
                                <FAQAccordion
                                    key={idx}
                                    question={highlight(item.q, faqSearch)}
                                    answer={typeof item.a === 'string' ? highlight(item.a, faqSearch) : item.a}
                                    open={openIndexes.includes(idx)}
                                    onToggle={() => setOpenIndexes(openIndexes.includes(idx) ? openIndexes.filter(i => i !== idx) : [...openIndexes, idx])}
                                    icon={faqCategories.find(cat => cat.key === item.category)?.icon}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Important Notes Section */}
                    <section className="bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-lg p-8 border-l-4 border-red-500">
                        <div className="flex items-center mb-4">
                            <Info className="text-red-700 w-7 h-7 mr-2" />
                            <h3 className="text-2xl md:text-3xl font-extrabold text-red-900">Important Notes</h3>
                        </div>
                        <ul className="list-disc list-inside text-slate-800 text-lg space-y-2">
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

// FAQ Accordion Component
function FAQAccordion({ question, answer, open, onToggle, icon }: {
    question: React.ReactNode,
    answer: React.ReactNode,
    open: boolean,
    onToggle: () => void,
    icon?: React.ReactNode
}) {
    return (
        <div className={`faq-card${open ? ' open' : ''}`}>
            <button
                className={`faq-question-btn w-full flex items-center justify-between text-left focus:outline-none ${open ? 'text-purple-700' : 'text-purple-900'}`}
                onClick={onToggle}
                aria-expanded={open}
            >
                <span className="font-semibold text-lg flex items-center gap-2">
                    {icon}
                    {question}
                </span>
                <ChevronDown className={`w-5 h-5 ml-2 transform transition-transform duration-200 ${open ? 'rotate-180 text-purple-700' : 'text-purple-400'}`} />
            </button>
            <div className={`overflow-hidden transition-max-height duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="faq-answer">
                    {answer}
                </div>
            </div>
        </div>
    );
} 