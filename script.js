document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const clearAllBtn = document.getElementById('clear-all-btn');
    let tasks = [];

    function saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadFromLocalStorage() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            taskList.innerHTML = '';
            tasks.forEach(task => renderTask(task));
        }
    }

    function renderTask(task) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        const taskNameElem = document.createElement('p');
        taskNameElem.textContent = `Task Name: ${task.name}`;
        taskItem.appendChild(taskNameElem);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update Progress';
        updateButton.className = 'update-progress-btn';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Task';
        deleteButton.className = 'delete-task-btn';

        buttonsContainer.appendChild(updateButton);
        buttonsContainer.appendChild(deleteButton);
        taskItem.appendChild(buttonsContainer);

        deleteButton.addEventListener('click', () => {
            tasks = tasks.filter(t => t !== task);
            taskList.removeChild(taskItem);
            saveToLocalStorage();
        });

        taskList.appendChild(taskItem);
    }

    addTaskBtn.addEventListener('click', () => {
        const taskName = taskInput.value.trim();
        if (!taskName) {
            alert('Please enter a task name');
            return;
        }

        const newTask = { name: taskName };
        tasks.push(newTask);
        taskList.appendChild(renderTask(newTask));
        saveToLocalStorage();
        taskInput.value = '';
    });

    clearAllBtn.addEventListener('click', () => {
        if (tasks.length === 0) {
            alert('No tasks to clear');
            return;
        }
        if (confirm('Are you sure you want to clear all tasks?')) {
            tasks = [];
            taskList.innerHTML = '';
            localStorage.removeItem('tasks');
        }
    });

    loadFromLocalStorage();
});
