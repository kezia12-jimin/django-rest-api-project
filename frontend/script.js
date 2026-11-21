
const API_URL = "https://django-rest-api-project-1.onrender.com/api";

let token = sessionStorage.getItem("taskToken");

async function login() {
    const username = prompt("Enter your Django username:");
    const password = prompt("Enter your Django password:");

    if (!username || !password) {
        alert("Username and password are required.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error("Login failed. Check your credentials.");
        }

        token = data.token;
        sessionStorage.setItem("taskToken", token);

        await loadTasks();

    } catch (error) {
        alert(error.message);
    }
}

async function loadTasks() {
    if (!token) {
        await login();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/`, {
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        if (response.status === 401) {
            sessionStorage.removeItem("taskToken");
            token = null;
            alert("Your session expired. Please log in again.");
            await login();
            return;
        }

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

document.getElementById("taskForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    try {
        const response = await fetch(`${API_URL}/tasks/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
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

async function updateTask(task) {
    const response = await fetch(`${API_URL}/tasks/${task.id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
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
}

async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    const response = await fetch(`${API_URL}/tasks/${id}/`, {
        method: "DELETE",
        headers: {
            "Authorization": `Token ${token}`
        }
    });

    if (response.ok) {
        await loadTasks();
    } else {
        alert("Could not delete task.");
    }
}

loadTasks();
