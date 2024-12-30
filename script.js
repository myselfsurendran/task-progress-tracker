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
  function renderTask(taskName) {
    // Create task item container
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';

    // Add task name and status
    const taskNameElem = document.createElement('p');
    const taskStatus = document.createElement('span');
    taskStatus.className = 'task-status';
    taskNameElem.textContent = taskName;
    taskNameElem.appendChild(taskStatus);
    taskItem.appendChild(taskNameElem);

    // Add inputs for Total, Completed, Start Date, and End Date
    const inputContainer = document.createElement('div');

    // Group Total and Completed Task Value in one line
    const row1 = document.createElement('div');
    row1.className = 'input-row'; // Added flexbox class for alignment
    row1.innerHTML = `
      <label for="total-input">Total Task Value:</label>
      <input type="number" id="total-input" placeholder="Enter total" min="0">
      
      <label for="completed-input">Completed Task Value:</label>
      <input type="number" id="completed-input" placeholder="Enter completed" min="0">
    `;

    // Group Start Date and End Date in another line
    const row2 = document.createElement('div');
    row2.className = 'input-row'; // Added flexbox class for alignment
    row2.innerHTML = `
      <label for="start-date-input">Start Date:</label>
      <input type="date" id="start-date-input">
      
      <label for="end-date-input">End Date:</label>
      <input type="date" id="end-date-input">
    `;

    // Add the rows to the container
    inputContainer.appendChild(row1);
    inputContainer.appendChild(row2);

    // Add update button
    const updateButton = document.createElement('button');
    updateButton.className = 'update-progress-btn';
    updateButton.textContent = 'Update Progress';
    inputContainer.appendChild(updateButton);

    taskItem.appendChild(inputContainer);

    // Add progress bar
    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'task-progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'task-progress-bar';
    progressBarContainer.appendChild(progressBar);

    const progressText = document.createElement('span');
    progressText.className = 'progress-text';
    progressBar.appendChild(progressText);

    taskItem.appendChild(progressBarContainer);

    // Event listener for updating progress
    updateButton.addEventListener('click', () => {
      const total = parseInt(inputContainer.querySelector('#total-input').value, 10) || 0;
      const completed = parseInt(inputContainer.querySelector('#completed-input').value, 10) || 0;
      const startDate = inputContainer.querySelector('#start-date-input').value;
      const endDate = inputContainer.querySelector('#end-date-input').value;

      if (total > 0 && completed >= 0 && completed <= total && startDate && endDate) {
        // After initial input, set the fields to readonly
        const totalInput = inputContainer.querySelector('#total-input');
        const startDateInput = inputContainer.querySelector('#start-date-input');
        const endDateInput = inputContainer.querySelector('#end-date-input');

        totalInput.readOnly = true;
        startDateInput.readOnly = true;
        endDateInput.readOnly = true;

        // Only allow the "completed" input to remain editable
        const completedInput = inputContainer.querySelector('#completed-input');
        completedInput.disabled = false;

        // Calculate the total number of days
        const totalDays = calculateDaysBetweenDates(startDate, endDate);

        // Calculate the number of days elapsed
        const currentDate = new Date();
        const elapsedDays = calculateDaysBetweenDates(startDate, currentDate);

        // Calculate the progress per day
        const progressPerDay = 100 / totalDays;

        // Calculate the expected progress
        const expectedProgress = (progressPerDay * elapsedDays);

        // Calculate task status
        let taskStatusText = `${Math.round((completed / total) * 100)}% Completed`;
        let delayText = '';
        let progressBarColor = '#4caf50';  // Green by default
        let taskTitleColor = '#333'; // Default title color
        if (elapsedDays > totalDays) {
          taskStatusText = 'Deadline crossed';
          progressBarColor = '#f44336'; // Red for deadline crossed
          taskTitleColor = '#f44336'; // Red for title
        } else if (expectedProgress > (completed / total) * 100) {
          // Calculate the delay
          const expectedCompletedValue = (progressPerDay * elapsedDays / 100) * total;
          const delayInUnits = expectedCompletedValue - completed;
          const delayInDays = Math.ceil(delayInUnits / (total / totalDays));

          delayText = ` --> Delayed by ${delayInDays} day(s)`;
          progressBarColor = '#ffeb3b'; // Yellow for delayed task
          taskTitleColor = '#ffeb3b'; // Yellow for title
        }

        // Update progress bar
        const progress = (completed / total) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`; // Show the percentage inside the bar

        // Update progress bar color and task title color
        progressBar.style.backgroundColor = progressBarColor;
        taskNameElem.style.color = taskTitleColor; // Change the color of the task title

        taskStatus.textContent = ` - ${Math.round(progress)}% Completed${delayText}`;
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
      renderTask(taskName);
      taskInput.value = ''; // Clear input after adding
    } else {
      alert('Task name cannot be empty.');
    }
  });
});

