import { useState } from "react";

function GenerateQR() {
    const [qrImage, setQrImage] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateQRCode = async () => {
        setLoading(true);
        setQrImage(null); // Reset previous QR code
        setQrUrl(null);

        try {
            const response = await fetch("/api/generate-qr");
            const data = await response.json();

            if (data.qrImage && data.qrUrl) {
                setQrImage(data.qrImage);
                setQrUrl(data.qrUrl);
            } else {
                console.error("API did not return a valid QR code");
            }
        } catch (error) {
            console.error("Failed to generate QR code", error);
        }
        
        setLoading(false);
    };

    const printQRCode = () => {
        if (!qrImage || !qrUrl) {
            console.error("No QR code available for printing");
            return;
        }

        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head><title>Print QR Code</title></head>
                <body>
                    <img src="${qrImage}" style="width: 300px; height: 300px;" />
                    <p>URL: <a href="${qrUrl}" target="_blank">${qrUrl}</a></p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div>
            <h1>QR Code Generator</h1>
            <button onClick={generateQRCode} disabled={loading}>
                {loading ? "Generating..." : "Generate QR Code"}
            </button>
            {qrImage && (
                <div>
                    <h3>Scan this QR Code</h3>
                    <img src={qrImage} alt="QR Code" style={{ width: "200px", height: "200px" }} />
                    <p>URL: <a href={qrUrl} target="_blank" rel="noopener noreferrer">{qrUrl}</a></p>
                    <button onClick={printQRCode}>Print QR Code</button>
                </div>
            )}
        </div>
    );
}

export default GenerateQR;
