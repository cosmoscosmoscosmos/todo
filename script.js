document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const todoList = document.getElementById('todoList');
    const completedList = document.getElementById('completedList');
    const colorButtons = document.querySelectorAll('.color-btn'); // 색상 버튼 선택

    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText !== '') {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${taskText}</span>
                <div>
                    <button class="complete-btn">Done</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            todoList.appendChild(listItem);
            taskInput.value = ''; // Clear the input field

            // Add event listener to the complete button
            const completeButton = listItem.querySelector('.complete-btn');
            completeButton.addEventListener('click', () => {
                listItem.classList.toggle('completed');
                if (listItem.classList.contains('completed')) {
                    completedList.appendChild(listItem);
                    completeButton.textContent = 'Undo';
                } else {
                    todoList.appendChild(listItem);
                    completeButton.textContent = 'Done';
                }
            });

            // Add event listener to the delete button
            const deleteButton = listItem.querySelector('.delete-btn');
            deleteButton.addEventListener('click', () => {
                if (listItem.parentNode) {
                    listItem.parentNode.removeChild(listItem);
                }
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

    // Add event listeners to color buttons
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedColor = button.dataset.color;
            document.body.style.backgroundColor = selectedColor;
        });
    });

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
});
