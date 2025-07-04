document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const todoList = document.getElementById('todoList');
    const taskCategory = document.getElementById('taskCategory'); // 새로 추가
    const personalCountElement = document.getElementById('personalCount'); // 새로 추가
    const businessCountElement = document.getElementById('businessCount'); // 새로 추가
    const donePercentageElement = document.getElementById('donePercentage'); // 새로 추가
    const colorButtons = document.querySelectorAll('.color-btn'); // 색상 버튼 선택

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
        const totalCompleted = personalCompleted + businessCompleted;
        const donePercentage = totalTasks > 0 ? Math.floor((totalCompleted / totalTasks) * 100) : 0;

        personalCountElement.textContent = `${personalTotal} Personal`;
        businessCountElement.textContent = `${businessTotal} Business`;
        donePercentageElement.textContent = `${donePercentage}% done`;
    }

    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        const category = taskCategory.value; // 선택된 카테고리 가져오기

        if (taskText !== '') {
            const listItem = document.createElement('li');
            listItem.dataset.category = category; // 카테고리 데이터 속성 추가
            listItem.innerHTML = `
                <label class="checkbox-container">
                    <input type="checkbox">
                    <span class="checkmark"></span>
                </label>
                <div class="task-icon-wrapper">
                    <!-- Icon will go here -->
                </div>
                <div class="task-content">
                    <span class="task-title">${taskText}</span>
                    <span class="task-description"></span> <!-- 설명 플레이스홀더 -->
                </div>
                <div class="task-meta-actions">
                    <span class="task-category">${category}</span> <!-- 카테고리 표시 -->
                    <span class="task-time"></span> <!-- 시간 플레이스홀더 -->
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            todoList.appendChild(listItem);
            taskInput.value = ''; // Clear the input field

            // Add event listener to the checkbox
            const checkbox = listItem.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                listItem.classList.toggle('completed');
                if (checkbox.checked) {
                    todoList.appendChild(listItem); // 체크 시 맨 아래로 이동
                } else {
                    todoList.prepend(listItem); // 체크 해제 시 맨 위로 이동
                }
                updateCounters(); // 카운터 업데이트
            });

            // Add event listener to the delete button
            const deleteButton = listItem.querySelector('.delete-btn');
            deleteButton.addEventListener('click', () => {
                if (listItem.parentNode) {
                    listItem.parentNode.removeChild(listItem);
                }
                updateCounters(); // 카운터 업데이트
            });
            updateCounters(); // 새 할 일 추가 시 카운터 업데이트
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

    // Display current date
    function displayCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
    displayCurrentDate();
    updateCounters(); // 초기 로드 시 카운터 업데이트
});