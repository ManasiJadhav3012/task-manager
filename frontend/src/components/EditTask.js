import React, { useState } from "react";
import "./CreateTask.css";

const EditTask = ({ task, onTaskUpdated, onClose }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [status, setStatus] = useState(task.status);

    const handleUpdate = async () => {
        try {
            await fetch(`http://localhost:8080/tasks/${task.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, description, status }),
            });

            onTaskUpdated();
            onClose();

        } catch (error) {
            console.error("Error updating task: ", error);
        }
    };

    const handleDelete = async () => {
        try {
            await fetch(`http://localhost:8080/tasks/${task.id}`, {
                method: "DELETE"
            });

            onTaskUpdated();
            onClose();

        } catch (error) {
            console.error("Error deleting task: ", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit/Delete Task</h2>

                <label>Title: </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label>Description: </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <label>Status: </label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="TODO">TO DO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DONE">DONE</option>
                </select>

                <div className="button-group">
                    <button className="update-btn" onClick={handleUpdate}>Update</button>
                    <button className="delete-btn" onClick={handleDelete}>Delete</button>
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditTask;