"use client";
//Looks good
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateQRCodesPDF, QRCodeForPrint } from "@/app/utils/pdfGenerator";
import { generateQRCodeDataURL, QRCodeData } from "@/app/utils/qrGenerator";
import AdminLayout from "@/app/layouts/admin";
import { toast } from "sonner";

type QRCode = {
  qr_code_id: string;
  qr_code_voter_id: string;
  leaderboard_type: string;
  qr_code_printed_flag: boolean | null;
};

export default function PrintQRPage() {
  const router = useRouter();
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/adminLogin');
        if (!response.ok) {
          toast.error("Please login to print QR codes");
          router.push('/admin');
        }
      } catch (err) {
        console.error('Session check failed:', err);
        toast.error("Session check failed. Please login again.");
        router.push('/admin');
      }
    };
    checkSession();
  }, [router]);

  // Fetch unprinted QR codes
  useEffect(() => {
    const fetchUnprintedQRCodes = async () => {
      try {
        const response = await fetch('/api/getProjectsList?unprintedOnly=true');
        if (!response.ok) {
          throw new Error('Failed to fetch QR codes');
        }
        const data = await response.json();
        setQrCodes(data);
      } catch (err) {
        console.error('Error fetching QR codes:', err);
        setError('Failed to load QR codes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnprintedQRCodes();
  }, []);

  // Toggle selection for a QR code
  const handleSelectionChange = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  };

  // Bulk print the selected QR codes
  const handleBulkPrint = async () => {
    const selectedCodes = qrCodes.filter((code) =>
      selected.includes(code.qr_code_id)
    );

    if (selectedCodes.length > 0) {
      try {
        // Generate QR code data URLs for each selected code
        const codesToPrint: QRCodeForPrint[] = await Promise.all(
          selectedCodes.map(async (code) => {
            const voterId = code.qr_code_voter_id || code.qr_code_id;
            const qrData: QRCodeData = {
              voterId,
              voterType: code.leaderboard_type
            };
            const dataUrl = await generateQRCodeDataURL(qrData);
            return {
              voterId,
              voterType: code.leaderboard_type,
              dataUrl
            };
          })
        );

        // Generate and save PDF
        const doc = generateQRCodesPDF(codesToPrint);
        doc.save("qr-codes.pdf");

        // Update printed status in database
        const response = await fetch("/api/updatePrintedStatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ids: selectedCodes.map(code => code.qr_code_voter_id)
          })
        });

        if (!response.ok) {
          throw new Error("Failed to update printed status");
        }

        // Update local state
        const updatedCodes = qrCodes.map((code) =>
          selected.includes(code.qr_code_id) ? { ...code, qr_code_printed_flag: true } : code
        );
        setQrCodes(updatedCodes);

        // Clear selection
        setSelected([]);
      } catch (error) {
        console.error("Error printing QR codes:", error);
        setError("Failed to print QR codes. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <AdminLayout heading="Print QR Codes">
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">Loading QR codes...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout heading="Print QR Codes">
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout heading="Print QR Codes">
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 mb-4 flex items-center"
          >
            <span className="text-xl mr-1">←</span> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Print QR Codes
          </h1>
          <p className="text-gray-600 text-center">
            Select and print QR codes for voters
          </p>
        </div>

        {/* QR Codes Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {qrCodes.length === 0 ? (
            <p className="text-center text-gray-600">No Unprinted QR Codes Available.</p>
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
                    key={code.qr_code_id}
                    className="border rounded-lg p-4 hover:border-blue-500 transition-colors bg-white"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(code.qr_code_id)}
                        onChange={() => handleSelectionChange(code.qr_code_id)}
                        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Voter ID: {code.qr_code_voter_id || 'Not Assigned'}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-500 mr-2">
                            {code.leaderboard_type}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              code.qr_code_printed_flag
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {code.qr_code_printed_flag ? 'Printed' : 'Not Printed'}
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
    </AdminLayout>
  );
}
