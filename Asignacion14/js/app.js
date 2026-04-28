// Helpers de UI
const showLoading = (show) => {
    document.getElementById('loading').style.display = show ? 'flex' : 'none';
};

const showError = (msg) => {
    const banner = document.getElementById('errorBanner');
    document.getElementById('errorMessage').textContent = msg;
    banner.style.display = 'flex';
    setTimeout(() => { banner.style.display = 'none'; }, 4000);
};

document.addEventListener('DOMContentLoaded', async () => {
    const input = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const list = document.getElementById('taskList');

    // Cerrar error
    document.getElementById('errorClose').addEventListener('click', () => {
        document.getElementById('errorBanner').style.display = 'none';
    });

    // Cargar tareas iniciales (API o localStorage)
    showLoading(true);
    await state.fetchTasks();
    ui.render(state.tasks);
    showLoading(false);

    // Evento: Crear tarea (clic)
    addBtn.addEventListener('click', async () => {
        if (!input.value.trim()) return;
        try {
            await state.addTask(input.value);
            input.value = "";
            ui.render(state.tasks);
        } catch (err) {
            showError('Error al crear la tarea');
        }
        input.focus();
    });

    // Evento: Tecla Enter
    input.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') addBtn.click();
    });

    // Delegación de eventos en el <ul> padre
    list.addEventListener('click', async (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        const id = parseInt(li.dataset.id);

        try {
            if (e.target.classList.contains('btn-delete')) {
                await state.deleteTask(id);
                ui.render(state.tasks);

            } else if (e.target.classList.contains('btn-edit')) {
                const task = state.tasks.find(t => t.id === id);
                const newText = prompt("Editar:", task.text);
                if (newText) await state.editTask(id, newText);
                ui.render(state.tasks);

            } else if (e.target.tagName !== 'BUTTON') {
                await state.toggleTask(id);
                ui.render(state.tasks);
            }
        } catch (err) {
            showError('Error al procesar la acción');
        }
    });
});
