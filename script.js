document.addEventListener('DOMContentLoaded', () => {
    // Helper to get celestial object positions
    function getCelestialObjectPosition(type) {
        const canvas = document.getElementById('starfield');
        // Ensure celestialObjects is accessible globally from stars.js
        if (!canvas || typeof window.celestialObjects === 'undefined') return null;

        const obj = window.celestialObjects.find(o => o.type === type);
        if (!obj) return null;

        // Get canvas position on screen
        const canvasRect = canvas.getBoundingClientRect();

        // Return current position relative to viewport
        return {
            x: canvasRect.left + obj.x,
            y: canvasRect.top + obj.y
        };
    }

    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const todoList = document.getElementById('todoList');
    const taskCategory = document.getElementById('taskCategory');
    const personalCountElement = document.getElementById('personalCount');
    const businessCountElement = document.getElementById('businessCount');
    const donePercentageElement = document.getElementById('donePercentage');
    const filterCategory = document.getElementById('filterCategory');

    // Function to save tasks to localStorage
    function saveTasks() {
        const tasks = [];
        todoList.querySelectorAll('li').forEach(item => {
            const taskText = item.querySelector('.task-title').textContent;
            const category = item.dataset.category;
            const isCompleted = item.classList.contains('completed');
            tasks.push({ text: taskText, category: category, completed: isCompleted });
        });
        localStorage.setItem('todos', JSON.stringify(tasks));
    }

    // Function to update task counters and done percentage
    function updateCounters() {
        let personalTotal = 0;
        let businessTotal = 0;
        let personalCompleted = 0;
        let businessCompleted = 0;

        todoList.querySelectorAll('li').forEach(item => {
            const category = item.dataset.category;
            const isCompleted = item.classList.contains('completed');

            if (category === 'Personal') {
                personalTotal++;
                if (isCompleted) personalCompleted++;
            } else if (category === 'Business') {
                businessTotal++;
                if (isCompleted) businessCompleted++;
            }
        });

        const totalTasks = personalTotal + businessTotal;
        const totalCompleted = totalTasks > 0 ? personalCompleted + businessCompleted : 0;
        const donePercentage = totalTasks > 0 ? Math.floor((totalCompleted / totalTasks) * 100) : 0;

        personalCountElement.textContent = `${personalTotal} Personal`;
        businessCountElement.textContent = `${businessTotal} Business`;
        donePercentageElement.textContent = `${donePercentage}% done`;
    }

    // Function to filter tasks based on selected category
    function filterTasks() {
        const selectedCategory = filterCategory.value;
        todoList.querySelectorAll('li').forEach(item => {
            const category = item.dataset.category;
            if (selectedCategory === 'All' || category === selectedCategory) {
                item.style.display = 'flex'; // Show item
            } else {
                item.style.display = 'none'; // Hide item
            }
        });
    }

    // Function to create a task item (used by both addTask and loadTasks)
    function createTaskElement(taskText, category, isCompleted) {
        const listItem = document.createElement('li');
        listItem.dataset.category = category;
        if (isCompleted) {
            listItem.classList.add('completed');
        }
        listItem.innerHTML = `
            <label class="checkbox-container">
                <input type="checkbox" ${isCompleted ? 'checked' : ''}>
                <span class="checkmark"></span>
            </label>
            <div class="task-icon-wrapper">
                <!-- Icon will go here -->
            </div>
            <div class="task-content">
                <span class="task-title">${taskText}</span>
                <span class="task-description"></span>
            </div>
            <div class="task-meta-actions">
                <span class="task-category">${category}</span>
                <span class="task-time"></span>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // Add to the list (completed tasks at the bottom)
        if (isCompleted) {
            todoList.appendChild(listItem);
        } else {
            todoList.prepend(listItem);
        }

        // Add event listener to the checkbox
        const checkbox = listItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                // Apply completed class immediately
                listItem.classList.add('completed');
                todoList.appendChild(listItem); // Move to bottom of list

                // Black Hole animation for completion
                const blackHolePos = getCelestialObjectPosition('blackHole');
                if (blackHolePos) {
                    const listItemRect = listItem.getBoundingClientRect();
                    const tempItem = listItem.cloneNode(true);
                    tempItem.style.position = 'fixed';
                    tempItem.style.left = listItemRect.left + 'px';
                    tempItem.style.top = listItemRect.top + 'px';
                    tempItem.style.width = listItemRect.width + 'px';
                    tempItem.style.height = listItemRect.height + 'px';
                    tempItem.style.zIndex = '1000';
                    tempItem.style.transition = 'all 1s ease-in-out';
                    tempItem.style.opacity = '1';
                    tempItem.style.transform = 'scale(1)';
                    document.body.appendChild(tempItem);

                    // Animate to black hole
                    setTimeout(() => {
                        tempItem.style.left = blackHolePos.x + 'px';
                        tempItem.style.top = blackHolePos.y + 'px';
                        tempItem.style.opacity = '0';
                        tempItem.style.transform = 'scale(0.1)';
                    }, 10); // Small delay to ensure transition applies

                    setTimeout(() => {
                        if (tempItem.parentNode) {
                            tempItem.parentNode.removeChild(tempItem);
                        }
                        // Original item remains in list, just update counts and save
                        updateCounters();
                        saveTasks();
                        filterTasks();
                    }, 1000); // Match transition duration
                } else {
                    // Fallback if black hole position not found
                    updateCounters();
                    saveTasks();
                    filterTasks();
                }
            } else {
                // Revert completion
                listItem.classList.remove('completed');
                todoList.prepend(listItem); // Move to top of list
                updateCounters();
                saveTasks();
                filterTasks();
            }
        });

        // Add event listener to the delete button
        const deleteButton = listItem.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
            if (listItem.parentNode) {
                listItem.parentNode.removeChild(listItem);
            }
            updateCounters();
            saveTasks(); // Save changes
            filterTasks();
        });

        return listItem;
    }

    // Function to add a new task with White Hole animation
    function addTask() {
        const taskText = taskInput.value.trim();
        const category = taskCategory.value;

        if (taskText !== '') {
            const whiteHolePos = getCelestialObjectPosition('whiteHole');
            if (whiteHolePos) {
                // Create a temporary element for animation
                const tempItem = document.createElement('li');
                tempItem.dataset.category = category;
                tempItem.innerHTML = `
                    <label class="checkbox-container">
                        <input type="checkbox">
                        <span class="checkmark"></span>
                    </label>
                    <div class="task-icon-wrapper"></div>
                    <div class="task-content">
                        <span class="task-title">${taskText}</span>
                        <span class="task-description"></span>
                    </div>
                    <div class="task-meta-actions">
                        <span class="task-category">${category}</span>
                        <span class="task-time"></span>
                        <button class="delete-btn">Delete</button>
                    </div>
                `;
                tempItem.style.position = 'fixed';
                tempItem.style.left = whiteHolePos.x + 'px';
                tempItem.style.top = whiteHolePos.y + 'px';
                tempItem.style.opacity = '0';
                tempItem.style.transform = 'scale(0.1)';
                tempItem.style.zIndex = '1000';
                tempItem.style.transition = 'all 1s ease-out'; // Smooth transition

                document.body.appendChild(tempItem);

                // Force reflow to ensure initial styles are applied before transition
                tempItem.offsetHeight;

                // Animate to target position
                setTimeout(() => {
                    // Temporarily add to DOM to get target position
                    const dummyItem = createTaskElement(taskText, category, false);
                    todoList.prepend(dummyItem);
                    const targetRect = dummyItem.getBoundingClientRect();
                    todoList.removeChild(dummyItem); // Remove dummy

                    tempItem.style.left = targetRect.left + 'px';
                    tempItem.style.top = targetRect.top + 'px';
                    tempItem.style.opacity = '1';
                    tempItem.style.transform = 'scale(1)';
                }, 10); // Small delay to ensure transition applies

                // After animation, add the actual task
                setTimeout(() => {
                    if (tempItem.parentNode) {
                        tempItem.parentNode.removeChild(tempItem);
                    }
                    createTaskElement(taskText, category, false);
                    taskInput.value = '';
                    updateCounters();
                    saveTasks();
                    filterTasks();
                }, 1000); // Match transition duration
            } else {
                // Fallback if white hole position not found
                createTaskElement(taskText, category, false);
                taskInput.value = '';
                updateCounters();
                saveTasks();
                filterTasks();
            }
        }
    }

    // Function to load tasks from localStorage
    function loadTasks() {
        const savedTasks = localStorage.getItem('todos');
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            tasks.forEach(task => {
                createTaskElement(task.text, task.category, task.completed);
            });
        }
    }

    // Add task when Add button is clicked
    addButton.addEventListener('click', addTask);

    // Add task when Enter key is pressed in the input field
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Add event listener to filter dropdown
    filterCategory.addEventListener('change', filterTasks);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered: ', registration);
                })
                .catch(error => {
                    console.error('Service Worker registration failed: ', error);
                });
        });
    }

    // Display current date
    function displayCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }

    // Initial setup
    displayCurrentDate();
    loadTasks(); // Load tasks from localStorage
    updateCounters();
    filterTasks();
});