import { nanoid } from "nanoid";

let validTokens = new Set(); // Temporary in-memory token store

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const token = nanoid(); // Generate a unique token
    validTokens.add(token); // Store it temporarily

    // Auto-remove token after 5 minutes
    setTimeout(() => validTokens.delete(token), 300000);

    const qrUrl = `https://yourapp.com/loading?token=${token}`;
    return res.status(200).json({ qrUrl, token });
}
