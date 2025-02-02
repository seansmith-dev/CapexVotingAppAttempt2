import { useState } from "react";

function GenerateQR() {
    const [qrImage, setQrImage] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateQRCode = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/generate-qr");
            const data = await response.json();

            if (data.qrImage) {
                setQrImage(data.qrImage);
                setQrUrl(data.qrUrl);
            }
        } catch (error) {
            console.error("Failed to generate QR code", error);
        }
        setLoading(false);
    };

    const printQRCode = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`<img src="${qrImage}" style="width: 300px; height: 300px;" />`);
        printWindow.document.write(`<p>${qrUrl}</p>`);
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
