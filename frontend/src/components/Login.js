import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if(!loginUsername || !loginPassword) {
            alert("Username and Password are required!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: loginUsername, password: loginPassword }),
            });

            const data = await response.json();

            if(response.ok) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
                navigate("/tasks", { replace: true });
            } else {
                alert("Invalid Credentials");
            }
        } catch (error) {
            console.error("Error during login: ", error.message);
            alert(error.message);
        }
    };

    const handleRegister = async () => {
        if(!registerUsername || !registerPassword) {
            alert("Username and Password are required");
            return;
        }

        const response = await fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: registerUsername, password: registerPassword }),
        });

        let data;

        try {
            data = await response.json();
        } catch (error) {
            data = null;
        }

        if (response.ok) {
            alert("Registration successful! Please log in!");
            setShowRegisterModal(false);
            setRegisterUsername("");
            setRegisterPassword("");
            navigate("/auth");
        } else if (response.status === 403) {
            alert("User already exists! Please log in or try another Username!");
            setRegisterUsername("");
            setRegisterPassword("");
            setShowRegisterModal(false);
            navigate("/auth");
        } else {
            alert("Registration failed!");
            setRegisterUsername("");
            setRegisterPassword("");
        }

    };

    return (
        <div className="login-container">
            <h1 className="app-title">Task Manager Application</h1>

            <div className="login-box">
                <h2>Login</h2>

                <input
                    placeholder="Username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                />

                <button className="login-btn" onClick={handleLogin}>Login</button>
                <button className="register-btn" onClick={() => setShowRegisterModal(true)}>Create Account</button>
            </div>

            {showRegisterModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Register Here</h2>

                        <input
                            placeholder="Username"
                            value={registerUsername}
                            onChange={(e) => setRegisterUsername(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                        />

                        <button className="register-btn" onClick={handleRegister}>Register</button>
                        <button className="cancel-btn" onClick={() => setShowRegisterModal(false)}>Cancel</button>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;