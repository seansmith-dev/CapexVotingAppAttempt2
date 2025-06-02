"use client";

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";

import styles from "./QRScanner.module.css";

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
    useEffect(() => {
        // Initialize scanner
        scannerRef.current = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 300, height: 300 },
                rememberLastUsedCamera: false,
                showTorchButtonIfSupported: true,
                defaultZoomValueIfSupported: 2,
                formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ],
                videoConstraints: {
                    facingMode: { exact: "environment" }
                }
            },
            false
        );

        // Render scanner
        scannerRef.current.render(
            (decodedText) => {
                console.log(decodedText);
                console.log(decodedText);
                onScanSuccess(decodedText);
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
        <div className="fixed h-full inset-0 bg-black/90 z-100 flex flex-col items-center justify-center p-4">
            <div className="w-full my-15 max-w-lg bg-zinc-800 rounded-3xl shadow-lg p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex-1 justify-center flex items-center">
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
                        <span className="text-red-500 text-xl text-center font-semibold">
                            Scan QR Code
                        </span>
                    </div>
                    {onClose && (
                        <button
                            onClick={() => {
                                if (scannerRef.current) {
                                    scannerRef.current.clear();
                                }
                                onClose();
                            }}
                            className="text-white transition-colors"
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
                <div className="bg-gray-800 flex-1 rounded-2xl overflow-auto text-white">
                    <div
                        id="reader"
                        className={`${styles["html5-qrcode-button-camera-stop"]} w-full h-full border-transparent`}
                    />
                </div>
                <p className="text-white text-sm text-center mt-4">
                    Position the QR code within the frame to scan
                </p>
            </div>
        </div>
    );
}
