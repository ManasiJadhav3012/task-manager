# 📌 Task Manager API Documentation

This document provides details about the API endpoints for the Task Manager Application backend, built with **Spring Boot**.

## 📍 Base URL
```bash
http://localhost:8080
```

### ➤ Request Body (JSON):
```json
{
  "title": "Complete project",
  "description": "Work on the final submission",
  "status": "TO DO"
}
```

#### ➤ Response (201 Created):
```json
{
  "id": 1,
  "title": "Complete project",
  "description": "Work on the final submission",
  "status": "TO DO"
}
```

#### ➤ Error Response (400 Bad Request):
```json
{
  "error": "Title and description are required"
}
```

### 📋 Get All Tasks

#### ➤ Endpoint:
```bash
GET /tasks
```

#### ➤ Response (200 OK):
```json
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Work on the final submission",
    "status": "TO DO"
  },
  {
    "id": 2,
    "title": "Fix API bug",
    "description": "Resolve error in task creation API",
    "status": "IN PROGRESS"
  }
]
```

### 🔍 Get a Task by ID

#### ➤ Endpoint:
```bash
GET /tasks/{id}
```

#### ➤ Response (200 OK):
```json
{
  "id": 1,
  "title": "Complete project",
  "description": "Work on the final submission",
  "status": "TO DO"
}
```

#### ➤ Error Response (404 Not Found):
```json
{
  "error": "Task not found"
}
```

### ✏️ Update a Task Status

#### ➤ Endpoint:
``` bash
PUT /tasks/{id}
```

#### ➤ Request Body (JSON):
```json
{
  "status": "DONE"
}
```

#### ➤ Response (200 OK):
```json
{
  "id": 1,
  "title": "Complete project",
  "description": "Work on the final submission",
  "status": "DONE"
}
```

#### ➤ Error Response (404 Not Found):
```json
{
  "error": "Task not found"
}
```

### ❌ Delete a Task

#### ➤ Endpoint:
``` bash
DELETE /tasks/{id}
```

#### ➤ Response (204 No Content):
No response body.

#### ➤ Error Response (404 Not Found):
```json
{
  "error": "Task not found"
}
```