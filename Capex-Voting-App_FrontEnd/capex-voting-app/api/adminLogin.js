export default function handler(req, res) {
    if (req.method === "POST") {
        const { username, password } = req.body;

        // Hardcoded credentials (Mock database)
        const mockAdmin = {
            username: "admin",
            password: "securepassword123"
        };

        if (username === mockAdmin.username && password === mockAdmin.password) {
            return res.status(200).json({ message: "Login successful!" });
        } else {
            return res.status(401).json({ message: "Invalid username or password" });
        }
    }

    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
