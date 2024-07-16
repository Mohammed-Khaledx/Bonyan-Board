//*************************************************************** */
// Query selectors for different button types and lists
const addBtns = document.querySelectorAll(".add");
let deleteBtns = document.querySelectorAll(".delete");
let updateBtns = document.querySelectorAll(".update");
const upComingList = document.querySelectorAll(".up-coming");
const inProgressList = document.querySelectorAll(".in-Progress");
const finishedList = document.querySelectorAll(".finished-l");

// Task counters for each column
let taskCounter = {
  "up-Coming": 0,
  "in-Progress": 0,
  "finished-l": 0,
};

// Retrieve stored tasks from localStorage or initialize as an empty array
let storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
console.log(storedTasks);

// Load tasks from localStorage when the page loads
loadStorage();

// Add event listeners to add buttons
addBtns.forEach((addBtn) => {
  addBtn.addEventListener("click", function createItem(e) {
    let columnName = this.parentNode.childNodes[3].className.split(" ")[1];
    let content = "Task " + taskCounter[columnName];
    let taskId = Date.now();

    createItemElement(taskId, content, columnName);
    taskCounter[columnName] += 1;

    storeTask(taskId, content, columnName);
    attachDragDrop();
  });
});

// Attach drag and drop event listeners to items and drop zones
function attachDragDrop() {
  let items = document.querySelectorAll(".item");
  items.forEach((item) => {
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragover", handleDragOver);
    item.addEventListener("dragenter", handleDragEnter);
    item.addEventListener("dragleave", handleDragLeave);
    item.addEventListener("dragend", (e) => {
      handleDragEnd(e.target);
      items.forEach((item) => item.classList.remove("over"));
    });
    item.addEventListener("drop", handleDrop);
  });

  let zones = document.querySelectorAll(".dropZone");
  zones.forEach((list) => {
    list.addEventListener("dragenter", handleEmptyDragEnter);
    list.addEventListener("dragleave", handleEmptyDragLeave);
    list.addEventListener("dragover", handleDragOver);
    list.addEventListener("drop", handleEmptyDrop);
  });
}

// Drag and Drop Event Handlers
function handleDragStart(e) {
  this.style.opacity = "0.3";
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.id);
}

function handleDragEnd(e) {
  e.style.opacity = "1";
}

function handleDragOver(e) {
  e.preventDefault();
  return false;
}

function handleDragEnter(e) {
  this.classList.add("over");
}

function handleDragLeave(e) {
  this.classList.remove("over");
}

function handleEmptyDragEnter(e) {
  this.classList.add("over");
}

function handleEmptyDragLeave(e) {
  this.classList.remove("over");
}

function handleEmptyDrop(e) {
  e.stopPropagation();
  let newColumn = this.parentNode.className.split(" ")[1];
  let droppedId = e.dataTransfer.getData("text/html");
  let taskElement = document.getElementById(droppedId);
  this.after(taskElement);
  this.classList.remove("over");

  changeStoredColumn(droppedId, newColumn);
  return false;
}

function handleDrop(e) {
  e.stopPropagation();
  let newColumn = this.parentNode.className.split(" ")[1];
  let droppedId = e.dataTransfer.getData("text/html");
  let taskElement = document.getElementById(droppedId);
  this.after(taskElement);

  changeStoredColumn(droppedId, newColumn);
  attachDragDrop();

  return false;
}

// Task management functions
function storeTask(id, content, columnName) {
  const newTask = { id: id, title: content, parent: columnName };
  storedTasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(storedTasks));
}

function updateTask(id, content) {
  storedTasks.forEach((task) => {
    if (task.id == id) {
      task.title = content;
      localStorage.setItem("tasks", JSON.stringify(storedTasks));
      return;
    }
  });
}

function removeTask(id) {
  storedTasks = storedTasks.filter((task) => task.id != id);
  localStorage.setItem("tasks", JSON.stringify(storedTasks));
}

function changeStoredColumn(id, columnName) {
  storedTasks.forEach((task) => {
    if (task.id == id) {
      task.parent = columnName;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(storedTasks));
}

// Load tasks from localStorage into their respective columns
function loadStorage() {
  let upcomingTasks = storedTasks.filter((task) => task.parent === "up-Coming");
  let inProgressTasks = storedTasks.filter(
    (task) => task.parent === "in-Progress"
  );
  let finishedTasks = storedTasks.filter(
    (task) => task.parent === "finished-l"
  );

  upcomingTasks.forEach((task) =>
    createItemElement(task.id, task.title, task.parent)
  );
  inProgressTasks.forEach((task) =>
    createItemElement(task.id, task.title, task.parent)
  );
  finishedTasks.forEach((task) =>
    createItemElement(task.id, task.title, task.parent)
  );

  attachDragDrop();
}

// Create task elements and attach them to the DOM
function createItemElement(id, content, columnName) {
  let column = document.querySelector("." + columnName);
  let item = document.createElement("div");
  item.className = "item";
  item.id = id;
  item.draggable = true;

  item.innerHTML = `
    <input type="text" value="${content}" />
    <button class="delete">D</button>
    <button class="update">U</button>
  `;

  column.append(item);
  deleteItem();
  updateItem(id);
}

// Attach event listeners to delete buttons
function deleteItem() {
  deleteBtns = document.querySelectorAll(".delete");
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", (e) => {
      removeTask(e.target.parentNode.id);
      e.target.parentNode.remove();
    });
  });
}

// Attach event listeners to update buttons
function updateItem(id) {
  updateBtns = document.querySelectorAll(".update");
  updateBtns.forEach((updateBtn) => {
    updateBtn.addEventListener("click", (e) => {
      let content = e.target.parentNode.childNodes[1].value.trim();
      updateTask(e.target.parentNode.id, content);
    });
  });
}
