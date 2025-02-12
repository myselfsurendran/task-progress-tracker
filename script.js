document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const clearAllBtn = document.getElementById('clear-all-btn');
    let tasks = [];

    function calculateDaysBetweenDates(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDifference = end - start;
        return Math.floor(timeDifference / (1000 * 3600 * 24));
    }

    function calculateExpectedProgress(startDate, endDate) {
        const totalDays = calculateDaysBetweenDates(startDate, endDate);
        const today = new Date();
        const daysPassed = calculateDaysBetweenDates(startDate, today);
        return Math.min(Math.round((daysPassed / totalDays) * 100), 100);
    }

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

    function validateInputs(taskItem) {
        const inputs = taskItem.querySelectorAll('input');
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });
        if (!isValid) {
            alert('Please fill in all fields');
        }
        return isValid;
    }

    function renderTask(task) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        const taskNameElem = document.createElement('p');
        taskNameElem.textContent = `Task Name: ${task.name}`;
        taskItem.appendChild(taskNameElem);

        const inputsHTML = `
            <div>
                <label>Total Task Value:</label>
                <input type="number" class="total-input" value="${task.total || ''}" min="0">
                
                <label>Completed Task Value:</label>
                <input type="number" class="completed-input" value="${task.completed || ''}" min="0">
                
                <label>Start Date:</label>
                <input type="date" class="start-date" value="${task.startDate || ''}">
                
                <label>End Date:</label>
                <input type="date" class="end-date" value="${task.endDate || ''}">
            </div>
        `;
        taskItem.insertAdjacentHTML('beforeend', inputsHTML);

        const statusBox = document.createElement('div');
        statusBox.className = 'task-status-box';
        taskItem.appendChild(statusBox);

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

        const progressContainer = document.createElement('div');
        progressContainer.className = 'task-progress-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'task-progress-bar';
        
        const progressText = document.createElement('span');
        progressText.className = 'progress-bar-text';
        
        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(progressText);
        taskItem.appendChild(progressContainer);

        function updateTaskStatus() {
            const total = parseInt(taskItem.querySelector('.total-input').value) || 0;
            const completed = parseInt(taskItem.querySelector('.completed-input').value) || 0;
            const startDate = taskItem.querySelector('.start-date').value;
            const endDate = taskItem.querySelector('.end-date').value;

            if (total && startDate && endDate) {
                const percentage = Math.round((completed / total) * 100);
                const expectedProgress = calculateExpectedProgress(startDate, endDate);
                const expectedValue = Math.round((total * expectedProgress) / 100);
                
                progressBar.style.width = `${percentage}%`;
                progressText.textContent = `${percentage}% Completed`;

                statusBox.className = 'task-status-box';
                if (completed >= total) {
                    statusBox.classList.add('on-track');
                    statusBox.textContent = 'Completed';
                    progressBar.style.backgroundColor = '#4caf50';
                } else if (completed >= expectedValue) {
                    statusBox.classList.add('on-track');
                    statusBox.textContent = `On Track - Complete ${expectedValue} by today`;
                    progressBar.style.backgroundColor = '#4caf50';
                } else if (new Date(endDate) < new Date()) {
                    statusBox.classList.add('deadline-passed');
                    statusBox.textContent = `Deadline Passed - Expected ${total}`;
                    progressBar.style.backgroundColor = '#f44336';
                } else {
                    statusBox.classList.add('delayed');
                    statusBox.textContent = `Delayed - Complete ${expectedValue} by today`;
                    progressBar.style.backgroundColor = '#ff9800';
                }
            }
        }

        let isFirstUpdate = true;

        updateButton.addEventListener('click', () => {
            if (!validateInputs(taskItem)) return;

            const totalInput = taskItem.querySelector('.total-input');
            const completedInput = taskItem.querySelector('.completed-input');
            const startDateInput = taskItem.querySelector('.start-date');
            const endDateInput = taskItem.querySelector('.end-date');

            const total = parseInt(totalInput.value);
            const completed = parseInt(completedInput.value);

            if (completed < 0 || completed > total) {
                alert('Completed value must be between 0 and total value');
                return;
            }

            if (new Date(startDateInput.value) > new Date(endDateInput.value)) {
                alert('Start date must be before end date');
                return;
            }

            if (isFirstUpdate) {
                totalInput.disabled = true;
                startDateInput.disabled = true;
                endDateInput.disabled = true;
                isFirstUpdate = false;
            }

            task.total = total;
            task.completed = completed;
            task.startDate = startDateInput.value;
            task.endDate = endDateInput.value;

            updateTaskStatus();
            saveToLocalStorage();
        });

        deleteButton.addEventListener('click', () => {
            tasks = tasks.filter(t => t !== task);
            taskList.removeChild(taskItem);
            saveToLocalStorage();
        });

        updateTaskStatus();
        return taskItem;
    }

    addTaskBtn.addEventListener('click', () => {
        const taskName = taskInput.value.trim();
        if (!taskName) {
            alert('Please enter a task name');
            return;
        }

        const newTask = {
            name: taskName,
            total: '',
            completed: '',
            startDate: '',
            endDate: ''
        };

        tasks.push(newTask);
        taskList.appendChild(renderTask(newTask));
        saveToLocalStorage();
        taskInput.value = ''; // Clear input after adding task
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

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    loadFromLocalStorage();
});
