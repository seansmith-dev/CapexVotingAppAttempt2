import { nanoid } from "nanoid";  // No need for dynamic import now
import QRCode from "qrcode";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const token = nanoid();
    const qrUrl = `https://yourapp.com/loading?token=${token}`;

    try {
        const qrImage = await QRCode.toDataURL(qrUrl);
        return res.status(200).json({ qrUrl, qrImage });
    } catch (error) {
        console.error("QR Code generation error:", error);
        return res.status(500).json({ error: "Failed to generate QR code" });
    }
}
