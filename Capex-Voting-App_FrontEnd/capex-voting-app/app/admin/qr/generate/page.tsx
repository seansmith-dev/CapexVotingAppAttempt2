"use client";

import { useState } from "react";
import { generateQRCodeDataURL } from "@/app/utils/qrGenerator";
import { generateQRCodesPDF, QRCodeForPrint } from "@/app/utils/pdfGenerator";
import AdminLayout from "@/app/layouts/admin";
export default function GenerateQRPage() {
    const [industryCount, setIndustryCount] = useState<number>(0);
    const [guestCount, setGuestCount] = useState<number>(0);
    const [generatedCodes, setGeneratedCodes] = useState<QRCodeForPrint[]>([]);
    const [printIndustryCount, setPrintIndustryCount] = useState<number>(0);
    const [printGuestCount, setPrintGuestCount] = useState<number>(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPrintDialog, setShowPrintDialog] = useState(false);

    const generateQRCodes = async () => {
        setIsGenerating(true);
        const codes = [];
        // const codes: QRCodeForPrint[] = [];

        try {
            // Generate Industry QR codes
            for (let i = 0; i < industryCount; i++) {
                const voterId = `IND-${Date.now()}-${i}`;
                
                codes.push({
                    voterId,
                    voterType: "INDUSTRY",
                });
            }

            // Generate Guest QR codes
            for (let i = 0; i < guestCount; i++) {
                const voterId = `GST-${Date.now()}-${i}`;
            
                codes.push({
                    voterId,
                    voterType: "GUEST",
                });
            }

            // Store in API
            const response = await fetch("/api/generate-qr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ codes }),
              });
          
              const data = await response.json();
              if (data.success) {
                console.log(data);
                setGeneratedCodes(data);
                setShowPrintDialog(true);
                console.log(codes)
              } else {
                alert("Error generating QR codes");
              }
        } catch (error) {
            console.error("Error generating QR codes:", error);
            alert("Failed to generate QR codes");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = () => {
        if (printIndustryCount > 0 || printGuestCount > 0) {
            const industryQRs = generatedCodes.filter(
                (code) => code.voterType === "INDUSTRY"
            );
            const guestQRs = generatedCodes.filter(
                (code) => code.voterType === "GUEST"
            );

            const selectedIndustryQRs = industryQRs.slice(0,printIndustryCount);
            const selectedGuestQRs = guestQRs.slice(0, printGuestCount);
            const codesToPrint = [...selectedIndustryQRs, ...selectedGuestQRs];

            const doc = generateQRCodesPDF(codesToPrint);
            doc.save("qr-codes.pdf");

            // Update printed status in API
            fetch("/api/qrcodes/print", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ids: codesToPrint.map((code) => code.voterId),
                }),
            });
        }
        setShowPrintDialog(false);
        setPrintIndustryCount(0);
        setPrintGuestCount(0);
    };

    const generatedIndustryCount = generatedCodes.filter(
        (code) => code.voterType === "INDUSTRY"
    ).length;
    const generatedGuestCount = generatedCodes.filter(
        (code) => code.voterType === "GUEST"
    ).length;

    return (
        <AdminLayout heading="Generate QR Codes">
            <div className="bg-gray-100 p-8">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900">
                    Generate QR Codes
                </h1>

                {!showPrintDialog ? (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Industry QR Codes
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={industryCount}
                                onChange={(e) =>
                                    setIndustryCount(
                                        parseInt(e.target.value) || 0
                                    )
                                }
                                className="w-full p-2 border rounded text-gray-700"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Guest QR Codes
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={guestCount}
                                onChange={(e) =>
                                    setGuestCount(parseInt(e.target.value) || 0)
                                }
                                className="w-full p-2 border rounded text-gray-700"
                            />
                        </div>

                        <button
                            onClick={generateQRCodes}
                            disabled={
                                isGenerating ||
                                (industryCount === 0 && guestCount === 0)
                            }
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
                                    Number of Industry QR Codes to Print
                                    (Available: {generatedIndustryCount})
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max={generatedIndustryCount}
                                    value={printIndustryCount}
                                    onChange={(e) =>
                                        setPrintIndustryCount(
                                            Math.min(
                                                parseInt(e.target.value) || 0,
                                                generatedIndustryCount
                                            )
                                        )
                                    }
                                    className="w-full p-2 border rounded text-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Guest QR Codes to Print
                                    (Available: {generatedGuestCount})
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max={generatedGuestCount}
                                    value={printGuestCount}
                                    onChange={(e) =>
                                        setPrintGuestCount(
                                            Math.min(
                                                parseInt(e.target.value) || 0,
                                                generatedGuestCount
                                            )
                                        )
                                    }
                                    className="w-full p-2 border rounded text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={handlePrint}
                                disabled={
                                    printIndustryCount === 0 &&
                                    printGuestCount === 0
                                }
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
                            >
                                Print QR Codes
                            </button>

                            <button
                                onClick={() => {
                                    setShowPrintDialog(false);
                                    setPrintIndustryCount(0);
                                    setPrintGuestCount(0);
                                }}
                                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </AdminLayout>
    );
}