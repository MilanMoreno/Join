let tasks = [];
let priorityHighDates = [];
let dateToday;
let closest;
let formatDate = { year: "numeric", month: "long", day: "numeric" };
let user; // Hier wird 'users' zu 'user' geändert
let number = 15220;

async function init() {
  await loadTasks();
  loadLocalStorage(); // Tippfehler korrigiert: 'laodLocalStorage' zu 'loadLocalStorage'
  sortDates();
  showHTML();
  summaryBgMenu();
}

function loadLocalStorage() {
  let userAsText = localStorage.getItem("users"); // 'users' zu 'user'

  if (userAsText) {
    user = JSON.parse(userAsText); // 'users' zu 'user'
  }
}

async function loadTasks() {
  tasks = [];
  let task = await getData("tasks");
  let ids = Object.keys(task || []);
  for (let i = 0; i < ids.length; i++) {
    let id = ids[i];
    let allTasks = task[id];
    tasks.push(allTasks);
  }
}

function sortDates() {
  let priorityHigh = tasks.filter((t) => t["priorityHigh"] == true);
  for (let i = 0; i < priorityHigh.length; i++) {
    priorityHighDates.push(priorityHigh[i]["date"]);
  }

  [closest] = priorityHighDates.sort((a, b) => {
    const [aDate, bDate] = [a, b].map((d) => Math.abs(new Date(d) - dateToday));
    return aDate - bDate;
  });
}

function showHTML() {
  let todo = tasks.filter((t) => t["phases"] == "To Do");
  let done = tasks.filter((t) => t["phases"] == "Done");
  let priorityHigh = tasks.filter((t) => t["prio"] == "Urgent");
  let inprogress = tasks.filter((t) => t["phases"] == "In progress");
  let awaitFeedback = tasks.filter((t) => t["phases"] == "Await feedback");

  document.getElementById("to-do").innerHTML = `${todo.length}`;
  document.getElementById("done").innerHTML = `${done.length}`;
  document.getElementById("priority-high").innerHTML = `${priorityHigh.length}`;
  document.getElementById("deadline").innerHTML = `${checkIfPriorityHighArray()}`;
  document.getElementById("tasks").innerHTML = `${tasks.length}`;
  document.getElementById("task-in-progress").innerHTML = `${inprogress.length}`;
  document.getElementById("awaiting-feedback").innerHTML = `${awaitFeedback.length}`;
  document.getElementById("greeting-text").innerHTML = `${checkIfGuest()}`;
}

function checkIfPriorityHighArray() {
  if (priorityHighDates.length === 0) {
    return `No urgent to-dos`;
  } else {
    dateToday = new Date(closest);
    return dateToday.toLocaleDateString("en-US", formatDate);
  }
}

function checkIfGuest() {
  if (users && users["name"] === "Guest") { // 'users' zu 'user'
    return `<h2>Good morning</h2>`;
  } else {
    return `
      <h2>Good morning,</h2>
      <h1>${users["name"]}</h1> 
    `;
  }
}

function changePencilImg() {
  document
    .getElementById("pencil-img")
    .setAttribute("src", "./assets/img/pencil-white.png");
}

function resetPencilImg() {
  document
    .getElementById("pencil-img")
    .setAttribute("src", "./assets/img/pencil-darkblue.png");
}

function changeCheckImg() {
  document
    .getElementById("check-img")
    .setAttribute("src", "./imgs/icon_checkbox_unchecked.png");
}

function resetCheckImg() {
  document
    .getElementById("check-img")
    .setAttribute("src", "./assets/imgs/check.png");
}

function loadBoardPage() {
  window.location.href = "https://creative33-9f884-default-rtdb.firebaseio.com/";
}
