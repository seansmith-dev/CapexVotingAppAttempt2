"use client";
//Looks good
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateQRCodesPDF, QRCodeForPrint } from "@/app/utils/pdfGenerator";
import { generateQRCodeDataURL, QRCodeData } from "@/app/utils/qrGenerator";
import AdminLayout from "@/app/layouts/admin";
import { QRCodeCanvas } from "qrcode.react";

type QRCode = {
  qr_code_id: string;
  qr_code_voter_id: string;
  leaderboard_type: string;
  qr_code_printed_flag: boolean | null;
  project_name: string;
  faculty_name: string;
};

export default function PrintQRPage() {
  const router = useRouter();
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex-1 flex flex-col justify-center p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Page Header */}
            <div className="mb-6">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800 mb-4 flex items-center"
              >
                <span className="text-xl mr-1">←</span> Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Print QR Codes</h1>
              <p className="text-gray-600">Select and print QR codes for voters</p>
            </div>

            {/* QR Codes Section */}
            <div className="space-y-6">
              {/* Bulk Print Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Bulk Print</h2>
                <div className="flex flex-wrap gap-4">
                  {qrCodes.map((qr) => (
                    <div
                      key={qr.qr_code_id}
                      className="flex items-center space-x-2 bg-white p-2 rounded border"
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(qr.qr_code_id)}
                        onChange={() => handleSelectionChange(qr.qr_code_id)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">
                        {qr.project_name} - {qr.faculty_name}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleBulkPrint}
                    disabled={selected.length === 0}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Print Selected ({selected.length})
                  </button>
                </div>
              </div>

              {/* Individual QR Codes */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Individual QR Codes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {qrCodes.map((qr) => (
                    <div
                      key={qr.qr_code_id}
                      className="bg-white border rounded-lg p-4 flex flex-col items-center"
                    >
                      <div className="mb-2">
                        <QRCodeCanvas value={qr.qr_code_id} size={128} />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">{qr.project_name}</p>
                        <p className="text-sm text-gray-600">{qr.faculty_name}</p>
                      </div>
                      <button
                        onClick={() => handleSelectionChange(qr.qr_code_id)}
                        className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
