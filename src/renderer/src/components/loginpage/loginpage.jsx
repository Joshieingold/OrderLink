import { useState, useEffect } from "react";
import { auth } from "../General/database/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./loginpage.css"; // Import your CSS file for styling
import  LogoFrame  from "../General/logoFrame/logoFrame";


export const LoginPage = () => {
    const [email, setEmail] = useState(localStorage.getItem("savedEmail") || ""); // Pre-fill email if saved
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [rememberMe, setRememberMe] = useState(false); // State for the "Remember Me" checkbox
    const navigate = useNavigate();

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Save email to localStorage if "Remember Me" is checked
            if (rememberMe) {
                localStorage.setItem("savedEmail", email);
            } else {
                localStorage.removeItem("savedEmail");
            }
            navigate("/Home");
        } catch (err) {
            setError("Invalid email or password.");
        }
    };

    // Effect to handle changes in the "Remember Me" checkbox
    useEffect(() => {
        if (!rememberMe) {
            localStorage.removeItem("savedEmail");
        }
    }, [rememberMe]);

    return (
        <div className="login-page">
            <LogoFrame/>
            <form className="login-form" onSubmit={handleLogin}>
                <div className="text-container">
                    <h1 className="login-title">Sign in</h1>
                    <p className="login-subtitle">Track smarter. Work smoother.</p>
                </div>
                <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    name="email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className="input"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className="remember-me-container">
                    <label>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="remember-me-checkbox"
                        />
                        Remember me
                    </label>
                </div>
                {error && <p className="error">Login failed, please try again</p>}
                <button type="submit" className="login-button">Sign in</button>
            </form>
        </div>    
    );
};

    