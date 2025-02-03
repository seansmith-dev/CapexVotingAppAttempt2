let validTokens = new Set(); // Same in-memory store as generate-qr.js

export default function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { token } = req.query.token;
    console.log("Received token from frontend:", token);
    
    if (!token || !validTokens.has(token)) {
        return res.status(200).json({ valid: false });
    }

    validTokens.delete(token); // Remove after validation (one-time use)

    return res.status(200).json({ valid: true });
}
