"use client";
//Looks good
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
    <div className="min-h-screen flex flex-col bg-gray-100">
      <RegularNavBar heading="Capstone Project Expo 2024" />

      {/* Main Content Container */}
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 mb-4 flex items-center"
          >
            <span className="text-xl mr-1">←</span> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Print QR Codes</h1>
          <p className="text-gray-600">Select and print QR codes for voters</p>
        </div>

        {/* QR Codes Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {qrCodes.length === 0 ? (
            <p className="text-center text-gray-600">No QR Codes Available.</p>
          ) : (
            <>
              {/* Bulk Print Action */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleBulkPrint}
                  disabled={selected.length === 0}
                  className={`px-4 py-2 rounded-md font-medium text-sm
                    ${selected.length === 0 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  Print Selected ({selected.length})
                </button>
              </div>

              {/* QR Code Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {qrCodes.map((code) => (
                  <div
                    key={code.id}
                    className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(code.id)}
                        onChange={() => handleSelectionChange(code.id)}
                        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Voter ID: {code.voterId}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-500 mr-2">
                            {code.voterType}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              code.printed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {code.printed ? 'Printed' : 'Not Printed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
