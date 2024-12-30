document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');

  // Function to calculate the days between two dates
  function calculateDaysBetweenDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end - start;
    const daysDifference = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days
    return Math.floor(daysDifference);
  }

  // Function to render individual tasks
  function renderTask(task) {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';

    const taskNameElem = document.createElement('p');
    const taskStatus = document.createElement('span');
    taskStatus.className = 'task-status';
    taskNameElem.textContent = task.name;
    taskNameElem.appendChild(taskStatus);
    taskItem.appendChild(taskNameElem);

    const inputContainer = document.createElement('div');
    inputContainer.innerHTML = `
      <label for="total-input">Total Task Value:</label>
      <input type="number" id="total-input" value="${task.total}" readonly>
      
      <label for="completed-input">Completed Task Value:</label>
      <input type="number" id="completed-input" value="${task.completed}">
      
      <label for="start-date-input">Start Date:</label>
      <input type="date" id="start-date-input" value="${task.startDate}" readonly>
      
      <label for="end-date-input">End Date:</label>
      <input type="date" id="end-date-input" value="${task.endDate}" readonly>
      
      <button class="update-progress-btn">Update Progress</button>
    `;
    taskItem.appendChild(inputContainer);

    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'task-progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'task-progress-bar';
    progressBarContainer.appendChild(progressBar);
    taskItem.appendChild(progressBarContainer);

    const updateButton = inputContainer.querySelector('.update-progress-btn');
    updateButton.addEventListener('click', () => {
      const total = parseInt(inputContainer.querySelector('#total-input').value, 10) || 0;
      const completed = parseInt(inputContainer.querySelector('#completed-input').value, 10) || 0;
      const startDate = inputContainer.querySelector('#start-date-input').value;
      const endDate = inputContainer.querySelector('#end-date-input').value;

      if (total > 0 && completed >= 0 && completed <= total && startDate && endDate) {
        const totalDays = calculateDaysBetweenDates(startDate, endDate);
        const currentDate = new Date();
        const elapsedDays = calculateDaysBetweenDates(startDate, currentDate);
        const progressPerDay = 100 / totalDays;
        const expectedProgress = progressPerDay * elapsedDays;

        let progress = (completed / total) * 100;
        progressBar.style.width = `${progress}%`;

        let statusText = `${Math.round(progress)}% Completed`;
        let delayText = '';
        if (elapsedDays > totalDays) {
          progressBar.style.background = 'red';
          taskStatus.style.color = 'red';
          statusText = 'Deadline crossed';
        } else if (expectedProgress > progress) {
          const delayInDays = Math.ceil(
            ((progressPerDay * elapsedDays) / 100) * total - completed
          );
          progressBar.style.background = 'yellow';
          taskStatus.style.color = 'yellow';
          delayText = ` --> Delayed by ${delayInDays} day(s)`;
        } else {
          progressBar.style.background = '#4caf50';
          taskStatus.style.color = '#4caf50';
        }

        taskStatus.textContent = `${statusText}${delayText}`;
        updateTaskInLocalStorage(task.name, total, completed, startDate, endDate);
      } else {
        alert('Please enter valid Total, Completed, Start Date, and End Date values.');
      }
    });

    taskList.appendChild(taskItem);
  }

  // Function to add task to localStorage
  function addTaskToLocalStorage(taskName, total, completed, startDate, endDate) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ name: taskName, total, completed, startDate, endDate });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Function to update a task in localStorage
  function updateTaskInLocalStorage(taskName, total, completed, startDate, endDate) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.map(task => {
      if (task.name === taskName) {
        return { name: taskName, total, completed, startDate, endDate };
      }
      return task;
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  }

  // Load tasks from localStorage and render them
  function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));
  }

  // Event listener for adding tasks
  addTaskBtn.addEventListener('click', () => {
    const taskName = taskInput.value.trim();
    const total = 0;
    const completed = 0;
    const startDate = new Date().toISOString().slice(0, 10);
    const endDate = new Date().toISOString().slice(0, 10);

    if (taskName) {
      addTaskToLocalStorage(taskName, total, completed, startDate, endDate);
      renderTask({ name: taskName, total, completed, startDate, endDate });
      taskInput.value = '';
    } else {
      alert('Task name cannot be empty.');
    }
  });

  // Load tasks on page load
  loadTasksFromLocalStorage();
});
