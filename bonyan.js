const addBtns = document.querySelectorAll(".add");
let deleteBtns = document.querySelectorAll(".delete");
let updateBtns = document.querySelectorAll(".update");
const upComingList = document.querySelectorAll(".up-coming");
const inProgressList = document.querySelectorAll(".in-Progress");
const finishedList = document.querySelectorAll(".finished-l");

// empty();

let taskCounter = {
  "up-Coming": 0,
  "in-Progress": 0,
  "finished-l": 0,
};

// set the task to be global
let storedTasks = JSON.parse(localStorage.getItem("tasks"))
  ? JSON.parse(localStorage.getItem("tasks"))
  : [];


console.log(storedTasks);
let upcoming = storedTasks.filter((task) => task.parent === "up-Coming");
// onStarting or on reloading the page the page we should load all tasks from local storage
//* loadTasks();
loadStorage();

// then we should implement this
// loadTask should query all the task which is already exist
// the existence of the tasks came from storeTask() function or deleteTask() function
//* storeTask() , deleteTask()
// the add task function should store the task in its column
// storetask() should be called wen ever add btn clicked
// or when ever the drag,drop finished as this is mean new tasks for every column
// delete task() should be called when delete btn clicked and when drag,drop finished

// console.log(taskCounter["up-coming"] + 1+1)

// setting up the add items btn
addBtns.forEach((addBtn) => {
  // deleteBtns = document.querySelectorAll(".delete");
  addBtn.addEventListener("click", function createItem(e) {
    let columnName = this.parentNode.childNodes[3].className.split(" ")[1];
    let content = "task" + taskCounter[columnName];
    let taskId = Date.now();

    // the create create and attach delete listener
    createItemElement(taskId, content, columnName);

    taskCounter[e.target.parentNode.childNodes[3].className.split(" ")[1]] += 1;

    storeTask(taskId, content, columnName);
    attachDragDrop();
  });
});

function attachDragDrop() {
  let items = document.querySelectorAll(".item");

  items.forEach((item) => {
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragover", handleDragOver);
    item.addEventListener("dragenter", handleDragEnter);
    item.addEventListener("dragleave", handleDragLeave);
    item.addEventListener("dragend", (e) => {
      handleDragEnd(e.target);
      items.forEach((item) => {
        item.classList.remove("over");
      });
    });

    item.addEventListener("drop", handleDrop);
  });
}

// function empty() {
//   let lists = document.querySelectorAll("h2");

//   lists.forEach((list) => {
//     // item.addEventListener("dragstart", handleDragStart);
//     // item.addEventListener("dragover", handleDragOver);
//     list.addEventListener("dragenter", handleEmptyDragEnter);
//     list.addEventListener("dragleave", handleEmptyDragLeave);
//     list.addEventListener("dragend", (e) => {
//       handleDragEnd(e.target);
//       list.forEach((list) => {
//         list.classList.remove("over");
//       });
//     });

//     list.addEventListener("drop", handleDrop);
//   });
// }

let draggedEl = document.createElement("div");
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

// function handleEmptyDragEnter(e) {
//   this.style.opacity = "0";
// }

// function handleEmptyDragLeave(e) {
//   this.style.border = "1";
// }

function handleDrop(e) {
  e.stopPropagation();
  console.log(draggedEl);
  if (draggedEl !== this || draggedEl !== undefined) {
    // draggedEl.innerHTML = this;
    let newColumn = this.parentNode.className.split(" ")[1];
    let droppedId = e.dataTransfer.getData("text/html");
    let secret = document.getElementById(droppedId);
    this.after(secret);

    changeStoredColumn(droppedId, newColumn);
  }
  attachDragDrop();
  return false;
}

// !!!!!!  ID should be unique
// const taskId = Date.now(); //:)ULTRA Unique ID for each task

//? local storage logic:
// // get the items form storage as an array of objects
// let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// // make the array of object available to be stored in local storage
// localStorage.setItem("tasks", JSON.stringify(tasks));
// //filter the deleted tasks
// tasks = tasks.filter((task) => task.id !== taskId);

function storeTask(id, content, columnName) {
  const newTask = { id: id, title: content, parent: columnName };
  storedTasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(storedTasks));
}
function updateTask(id, content) {
  // let updatedTask = storedTasks.filter((task) => task.id == id);
  storedTasks.forEach((task) => {
    if (task.id == id) {
      task.title = content;
      console.log(true);
      localStorage.setItem("tasks", JSON.stringify(storedTasks));
      return;
    }
  });
}

function removeTask(id) {
  storedTasks = storedTasks.filter((task) => task.id != id);
  console.log(id);
  console.log(storedTasks);
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

function loadStorage() {
  let upcomingTasks = storedTasks.filter((task) => task.parent === "up-Coming");
  let inProgressTasks = storedTasks.filter(
    (task) => task.parent === "in-Progress"
  );
  let finishedTasks = storedTasks.filter(
    (task) => task.parent === "finished-l"
  );

  upcomingTasks.forEach((task) => {
    createItemElement(task.id, task.title, task.parent);
  });
  inProgressTasks.forEach((task) => {
    createItemElement(task.id, task.title, task.parent);
  });
  finishedTasks.forEach((task) => {
    createItemElement(task.id, task.title, task.parent);
  });

  attachDragDrop();
}

function createItemElement(id, content, columnName) {
  let column = document.querySelector("." + columnName);
  let item = document.createElement("div");
  item.className = "item";
  item.id = id;
  item.draggable = true;

  item.innerHTML = `<input type="text" value = ${content} />
  <button class="delete">D</button>
  <button class="update">U</button>`;

  column.append(item);
  deleteItem();
  updateItem(id);
}

function deleteItem() {
  deleteBtns = document.querySelectorAll(".delete");
  // setting up the Delete items btn
  deleteBtns.forEach((deleteBtn) => {
    // deleteBtns = document.querySelectorAll(".delete");
    deleteBtn.addEventListener("click", (e) => {
      // console.log(e.target.parentNode.id)
      removeTask(e.target.parentNode.id);
      e.target.parentNode.remove();
    });
  });
}

function updateItem(id) {
  updateBtns = document.querySelectorAll(".update");
  updateBtns.forEach((updateBtn) => {
    updateBtn.addEventListener("click", (e) => {
      console.log("??");
      updateTask(
        e.target.parentNode.id,
        e.target.parentNode.childNodes[0].value.trim()
      );
    });
  });
}
