// La URL de tu Servlet de Java
const API_URL = 'http://localhost:8080/TasksAPI/api/task';

// Flag para saber si la API está disponible
let apiAvailable = false;

// Helpers para localStorage
const saveLocal = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks));
const loadLocal = () => JSON.parse(localStorage.getItem('tasks') || '[]');

// Estado global de tareas
const state = {
    tasks: [],

    // GET: Obtener todas las tareas
    fetchTasks: async function () {
        try {
            const response = await fetch(API_URL);
            this.tasks = await response.json();
            apiAvailable = true;
        } catch (err) {
            // Sin API → usamos localStorage
            apiAvailable = false;
            this.tasks = loadLocal();
        }
        return this.tasks;
    },

    // POST: Crear una nueva tarea
    addTask: async function (text) {
        if (apiAvailable) {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text, completed: false })
            });
            const newTask = await response.json();
            this.tasks.push(newTask);
        } else {
            // Fallback local: generamos un ID simple
            const newTask = {
                id: Date.now(),
                text: text,
                completed: false
            };
            this.tasks.push(newTask);
            saveLocal(this.tasks);
        }
        return this.tasks;
    },

    // DELETE: Eliminar tarea
    deleteTask: async function (id) {
        if (apiAvailable) {
            await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
        }
        this.tasks = this.tasks.filter(t => t.id !== id);
        if (!apiAvailable) saveLocal(this.tasks);
        return this.tasks;
    },

    // PUT: Alternar completado
    toggleTask: async function (id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        if (apiAvailable) {
            const updatedTask = { ...task, completed: !task.completed };
            const response = await fetch(API_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask)
            });
            const savedTask = await response.json();
            task.completed = savedTask.completed;
        } else {
            task.completed = !task.completed;
            saveLocal(this.tasks);
        }
        return this.tasks;
    },

    // PUT: Editar texto
    editTask: async function (id, newText) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        if (apiAvailable) {
            const updatedTask = { ...task, text: newText };
            const response = await fetch(API_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask)
            });
            const savedTask = await response.json();
            task.text = savedTask.text;
        } else {
            task.text = newText;
            saveLocal(this.tasks);
        }
        return this.tasks;
    }
};
