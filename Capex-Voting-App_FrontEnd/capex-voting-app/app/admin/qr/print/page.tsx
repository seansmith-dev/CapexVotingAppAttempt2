"use client";

import { useState, useEffect } from "react";
import { generateQRCodesPDF, QRCodeForPrint } from "@/app/utils/pdfGenerator";

export default function PrintQRPage() {
    const [qrCodes, setQrCodes] = useState<QRCodeForPrint[]>([]);
    const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPrintDialog, setShowPrintDialog] = useState(false);
    const [industryCount, setIndustryCount] = useState(0);
    const [guestCount, setGuestCount] = useState(0);
    const [printMode, setPrintMode] = useState<"selected" | "all" | null>(null);

    useEffect(() => {
        fetchUnprintedCodes();
    }, []);

    const fetchUnprintedCodes = async () => {
        try {
            const response = await fetch("/api/qrcodes/unprinted");
            const data = await response.json();
            setQrCodes(data);
        } catch (error) {
            console.error("Error fetching QR codes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrintWithCounts = () => {
        const industryQRs = qrCodes.filter(
            (code) => code.voterType === "INDUSTRY"
        );
        const guestQRs = qrCodes.filter((code) => code.voterType === "GUEST");

        const selectedIndustryQRs = industryQRs.slice(0, industryCount);
        const selectedGuestQRs = guestQRs.slice(0, guestCount);
        const codesToPrint = [...selectedIndustryQRs, ...selectedGuestQRs];

        if (codesToPrint.length === 0) {
            alert("Please select at least one QR code to print");
            return;
        }

        const doc = generateQRCodesPDF(codesToPrint);
        doc.save("qr-codes.pdf");

        // Update printed status
        fetch("/api/qrcodes/print", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: codesToPrint.map((code) => code.id) }),
        }).then(() => {
            fetchUnprintedCodes();
            setSelectedCodes([]);
            setShowPrintDialog(false);
            setIndustryCount(0);
            setGuestCount(0);
            setPrintMode(null);
        });
    };

    const openPrintDialog = (mode: "selected" | "all") => {
        setPrintMode(mode);
        setShowPrintDialog(true);
    };

    const handlePrintSelected = () => {
        openPrintDialog("selected");
    };

    const handlePrintAll = () => {
        openPrintDialog("all");
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-100 p-8">Loading...</div>;
    }

    const availableIndustryCount = qrCodes.filter(
        (code) => code.voterType === "INDUSTRY"
    ).length;
    const availableGuestCount = qrCodes.filter(
        (code) => code.voterType === "GUEST"
    ).length;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
                {showPrintDialog ? (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold">
                            Select QR Codes to Print
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Industry QR Codes (Available:{" "}
                                    {availableIndustryCount})
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max={availableIndustryCount}
                                    value={industryCount}
                                    onChange={(e) =>
                                        setIndustryCount(
                                            Math.min(
                                                parseInt(e.target.value) || 0,
                                                availableIndustryCount
                                            )
                                        )
                                    }
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Guest QR Codes (Available:{" "}
                                    {availableGuestCount})
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max={availableGuestCount}
                                    value={guestCount}
                                    onChange={(e) =>
                                        setGuestCount(
                                            Math.min(
                                                parseInt(e.target.value) || 0,
                                                availableGuestCount
                                            )
                                        )
                                    }
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={handlePrintWithCounts}
                                disabled={
                                    industryCount === 0 && guestCount === 0
                                }
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
                            >
                                Print QR Codes
                            </button>

                            <button
                                onClick={() => {
                                    setShowPrintDialog(false);
                                    setIndustryCount(0);
                                    setGuestCount(0);
                                    setPrintMode(null);
                                }}
                                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">
                                Print QR Codes
                            </h1>
                            <div className="space-x-4">
                                <button
                                    onClick={handlePrintSelected}
                                    disabled={selectedCodes.length === 0}
                                    className="bg-blue-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
                                >
                                    Print Selected ({selectedCodes.length})
                                </button>
                                <button
                                    onClick={handlePrintAll}
                                    disabled={qrCodes.length === 0}
                                    className="bg-green-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
                                >
                                    Print All ({qrCodes.length})
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {qrCodes.map((code) => (
                                <div
                                    key={code.id}
                                    className="flex items-center p-4 border rounded"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCodes.includes(
                                            code.id
                                        )}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedCodes([
                                                    ...selectedCodes,
                                                    code.id,
                                                ]);
                                            } else {
                                                setSelectedCodes(
                                                    selectedCodes.filter(
                                                        (id) => id !== code.id
                                                    )
                                                );
                                            }
                                        }}
                                        className="mr-4"
                                    />
                                    <div>
                                        <p className="font-medium">
                                            {code.voterType}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {code.voterId}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
