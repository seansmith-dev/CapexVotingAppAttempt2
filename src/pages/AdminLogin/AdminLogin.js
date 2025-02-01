import { useState } from "react";
import { useRouter } from "next/router"; // Import useRouter
import "./AdminLogin.css";
import Button from "../../components/Button/Button.js";

function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter(); // Initialize router

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        const response = await fetch("/api/adminLogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            router.push("/admin"); // Navigate to /admin on success
        } else {
            setError(data.message);
        }
    };

    return (
        <div className="admin-login">
            <h1 className="admin-login__title">Admin Login</h1>
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="admin-login__username-input" className="admin-login__username-label">Username</label>
                <input 
                    type="text" 
                    id="admin-login__username-input" 
                    className="admin-login__username-input" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />

                <label htmlFor="admin-login__password-input" className="admin-login__username-label margin--top">Password</label>
                <input 
                    type="password" 
                    id="admin-login__password-input" 
                    className="admin-login__password-input margin--bottom" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />

                {error && <p className="error">{error}</p>}

                <Button 
                    buttonType="card" 
                    buttonSize="small" 
                    buttonText="Login" 
                    buttonWidth="form" 
                    className="student--btn login--btn" 
                    type="submit"
                />
            </form>
        </div>
    );
}

export default AdminLogin;
