"use client";

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useState } from "react";

interface QRScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanError?: (error: any) => void;
    onClose?: () => void;
}

export default function QRScanner({
    onScanSuccess,
    onScanError,
    onClose,
}: QRScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [data, setData] = useState("");
    useEffect(() => {
        // Initialize scanner
        scannerRef.current = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 300, height: 300 },
            },
            false
        );

        // Render scanner
        scannerRef.current.render(
            (decodedText) => {
                setData(decodedText);
                
                // onScanSuccess(decodedText);
            },
            (error) => {
                onScanError?.(error);
            }
        );

        // Cleanup
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear();
            }
        };
    }, [onScanSuccess, onScanError]);

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-800 rounded-3xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 text-red-500 mr-2"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-red-500 text-lg font-semibold">
                            Scan QR Code. data: {data}
                        </span>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-gray-900 hover:text-white transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-6"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    )}
                </div>
                <div className="bg-gray-200 rounded-2xl overflow-hidden aspect-square text-black">
                    <div id="reader" className="w-full h-full" />
                </div>
                <p className="text-gray-900 text-sm text-center mt-4">
                    Position the QR code within the frame to scan
                </p>
            </div>
        </div>
    );
}
