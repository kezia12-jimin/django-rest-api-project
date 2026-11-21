
const API_URL = "https://django-rest-api-project-1.onrender.com/api";

// Load and display tasks
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks/`);

        if (!response.ok) {
            throw new Error("Could not load tasks.");
        }

        const tasks = await response.json();

        document.getElementById("totalTasks").textContent = tasks.length;

        document.getElementById("completedTasks").textContent =
            tasks.filter(task => task.completed).length;

        document.getElementById("pendingTasks").textContent =
            tasks.filter(task => !task.completed).length;

        const taskList = document.getElementById("taskList");
        taskList.innerHTML = "";

        tasks.forEach(task => {
            const item = document.createElement("div");
            item.className = "task-item";

            const title = document.createElement("h3");
            title.textContent = task.title;

            const description = document.createElement("p");
            description.textContent = task.description;

            const statusText = document.createElement("p");
            statusText.textContent = task.completed ? "Completed" : "Pending";

            const completeButton = document.createElement("button");
            completeButton.textContent = task.completed ? "Mark Pending" : "Complete";
            completeButton.onclick = () => updateTask(task);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => deleteTask(task.id);

            item.append(title, description, statusText, completeButton, deleteButton);
            taskList.appendChild(item);
        });

        if (tasks.length === 0) {
            taskList.textContent = "No tasks yet. Add your first task!";
        }

    } catch (error) {
        document.getElementById("taskList").textContent = error.message;
    }
}

// Add a new task
document.getElementById("taskForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    try {
        const response = await fetch(`${API_URL}/tasks/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                description: description,
                completed: false
            })
        });

        if (!response.ok) {
            throw new Error("Could not add task.");
        }

        this.reset();
        await loadTasks();

    } catch (error) {
        alert(error.message);
    }
});

// Update task completion
async function updateTask(task) {
    try {
        const response = await fetch(`${API_URL}/tasks/${task.id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: task.title,
                description: task.description,
                completed: !task.completed
            })
        });

        if (response.ok) {
            await loadTasks();
        } else {
            alert("Could not update task.");
        }

    } catch (error) {
        alert(error.message);
    }
}

// Delete a task
async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${id}/`, {
            method: "DELETE"
        });

        if (response.ok) {
            await loadTasks();
        } else {
            alert("Could not delete task.");
        }

    } catch (error) {
        alert(error.message);
    }
}

// Start the application
loadTasks();
