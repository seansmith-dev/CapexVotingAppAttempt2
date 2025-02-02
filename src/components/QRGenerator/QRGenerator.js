import { useEffect, useState } from "react";
import QRCode from "qrcode.react";

function QRGenerator() {
    const [qrUrl, setQrUrl] = useState("");

    useEffect(() => {
        const fetchQrCode = async () => {
            try {
                const response = await fetch("/api/generate-qr");
                const data = await response.json();
                setQrUrl(data.qrUrl);
            } catch (error) {
                console.error("Error fetching QR code:", error);
            }
        };

        fetchQrCode();
    }, []);

    return (
        <div>
            <h2>Scan to Vote</h2>
            {qrUrl ? <QRCode value={qrUrl} size={256} /> : <p>Generating QR code...</p>}
        </div>
    );
}

export default QRGenerator;
