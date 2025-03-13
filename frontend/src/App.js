import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import TaskManager from "./TaskManager";

const App = () => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            setToken(storedToken);
        } else {
            setToken(null);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/auth" element={<Login setToken={setToken} />} />
                <Route path="/tasks" element={token ? <TaskManager /> : <Navigate to="/auth" />} />
                <Route path="*" element={<Navigate to={token ? "/tasks" : "/auth"} />} />
            </Routes>
        </Router>
    );
};

export default App;