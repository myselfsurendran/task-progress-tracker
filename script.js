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

  // Function to calculate the percentage of the task completed on time
  function calculateExpectedProgress(startDate, endDate) {
    const totalDays = calculateDaysBetweenDates(startDate, endDate);
    const today = new Date();
    const daysPassed = calculateDaysBetweenDates(startDate, today);
    
    // Calculate percentage of the task that should be completed by now
    const expectedProgress = Math.round((daysPassed / totalDays) * 100);
    return Math.min(expectedProgress, 100); // Ensure it doesn't exceed 100%
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

    // Add task name in the heading
    const taskNameElem = document.createElement('p');

    // Task name without percentage completion
    taskNameElem.innerHTML = `Task Name - ${task.name}`;
    taskItem.appendChild(taskNameElem);

    // Add status box (just below the task name and above the input fields)
    const taskStatusBox = document.createElement('div');
    taskStatusBox.className = 'task-status-box';
    const expectedProgress = calculateExpectedProgress(task.startDate, task.endDate);
    const currentDate = new Date();
    const taskEndDate = new Date(task.endDate);

    // Set task status and box color
    let progressBarColor = '';
    if (task.completed >= expectedProgress) {
      taskStatusBox.classList.add('on-track');
      taskStatusBox.textContent = 'On Track';
      progressBarColor = '#4caf50'; // Green color for on track
    } else if (taskEndDate < currentDate) {
      taskStatusBox.classList.add('deadline-passed');
      taskStatusBox.textContent = 'Deadline Passed';
      progressBarColor = '#f44336'; // Red color for deadline passed
    } else {
      taskStatusBox.classList.add('delayed');
      taskStatusBox.textContent = 'Delayed';
      progressBarColor = '#ff9800'; // Yellow color for delayed
    }

    taskItem.appendChild(taskStatusBox); // Add status below the task name

    // Add inputs for Total, Completed, Start Date, and End Date
    const inputContainer = document.createElement('div');
    inputContainer.innerHTML = `
      <label>Total Task Value:</label>
      <input type="number" value="${task.total || ''}" placeholder="Enter total" min="0" ${isNew ? '' : 'disabled'}>
      
      <label>Completed Task Value:</label>
      <input type="number" value="${task.completed || ''}" placeholder="Enter completed" min="0">
      
      <label>Planned Start Date:</label>
      <input type="date" value="${task.startDate || ''}" ${isNew ? '' : 'disabled'}>
      
      <label>Planned End Date:</label>
      <input type="date" value="${task.endDate || ''}" ${isNew ? '' : 'disabled'}>
      <br></br>
      <button class="update-progress-btn">Update Progress</button>
    `;
    taskItem.appendChild(inputContainer);

    // Add progress bar container with percentage inside it
    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'task-progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'task-progress-bar';
    progressBar.style.width = `${(task.completed / task.total) * 100 || 0}%`;
    progressBar.style.backgroundColor = progressBarColor; // Set initial color for progress bar
    const percentageText = document.createElement('span');
    percentageText.className = 'progress-bar-text';
    percentageText.innerText = `${(task.completed / task.total) * 100 || 0}% Completed`; // Added "Completed"
    progressBar.appendChild(percentageText);
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

        // Calculate the percentage completed
        task.percentageCompleted = Math.round((task.completed / task.total) * 100);

        saveToLocalStorage(); // Save updated tasks to localStorage

        // Update progress bar and percentage
        progressBar.style.width = `${task.percentageCompleted}%`;
        percentageText.innerText = `${task.percentageCompleted}% Completed`; // Added "Completed" to the text

        // Update task status and progress bar color
        if (task.completed === task.total) {
          taskStatusBox.classList.remove('delayed', 'on-track', 'deadline-passed');
          taskStatusBox.classList.add('on-track');
          taskStatusBox.textContent = 'Task Completed';
          progressBar.style.backgroundColor = '#4caf50'; // Green color for completed task
        } else {
          taskStatusBox.classList.remove('delayed', 'on-track', 'deadline-passed');
          if (task.completed >= expectedProgress) {
            taskStatusBox.classList.add('on-track');
            taskStatusBox.textContent = 'On Track';
            progressBar.style.backgroundColor = '#4caf50'; // Green color for on track
          } else if (taskEndDate < currentDate) {
            taskStatusBox.classList.add('deadline-passed');
            taskStatusBox.textContent = 'Deadline Passed';
            progressBar.style.backgroundColor = '#f44336'; // Red color for deadline passed
          } else {
            taskStatusBox.classList.add('delayed');
            taskStatusBox.textContent = 'Delayed';
            progressBar.style.backgroundColor = '#ff9800'; // Yellow color for delayed
          }
        }

        // Update task heading to show the name only
        taskNameElem.innerHTML = `${task.name}`;
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
      // Create the new task object
      const newTask = {
        name: taskName,
        completed: 0,
        total: 0,
        startDate: null,
        endDate: null,
        percentageCompleted: 0, // New parameter for percentage completion
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

// Function to reset all tasks
function resetTasks() {
  localStorage.removeItem('tasks'); // Clear tasks from localStorage
  tasks = []; // Clear tasks array
  taskList.innerHTML = ''; // Remove all tasks from UI
  location.reload(); // Reload the page
}

// Add event listener to reset button
document.getElementById('reset-tasks-btn').addEventListener('click', resetTasks);
