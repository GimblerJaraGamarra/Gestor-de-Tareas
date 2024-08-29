var idParentOrigin = "";
var idElement = "";
var tasks = [];
var idTaskUpdate = "";

var tasksFromStorage = localStorage.getItem("tasks");
if (tasksFromStorage) {
  tasks = JSON.parse(tasksFromStorage);
  setTaskToProgressPanel();
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    addTaskToList(taskText);
    taskInput.value = "";
  }
}

function updateTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    updateTaskById(idTaskUpdate, taskText);
    taskInput.value = "";

    const addButton = document.getElementById("btnAdd");
    addButton.style.display = "block";

    const editButton = document.getElementById("btnEdit");
    editButton.style.display = "none";
  }
}

function addTaskToList(taskMesaje) {
  var taskData = {
    id: generateUUID(),
    task: taskMesaje,
    status: "pending",
  };

  tasks.push(taskData);
  setTaskToProgressPanel();
}

function updateStatusTaskById(taskId, newStatus) {
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    task.status = newStatus;
  }
  setTaskToProgressPanel();
}

function updateTaskById(taskId, message) {
  var task = tasks.find((task) => task.id === taskId);
  if (task) {
    task.task = message;
  }
  setTaskToProgressPanel();
}

function deleteTaskById(taskId) {
  const index = tasks.findIndex((task) => task.id === taskId);
  if (index !== -1) {
    tasks.splice(index, 1);
  }
  console.log(taskId);
  setTaskToProgressPanel();
}

function setTaskToProgressPanel() {
  const pedingPanel = document.getElementById("pending-tasks");
  const progressPanel = document.getElementById("in-progress-tasks");
  const reviewPanel = document.getElementById("in-review-tasks");
  const donePanel = document.getElementById("done-tasks");

  pedingPanel.innerHTML = "";
  progressPanel.innerHTML = "";
  reviewPanel.innerHTML = "";
  donePanel.innerHTML = "";

  for (let index = 0; index < tasks.length; index++) {
    const taskData = tasks[index];

    switch (taskData.status) {
      case "pending":
        createTaskElement(taskData, pedingPanel);
        break;

      case "progress":
        createTaskElement(taskData, progressPanel);
        break;

      case "review":
        createTaskElement(taskData, reviewPanel);
        break;

      case "done":
        createTaskElement(taskData, donePanel);
        break;

      default:
        break;
    }
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTaskElement(taskData, progressPanel) {
  const container = document.createElement("div");
  container.classList.add("task");
  container.id = taskData.id;

  const message = document.createElement("p");
  message.textContent = taskData.task;

  const options = document.createElement("div");

  const editIcon = document.createElement("i");
  editIcon.className = "fa-regular fa-pen-to-square";
  editIcon.style.marginRight = "5px";
  editIcon.style.cursor = "pointer";
  editIcon.addEventListener("click", () => {
    enableEditButton(taskData);
  });
  options.appendChild(editIcon);

  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fa-solid fa-trash";
  deleteIcon.style.cursor = "pointer";
  deleteIcon.addEventListener("click", () => {
    deleteTaskById(taskData.id);
  });
  if (taskData.status != "done") {
    deleteIcon.style.display = "none";
  }
  options.appendChild(deleteIcon);

  container.appendChild(message);
  container.appendChild(options);

  container.draggable = true;
  container.addEventListener("dragstart", dragStart);
  container.addEventListener("dragend", dragEnd);

  progressPanel.appendChild(container);
}

function enableEditButton(taskData) {
  const taskInput = document.getElementById("taskInput");
  taskInput.value = taskData.task;

  const addButton = document.getElementById("btnAdd");
  addButton.style.display = "none";

  const editButton = document.getElementById("btnEdit");
  editButton.style.display = "block";

  idTaskUpdate = taskData.id;
}

function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.textContent);
  event.dataTransfer.effectAllowed = "move";
  setTimeout(() => event.target.classList.add("hidden"), 0);
  var parent = event.target.parentNode;
  idParentOrigin = parent.id;
  idElement = event.target.id;
}

function dragEnd(event) {
  event.target.classList.remove("hidden");
}

function allowDrop(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function drop(event) {
  event.preventDefault();

  const idParentDestination = event.target.classList.contains("task-list")
    ? event.target.id
    : event.target.closest(".task-list").id;

  if (idParentDestination != idParentOrigin) {
    console.log(idParentDestination);
    console.log(idElement);
    switch (idParentDestination) {
      case "pending-tasks":
        updateStatusTaskById(idElement, "pending");
        break;
      case "in-progress-tasks":
        updateStatusTaskById(idElement, "progress");
        break;
      case "in-review-tasks":
        updateStatusTaskById(idElement, "review");
        break;
      case "done-tasks":
        updateStatusTaskById(idElement, "done");
        break;

      default:
        break;
    }
  }
}

document.querySelectorAll(".task-list").forEach((taskList) => {
  taskList.addEventListener("dragover", allowDrop);
  taskList.addEventListener("drop", drop);
});

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
