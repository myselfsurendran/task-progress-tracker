document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');
  let tasks = []; // To hold tasks in memory

  // Function to calculate the days between two dates
  function calculateDaysBetweenDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end - start;
    const daysDifference = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days
    return Math.floor(daysDifference);
  }

  // Function to save tasks to localStorage
  function saveToLocalStorage() {
    console.log('Saving tasks:', tasks); // Debugging log
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Function to load tasks from localStorage
  function loadFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      tasks = JSON.parse(storedTasks);
      tasks.forEach((task) => renderTask(task, false)); // Render each task on the page (non-editable)
    }
  }

  // Function to render individual tasks
  function renderTask(task, isNew) {
    // Create task item container
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';

    // Add task name and status
    const taskNameElem = document.createElement('p');
    const taskStatus = document.createElement('span');
    taskStatus.className = 'task-status';
    taskNameElem.textContent = task.name;
    taskNameElem.appendChild(taskStatus);
    taskItem.appendChild(taskNameElem);

    // Add inputs for Total, Completed, Start Date, and End Date
    const inputContainer = document.createElement('div');
    inputContainer.innerHTML = `
      <label>Total Task Value:</label>
      <input type="number" value="${task.total || ''}" placeholder="Enter total" min="0" ${isNew ? '' : 'disabled'}>
      
      <label>Completed Task Value:</label>
      <input type="number" value="${task.completed || ''}" placeholder="Enter completed" min="0">
      
      <label>Start Date:</label>
      <input type="date" value="${task.startDate || ''}" ${isNew ? '' : 'disabled'}>
      
      <label>End Date:</label>
      <input type="date" value="${task.endDate || ''}" ${isNew ? '' : 'disabled'}>
      
      <button class="update-progress-btn">Update Progress</button>
    `;
    taskItem.appendChild(inputContainer);

    // Add progress bar
    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'task-progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'task-progress-bar';
    progressBar.style.width = `${(task.completed / task.total) * 100 || 0}%`;
    progressBarContainer.appendChild(progressBar);
    taskItem.appendChild(progressBarContainer);

    // Event listener for updating progress
    const updateButton = inputContainer.querySelector('.update-progress-btn');
    updateButton.addEventListener('click', () => {
      const totalInput = inputContainer.querySelector('input:nth-of-type(1)');
      const completedInput = inputContainer.querySelector('input:nth-of-type(2)');
      const startDateInput = inputContainer.querySelector('input:nth-of-type(3)');
      const endDateInput = inputContainer.querySelector('input:nth-of-type(4)');

      // Update task values
      const total = parseInt(totalInput.value, 10) || 0;
      const completed = parseInt(completedInput.value, 10) || 0;
      const startDate = startDateInput.value;
      const endDate = endDateInput.value;

      if (total > 0 && completed >= 0 && completed <= total && startDate && endDate) {
        task.total = total;
        task.completed = completed;
        task.startDate = startDate;
        task.endDate = endDate;
        saveToLocalStorage(); // Save updated tasks to localStorage

        // Update progress bar and status
        const progress = (task.completed / task.total) * 100 || 0;
        progressBar.style.width = `${progress}%`;

        if (task.completed === task.total) {
          taskStatus.textContent = 'Task Completed';
          progressBar.style.backgroundColor = '#4caf50';
        } else {
          taskStatus.textContent = `${Math.round(progress)}% Completed`;
          progressBar.style.backgroundColor = '#4caf50';
        }
      } else {
        alert('Please enter valid Total, Completed, Start Date, and End Date values.');
      }
    });

    // Add task item to the list
    taskList.appendChild(taskItem);
  }

  // Event listener for adding tasks
  addTaskBtn.addEventListener('click', () => {
    const taskName = taskInput.value.trim();
    if (taskName) {
      const newTask = {
        name: taskName,
        completed: 0,
        total: 0,
        startDate: null,
        endDate: null,
      };
      tasks.push(newTask);
      saveToLocalStorage(); // Save tasks after adding
      renderTask(newTask, true); // Render the task as editable
      taskInput.value = ''; // Clear input after adding
    } else {
      alert('Task name cannot be empty.');
    }
  });

  // Load tasks on page load
  loadFromLocalStorage();
});
