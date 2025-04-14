"use client";

import { useState } from "react";
import RegularNavBar from "@/app/components/RegularNavBar";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";
import { generateQRCodesPDF } from "@/app/utils/pdfGenerator";

type QRCode = {
  id: string;
  voterId: string;
  voterType: string;
};

export default function PrintQRPage() {
  const router = useRouter();

  // ✅ Mock QR code data
  const [qrCodes, setQrCodes] = useState<QRCode[]>([
    { id: "1", voterId: "4576", voterType: "GUEST" },
    { id: "2", voterId: "8902", voterType: "INDUSTRY" },
    { id: "3", voterId: "8902", voterType: "INDUSTRY" },
    { id: "4", voterId: "8902", voterType: "INDUSTRY" },
    { id: "5", voterId: "8902", voterType: "GUEST" },
    { id: "6", voterId: "8902", voterType: "GUEST" },
    { id: "7", voterId: "8902", voterType: "INDUSTRY" },
    { id: "8", voterId: "8902", voterType: "GUEST" }
  ]);

  const handlePrint = (code: QRCode) => {
    const doc = generateQRCodesPDF([code]);
    doc.save(`qr-${code.voterId}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <RegularNavBar heading="Capstone Project Expo 2024" />

      {/* Banner with heading */}
      <div className="relative">
        <img
          src="/background.png"
          alt="Expo Banner"
          className="w-full object-cover h-40 md:h-52"
        />
        <h2 className="absolute top-5 left-1/2 transform -translate-x-1/2 text-white text-xl font-bold bg-red-500 px-6 py-2 rounded-xl">
          Print QR Code
        </h2>
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-[220px] left-4 bg-white p-2 rounded-full shadow"
      >
        ←
      </button>

      {/* QR Code List */}
      <div className="relative z-10 px-4 py-6 flex flex-col items-center gap-4">
        {qrCodes.length === 0 ? (
          <p className="text-center text-gray-600">No QR Codes Available.</p>
        ) : (
          qrCodes.map((code) => (
            <div
              key={code.id}
              className="flex justify-between items-center bg-gray-100 w-full max-w-xs px-4 py-2 rounded-xl shadow"
            >
              <p className="text-sm font-medium">QR code ID: {code.voterId}</p>
              <button
                onClick={() => handlePrint(code)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-4 py-1 rounded-xl"
              >
                Print
              </button>
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}
