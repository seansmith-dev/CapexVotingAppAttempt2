"use client";

import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import AdminLayout from "@/app/layouts/admin";
import { generateQRCodesPDF, QRCodeForPrint } from "@/app/utils/pdfGenerator";
import { generateQRCodeDataURL, QRCodeData } from "@/app/utils/qrGenerator";

export default function GenerateQRPage() {
    const [qrCount, setQrCount] = useState<number>(0);
    const [generatedCodes, setGeneratedCodes] = useState<QRCodeForPrint[]>([]);
    const [printCount, setPrintCount] = useState<number>(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPrintDialog, setShowPrintDialog] = useState(false);
    const [totalGenerated, setTotalGenerated] = useState<number>(0);
    const fetchTotalGenerated = async () => {
            try {
                const response = await fetch("/api/qrcodes/count");
                const data = await response.json();
                setTotalGenerated(data.count);
            } catch (error) {
                console.error("Error fetching QR code count:", error);
            }
        };

    useEffect(() => {
        // Fetch total number of generated QR codes
        // TODO: Uncomment this once the API is implemented
        // fetchTotalGenerated();

        // TODO: Remove this once the API is implemented
        setTotalGenerated(10);
    }, []);

    const generateQRCodes = async () => {
        setIsGenerating(true);
        const codes: QRCodeForPrint[] = [];

        try {
            for (let i = 0; i < qrCount; i++) {
                const token = nanoid();
                const dataUrl = await generateQRCodeDataURL({
                    voterId: token,
                });
                codes.push({
                    voterId: token,
                    dataUrl,
                });
            }

            // TODO: Uncomment this once the API is implemented
            // Store in API
            // await fetch("/api/qrcodes", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(codes),
            // });

            setGeneratedCodes(codes);
            setShowPrintDialog(true);
            setTotalGenerated(prev => prev + qrCount);
        } catch (error) {
            console.error("Error generating QR codes:", error);
            alert("Failed to generate QR codes");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = () => {
        if (printCount > 0) {
            const codesToPrint = generatedCodes.slice(0, printCount);
            const doc = generateQRCodesPDF(codesToPrint);
            doc.save("qr-codes.pdf");

            // Update printed status in API
            // TODO: Uncomment this once the API is implemented
            // fetch("/api/qrcodes/print", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({
            //         tokens: codesToPrint,
            //     }),
            // });
        }
        setShowPrintDialog(false);
        setPrintCount(0);
    };

    return (
        <AdminLayout heading="Generate QR Codes">
            <div className="p-8">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Total Generated QR Codes Card */}
                    <div className="text-center bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">
                            Total Unique QR Codes Generated
                        </h2>
                        <div className="text-center text-6xl font-bold text-blue-600">
                            {totalGenerated}
                        </div>
                    </div>

                    {/* Generate QR Codes Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h1 className="text-center text-2xl font-bold mb-6 text-gray-900">
                            Generate QR Codes
                        </h1>

                        {!showPrintDialog ? (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Number of QR Codes to Generate
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={qrCount}
                                        onChange={(e) =>
                                            setQrCount(
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                        className="w-full p-2 border rounded text-gray-700"
                                    />
                                </div>

                                <button
                                    onClick={generateQRCodes}
                                    disabled={isGenerating || qrCount === 0}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
                                >
                                    {isGenerating
                                        ? "Generating..."
                                        : "Generate QR Codes"}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Print Generated QR Codes
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Number of QR Codes to Print
                                            (Available: {generatedCodes.length})
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max={generatedCodes.length}
                                            value={printCount}
                                            onChange={(e) =>
                                                setPrintCount(
                                                    Math.min(
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0,
                                                        generatedCodes.length
                                                    )
                                                )
                                            }
                                            className="w-full p-2 border rounded text-gray-700"
                                        />
                                    </div>

                                    <button
                                        onClick={handlePrint}
                                        disabled={printCount === 0}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
                                    >
                                        Print QR Codes
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
