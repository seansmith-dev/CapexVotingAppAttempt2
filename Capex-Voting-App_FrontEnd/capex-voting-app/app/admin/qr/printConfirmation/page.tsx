"use client";

import AdminLayout from "@/app/layouts/admin";
import { QrCode } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PrintConfirmationPage() {
  const searchParams = useSearchParams();
  const codesParam = searchParams.get("codes") || "";
  const codes = codesParam.split(",").filter(Boolean);
  const router = useRouter();

  return (
    <AdminLayout heading="Print Confirmation">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-10 mt-14">
        {/* Info box */}
        <div className="flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-200/70">
              <QrCode className="w-7 h-7 text-blue-700" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-900">{codes.length}</div>
              <div className="text-base text-blue-700 font-medium">Total QR Codes Selected</div>
            </div>
          </div>
        </div>
        {/* QR code list with scroll */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-gray-800 text-center tracking-wide">Selected QR Codes</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {codes.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No QR codes selected.</div>
            ) : (
              codes.map((code, idx) => (
                <div
                  key={code}
                  className="flex items-center gap-4 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg px-5 py-3 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold text-lg border border-blue-200">
                    {idx + 1}
                  </div>
                  <div className="flex-1 text-gray-700 font-mono text-base select-all">{code}</div>
                  <QrCode className="w-6 h-6 text-blue-400" />
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex gap-4 justify-between mt-12">
          <button
            className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-semibold shadow"
            onClick={() => router.back()}
          >
            Go Back
          </button>
          <button
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition font-semibold shadow"
            disabled
          >
            Print Confirmation
          </button>
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </AdminLayout>
  );
}
