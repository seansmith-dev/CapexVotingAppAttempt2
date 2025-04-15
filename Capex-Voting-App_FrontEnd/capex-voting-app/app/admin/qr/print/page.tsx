"use client";

import { useEffect, useState } from "react";
import { generateQRCodesPDF, QRCodeForPrint } from "@/app/utils/pdfGenerator";
import QRCode from "qrcode";
import AdminLayout from "@/app/layouts/admin";
import { Printer } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Mock QR codes
const mockQRCodes: QRCodeForPrint[] = [
    { voterId: "6xKCDFvY8ek2QvUdKqq0a", dataUrl: "6xKCDFvY8ek2QvUdKqq0a" },
    { voterId: "7yLDEGwZ9fl3RxVeLrr1b", dataUrl: "7yLDEGwZ9fl3RxVeLrr1b" },
    { voterId: "8zMEFHx0ag4SyWfMss2c", dataUrl: "8zMEFHx0ag4SyWfMss2c" },
    { voterId: "9aNFGIy1bh5TzXgNtt3d", dataUrl: "9aNFGIy1bh5TzXgNtt3d" },
    { voterId: "0bOGHJz2ci6UaYhOuu4e", dataUrl: "0bOGHJz2ci6UaYhOuu4e" },
];

export default function PrintQRPage() {
    const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
    const [qrCodes, setQrCodes] = useState<QRCodeForPrint[]>(mockQRCodes);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQRCodes = async () => {
            try {
                // TODO: Uncomment when API is ready
                // const response = await fetch("/api/qrcodes/unprinted");
                // const data = await response.json();
                // setQrCodes(data);

                // Using mock data for now
                const updatedCodes = await Promise.all(
                    mockQRCodes.map(async (qr) => {
                        const dataUrl = await QRCode.toDataURL(
                            `voterId: ${qr.voterId}`
                        );
                        return { ...qr, dataUrl };
                    })
                );
                setQrCodes(updatedCodes);
            } catch (error) {
                console.error("Error fetching QR codes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQRCodes();
    }, []);

    const handlePrintSelected = async () => {
        const codesToPrint = qrCodes.filter((code) =>
            selectedCodes.includes(code.voterId)
        );
        if (codesToPrint.length === 0) {
            alert("Please select at least one QR code to print");
            return;
        }

        const doc = generateQRCodesPDF(codesToPrint);
        doc.save("qr-codes.pdf");

        try {
            // TODO: Uncomment when API is ready
            // await fetch("/api/qrcodes/print", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ ids: codesToPrint.map(code => code.voterId) }),
            // });

            // Remove printed codes from the list
            setQrCodes(
                qrCodes.filter((code) => !selectedCodes.includes(code.voterId))
            );
            setSelectedCodes([]);
        } catch (error) {
            console.error("Error updating printed status:", error);
        }
    };

    const handlePrintAll = async () => {
        if (qrCodes.length === 0) {
            alert("No QR codes available to print");
            return;
        }

        const doc = generateQRCodesPDF(qrCodes);
        doc.save("qr-codes.pdf");

        try {
            // TODO: Uncomment when API is ready
            // await fetch("/api/qrcodes/print", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ ids: qrCodes.map(code => code.voterId) }),
            // });

            // Clear all codes after printing
            setQrCodes([]);
            setSelectedCodes([]);
        } catch (error) {
            console.error("Error updating printed status:", error);
        }
    };

    const handlePrintSingle = async (code: QRCodeForPrint) => {
        const doc = generateQRCodesPDF([code]);
        doc.save(`qr-code-${code.voterId}.pdf`);

        try {
            // TODO: Uncomment when API is ready
            // await fetch("/api/qrcodes/print", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ ids: [code.voterId] }),
            // });

            // Remove the printed code from the list
            setQrCodes(qrCodes.filter((qr) => qr.voterId !== code.voterId));
            setSelectedCodes(selectedCodes.filter((id) => id !== code.voterId));
        } catch (error) {
            console.error("Error updating printed status:", error);
        }
    };

    if (loading) {
        return (
            <AdminLayout heading="Print QR Codes">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
                    <div className="text-center">Loading...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout heading="Print QR Codes">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
                <div className="flex flex-col gap-6 justify-between items-center mb-6">
                    <h1 className="text-3xl text-center font-bold">
                        Print QR Codes
                    </h1>
                    <div className="flex w-full gap-4">
                        <Button
                            onClick={handlePrintSelected}
                            disabled={selectedCodes.length === 0}
                            variant="secondary"
                            className="min-w-[150px] flex-1"
                        >
                            Print Selected ({selectedCodes.length})
                        </Button>
                        <Button
                            onClick={handlePrintAll}
                            disabled={qrCodes.length === 0}
                            variant="default"
                            className="min-w-[150px] flex-1"
                        >
                            Print All ({qrCodes.length})
                        </Button>
                    </div>
                </div>

                {qrCodes.length === 0 ? (
                    <div className="text-center py-8">
                        No QR codes available to print
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">Select</TableHead>
                                <TableHead>QR Code</TableHead>
                                <TableHead className="w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {qrCodes.map((code) => (
                                <TableRow key={code.voterId}>
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={selectedCodes.includes(
                                                code.voterId
                                            )}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedCodes([
                                                        ...selectedCodes,
                                                        code.voterId,
                                                    ]);
                                                } else {
                                                    setSelectedCodes(
                                                        selectedCodes.filter(
                                                            (id) =>
                                                                id !==
                                                                code.voterId
                                                        )
                                                    );
                                                }
                                            }}
                                            className="h-4 w-4"
                                        />
                                    </TableCell>
                                    <TableCell>{code.voterId}</TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() =>
                                                handlePrintSingle(code)
                                            }
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <Printer className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </AdminLayout>
    );
}
