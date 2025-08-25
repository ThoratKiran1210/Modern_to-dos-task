let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const dateInput = document.getElementById("taskDate");
const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);
dateInput.value = today;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");
  const date = dateInput.value;
  const text = input.value.trim();
  if (!text) {
    alert("Please enter a task.");
    return;
  }

  const selectedDate = new Date(date);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < currentDate) {
    alert("You cannot select a past date!");
    return;
  }

  tasks.push({ id: Date.now(), text, date, completed: false });
  saveTasks();
  input.value = "";
  dateInput.value = today;
  renderTasks(currentFilter);
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks(currentFilter);
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks(currentFilter);
}

function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task.completed) return;
  const newText = prompt("Edit your task:", task.text);
  if (!newText) return;
  tasks = tasks.map((t) => (t.id === id ? { ...t, text: newText } : t));
  saveTasks();
  renderTasks(currentFilter);
}

function clearCompletedTasks() {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderTasks(currentFilter);
}

function clearCompletedTasksTab() {
  currentFilter = "completed";
  document
    .querySelectorAll(".tab")
    .forEach((btn) => btn.classList.remove("active"));
  document.querySelector("#clearCompletedTab").classList.add("active");
  clearCompletedTasks();
}

function filterTasks(filter, element) {
  currentFilter = filter;
  document
    .querySelectorAll(".tab")
    .forEach((btn) => btn.classList.remove("active"));
  element.classList.add("active");
  renderTasks(filter);
}

function renderTasks(filter = "all") {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filtered = tasks;
  if (filter === "active") filtered = tasks.filter((t) => !t.completed);
  if (filter === "completed") filtered = tasks.filter((t) => t.completed);

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    let actionsHTML = "";
    if (task.completed && filter === "completed") {
      actionsHTML = `<span class="status-badge">Completed</span> <button class="delete" onclick="deleteTask(${task.id})">🗑</button>`;
    } else if (!task.completed) {
      actionsHTML = `<button class="edit" onclick="editTask(${task.id})">✏</button> <button class="delete" onclick="deleteTask(${task.id})">🗑</button>`;
    } else {
      actionsHTML = `<button class="delete" onclick="deleteTask(${task.id})">🗑</button>`;
    }

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${
          task.completed ? "checked" : ""
        } onchange="toggleTask(${task.id})">
        <div class="task-details">
          <span class="task-text">${task.text}</span>
          <span class="task-date">${task.date}</span>
        </div>
      </div>
      <div class="actions">${actionsHTML}</div>
    `;
    list.appendChild(li);
  });

  document.getElementById("total").innerText = tasks.length;
  document.getElementById("active").innerText = tasks.filter(
    (t) => !t.completed
  ).length;
  document.getElementById("completed").innerText = tasks.filter(
    (t) => t.completed
  ).length;
}

renderTasks();

// Snow generation
function createSnowflake() {
  const snow = document.createElement("div");
  snow.classList.add("snowflake");
  snow.style.width = Math.random() * 8 + 2 + "px";
  snow.style.height = snow.style.width;
  snow.style.left = Math.random() * window.innerWidth + "px";
  snow.style.animationDuration = Math.random() * 5 + 5 + "s";
  document.body.appendChild(snow);
  setTimeout(() => snow.remove(), 10000);
}
setInterval(createSnowflake, 200);
