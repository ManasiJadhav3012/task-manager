import React, { useState } from "react";
import "./CreateTask.css";

const CreateTask = ({ onTaskCreated, onClose }) => {
    const[title, setTitle] = useState("");
    const[description, setDescription] = useState("");
    const[status, setStatus] = useState("TO DO");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch("http://localhost:8080/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description, status }),
            });

            if(response.ok) {
                onTaskCreated();
                onClose();
            } else {
                console.error("Failed to create task.")
            }


        } catch (error) {
            console.error("Error creating task: ", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create Task</h2>

                <form onSubmit={handleSubmit}>

                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title of the task"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label>Description:</label>
                    <textarea
                        name="description"
                        placeholder="Description of the task"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <label>Status:</label>
                    <select name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="TODO">TO DO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                    </select>

                    <div className="button-group">
                        <button className="create-btn" type="submit">Create</button>
                        <button className="cancel-btn" type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;