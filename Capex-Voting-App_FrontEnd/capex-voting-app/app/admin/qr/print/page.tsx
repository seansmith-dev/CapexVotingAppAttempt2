"use client";

import { useState } from "react";
import RegularNavBar from "@/app/components/RegularNavBar";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";

type QRCode = {
  id: string;
  voterId: string;
  voterType: string;
  printed: boolean;
};

export default function PrintQRPage() {
  const router = useRouter();

  // ✅ Mock QR code data (all initially Not Printed)
  const [qrCodes, setQrCodes] = useState<QRCode[]>([
    { id: "1", voterId: "4576", voterType: "GUEST", printed: false },
    { id: "2", voterId: "8902", voterType: "INDUSTRY", printed: false },
    { id: "3", voterId: "3125", voterType: "INDUSTRY", printed: false },
    { id: "4", voterId: "7645", voterType: "INDUSTRY", printed: false },
    { id: "5", voterId: "1290", voterType: "GUEST", printed: false },
    { id: "6", voterId: "4587", voterType: "GUEST", printed: false },
    { id: "7", voterId: "9871", voterType: "INDUSTRY", printed: false },
    { id: "8", voterId: "3321", voterType: "GUEST", printed: false }
  ]);

  // Track selected QR code IDs.
  const [selected, setSelected] = useState<string[]>([]);

  // Toggle selection for a QR code.
  const handleSelectionChange = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  };

  // Bulk print the selected QR codes. This sends the selected codes to the API endpoint,
  // which saves them in a JSON file.
  const handleBulkPrint = async () => {
    const selectedCodes = qrCodes.filter((code) =>
      selected.includes(code.id)
    );
    if (selectedCodes.length > 0) {
      try {
        const response = await fetch("/api/saveSelected", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(selectedCodes)
        });

        console.log("API response status:", response.status);
        if (!response.ok) {
          throw new Error("Failed to save selected QR codes");
        }
        console.log("Selected QR codes saved to JSON file successfully.");

        // Update the printed status for each selected QR code.
        const updatedCodes = qrCodes.map((code) =>
          selected.includes(code.id) ? { ...code, printed: true } : code
        );
        setQrCodes(updatedCodes);

        // Clear the selection after saving.
        setSelected([]);
      } catch (error) {
        console.error("Error printing QR codes:", error);
      }
    }
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

      {/* Bulk print button and QR Code List */}
      <div className="relative z-10 px-4 py-6 flex flex-col items-center gap-4">
        {qrCodes.length === 0 ? (
          <p className="text-center text-gray-600">No QR Codes Available.</p>
        ) : (
          <>
            {/* Bulk Print Action */}
            <div className="w-full max-w-xs flex justify-end mb-2">
              <button
                onClick={handleBulkPrint}
                className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-4 py-1 rounded-xl"
              >
                Print Selected QR Codes
              </button>
            </div>

            {/* QR Code Rows */}
            {qrCodes.map((code) => (
              <div
                key={code.id}
                className="flex items-center bg-gray-100 w-full max-w-xs px-4 py-2 rounded-xl shadow"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(code.id)}
                  onChange={() => handleSelectionChange(code.id)}
                  className="mr-2"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    QR code ID: {code.voterId}
                  </p>
                  <p
                    className={`text-xs ${
                      code.printed ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {code.printed ? "Printed" : "Not Printed"}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
