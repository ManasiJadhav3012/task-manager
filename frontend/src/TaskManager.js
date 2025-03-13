import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import CreateTask from "./components/CreateTask";
import EditTask from "./components/EditTask";

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    };

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("token");

            if(!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch("http://localhost:8080/tasks", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if(!response.ok) {
                throw new Error(`Failed to fetch tasks. Status: ${response.status}`);
            }

            const data = await response.json();
            setTasks(data);

        } catch (error) {
            console.error("Error fetching tasks: ", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if(!token) {
            navigate("/auth");
        }

        const handleBackButton = () => {
            window.history.pushState(null, "", window.location.href);
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handleBackButton);

        const interval = setInterval(() => {
            window.history.pushState(null, "", window.location.href);
        }, 500);

        return () => {
            window.removeEventListener("popstate", handleBackButton);
            clearInterval(interval);
        };
    }, [navigate]);

    const handleDragEnd = async (result) => {
        if(!result.destination) return;

        const { source, destination } = result;

        const updatedTasks = [...tasks];
        const draggedTaskIndex = updatedTasks.findIndex(task => task.id.toString() === result.draggableId);

        if(draggedTaskIndex === -1) return;

        const draggedTask = updatedTasks[draggedTaskIndex];
        const newStatus = destination.droppableId;

        if(draggedTask.status === newStatus) return;

        draggedTask.status = newStatus;

        if (source.droppableId !== destination.droppableId) {
            try {
                const response = await fetch(`http://localhost:8080/tasks/${draggedTask.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        title: draggedTask.title,
                        description: draggedTask.description,
                        status: newStatus
                     }),
                });

                if(!response.ok) {
                    throw new Error("Failed to update task");
                }

                setTasks(updatedTasks);

            } catch (error) {
                console.error("Error updating task: ", error);
            }
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="task-manager-container">

                <div className="header-container">
                    <h1 className="task-manager-title">Task Manager</h1>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>

                <div className="task-columns">

                    <Droppable droppableId="TODO">
                        {(provided) => (
                            <div className="task-column" ref={provided.innerRef} {...provided.droppableProps}>
                                <button className="add-task-btn" onClick={() => setShowModal(true)}>+ Add Task</button>
                                <h2>TO-DO</h2>

                                {tasks.filter(task => task.status === "TODO").map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="task-card"
                                                onClick={() => setSelectedTask(task)}
                                            >
                                                <p className="task-title">{task.title}</p>
                                                <p className="task-status">{task.status}</p>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}

                                {provided.placeholder}

                            </div>
                        )}
                    </Droppable>

                    <Droppable droppableId="IN_PROGRESS">
                        {(provided) => (
                            <div className="task-column" ref={provided.innerRef} {...provided.droppableProps}>
                                <h2>IN-PROGRESS</h2>

                                {tasks.filter(task => task.status === "IN_PROGRESS").map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="task-card"
                                                onClick={() => setSelectedTask(task)}
                                            >
                                                <p className="task-title">{task.title}</p>
                                                <p className="task-status">{task.status}</p>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    <Droppable droppableId="DONE">
                        {(provided) => (
                            <div className="task-column" ref={provided.innerRef} {...provided.droppableProps}>
                                <h2>DONE</h2>

                                {tasks.filter(task => task.status === "DONE").map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="task-card"
                                                onClick={() => setSelectedTask(task)}
                                            >
                                                <p className="task-title">{task.title}</p>
                                                <p className="task-status">{task.status}</p>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                </div>

                {showModal && <CreateTask onTaskCreated={fetchTasks} onClose={() => setShowModal(false)}/>}

                {selectedTask && <EditTask task={selectedTask} onTaskUpdated={fetchTasks} onClose={() => setSelectedTask(null)} />}

            </div>

        </DragDropContext>
    );
};

export default TaskManager;