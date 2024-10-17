let BASE_Url = "https://creative33-9f884-default-rtdb.firebaseio.com/task/";


function renderAddTask() {
  let contentSection = document.getElementById("addTaskSide");
  contentSection.innerHTML = "";
  contentSection.innerHTML = addTaskTemplate();
  loadContacts();
}


let prio = "";
let subTask = [];
let checkBox = [];
let selectedCheckboxes = [];
let positionID = ""


function addTask() {
  if (document.getElementById("addTasktitleInput").value !== '' && document.getElementById("addTaskDate").value !== '' && document.getElementById("addTaskCategory").value !== ''){
  const task = {Title: document.getElementById("addTasktitleInput").value, Category: document.getElementById("addTaskCategory").value, Description: document.getElementById("addTaskDiscription").value, DueDate: document.getElementById("addTaskDate").value, Prio: prio, AssignedTo: selectedCheckboxes, Subtask: [subTask], PositionID: "toDo", checkboxState: [checkBox]};
  const jsonString = JSON.stringify(task);
  postData(task.Title, task);
  console.log(jsonString);
  showConfirmationMessage();
  loadTask();} else { console.log ("feld nicht ausgefüllt")}
}


function addTaskPopup(positionId) {
  if (document.getElementById("addTasktitleInput").value !== '' && document.getElementById("addTaskDate").value !== '' && document.getElementById("addTaskCategory").value !== ''){
    positionID = positionId
  const task = {Title: document.getElementById("addTasktitleInput").value, Category: document.getElementById("addTaskCategory").value, Description: document.getElementById("addTaskDiscription").value, DueDate: document.getElementById("addTaskDate").value, Prio: prio, AssignedTo: selectedCheckboxes, Subtask: [subTask], PositionID: positionID, checkboxState: [checkBox]};
  const jsonString = JSON.stringify(task);
  postData(task.Title, task);
  console.log(jsonString);
  showConfirmationMessage();
  loadTask();}
}


function showConfirmationMessage() {
  const messageElement = document.getElementById('confirmationMessage');
  messageElement.classList.remove('hidden');
  messageElement.classList.add('show');
  setTimeout(() => {
    messageElement.classList.remove('show');
    messageElement.classList.add('hidden');
  }, 900); }


function updateSelectedCheckboxes() {
  selectedCheckboxes = []; 
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedCheckboxes.push(checkbox.id);
    }
  });
}


function updateSelectedCheckboxes2() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedCheckboxes.push(checkbox.id);
    }
  });
}


function setPrio(p) {
  event.preventDefault();
  const prios = p;
  if (prio == p) {
    prio = "";
  } else {
    prio = p;
  }
  if (document.getElementById(`${p}`).classList.contains(`color${p}`)) {
    removeClasslist(p);
  } else {
    removeOtherClasslist();
    addClasslist(p);
  }
}


function checkClasslist(p) {
  document.getElementById(`${p}`).classList.contains(`color${p}`);
}


function addClasslist(p) {
  document.getElementById(`${p}`).classList = `color${p}`;
  document.getElementById(`${p}Color`).classList = `d-none`;
  document.getElementById(`${p}White`).classList = ``;
}


function removeClasslist(p) {
  document.getElementById(`${p}`).classList = ``;
  document.getElementById(`${p}Color`).classList = ``;
  document.getElementById(`${p}White`).classList = `d-none`;
}


function removeOtherClasslist(p) {
  document.getElementById(`urgent`).classList = ``;
  document.getElementById(`urgentColor`).classList = ``;
  document.getElementById(`urgentWhite`).classList = `d-none`;
  document.getElementById(`medium`).classList = ``;
  document.getElementById(`mediumColor`).classList = ``;
  document.getElementById(`mediumWhite`).classList = `d-none`;
  document.getElementById(`low`).classList = ``;
  document.getElementById(`lowColor`).classList = ``;
  document.getElementById(`lowWhite`).classList = `d-none`;
}


function openAddSubTask() {
  document.getElementById("activSubTask").classList.remove("d-none");
  document.getElementById("activSubTask").classList.add("d-flex");
  document.getElementById("subTaskPlus").classList.add("d-none");
}


function cancelSubTask() {
  document.getElementById("subTaskAdd").value = "";
  document.getElementById("activSubTask").classList.add("d-none");
  document.getElementById("activSubTask").classList.remove("d-flex");
  document.getElementById("subTaskPlus").classList.remove("d-none");
  event.stopPropagation();
}


function addSubTask() {
  let show = document.getElementById("subTaskView");
  let value = document.getElementById("subTaskAdd").value;
  show.innerHTML += `<li>${value}</li>`;
  subTask.push(`${value}`);
  checkBox.push("false")
  cancelSubTask();
  event.stopPropagation();
}


function fillsubtask(id){
  let subTasks = ""
  if (id === "undefined"){subTask = ""} else {
  for (let index = 0; index < task[id].Subtask[0].length; index++) {
    const element = task[id].Subtask[0][index];
    subTasks += `<li>${element}</li>`;
    subTask += element;
    checkBox.push("false");
  }}
  return subTasks;
}


function filterContacts() {
  const filterValue = document.getElementById("assinged").value.toLowerCase();
  assigned = "";
  for (let i = 0; i < contacts.length; i++) {
    const element = contacts[i].username;
    const circle = generateCircle(element);
    if (element.toLowerCase().startsWith(filterValue)) {
      const isChecked = selectedCheckboxes.includes(element);
      assigned += `
      <div class="d-flex assingUser">
        <label class="container">
          <div class="d-flex assingLeft">
            <div>${circle}</div>
            <p>${element}</p>
          </div>
          <input id="${element}" type="checkbox" onclick="toggleCheckbox('${element}')" ${isChecked ? "checked" : ""}>
          <span class="checkmark"></span>
        </label>
      </div>`;
    }
  }
  document.getElementById("assingedList").innerHTML = assigned;
}

function toggleCheckbox(username) {
  if (selectedCheckboxes.includes(username)) {
    selectedCheckboxes = selectedCheckboxes.filter(item => item !== username);
  } else {
    selectedCheckboxes.push(username);
  }
}


function renderSelectedContacts() {
  const electedContactsDiv = document.getElementById('electedContacts');
  electedContactsDiv.innerHTML = '';
  selectedCheckboxes.forEach(contact => {
    const circle = generateCircle(contact);
    electedContactsDiv.innerHTML += circle;
  });
}


function checkboxHelp(id){
  selectedCheckboxes = task[id].AssignedTo;
  updateSelectedCheckboxes2();
    renderSelectedContacts();
}

//Firebase
async function postData(path = "", data = {}) {
  const title = data.Title;
  path = title;
  console.log("Starting postData with path:", BASE_Url + path + ".json");
  console.log("Data being sent:", data);
  try {
    let response = await fetch(BASE_Url + path + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let responseToJson = await response.json();
    console.log("Response from Firebase:", responseToJson);
    return responseToJson;
  } catch (error) {
    console.error("Error during postData:", error);
    return { error: "An error occurred during the data post." };
  }
}