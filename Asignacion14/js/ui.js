// Módulo UI: Renderizar la lista de tareas en el DOM
const ui = {
    render: function (tasks) {
        const list = document.getElementById('taskList');
        list.innerHTML = "";

        tasks.forEach(t => {
            const li = document.createElement('li');
            li.className = `task-item ${t.completed ? 'completed' : ''}`;
            li.dataset.id = t.id;

            li.innerHTML = `
                <span>${t.text}</span>
                <div class="actions">
                    <button class="btn-edit">✏️</button>
                    <button class="btn-delete">x</button>
                </div>
            `;
            list.appendChild(li);
        });
    }
};
