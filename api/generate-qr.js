import { nanoid } from 'nanoid';  // Correct way to import nanoid
import QRCode from 'qrcode';      // Correct way to import qrcode

let validTokens = new Set();  // Temporary in-memory token store

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const token = nanoid(); // Generate a unique token
    validTokens.add(token); // Store it temporarily

    // Auto-remove token after 5 minutes
    setTimeout(() => validTokens.delete(token), 300000);

    const qrUrl = `https://capex-voting-app.vercel.app/?token=${token}`;

    try {
        // Generate QR Code as a data URL
        const qrImage = await QRCode.toDataURL(qrUrl);

        return res.status(200).json({ qrUrl, qrImage });
    } catch (error) {
        console.error("QR Code generation error:", error);
        return res.status(500).json({ error: "Failed to generate QR code" });
    }
}
