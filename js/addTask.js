let BASE_Url = "https://creative33-9f884-default-rtdb.firebaseio.com/task/";


function renderAddTask() {
  let contentSection = document.getElementById("addTaskSide");
  contentSection.innerHTML = "";
  contentSection.innerHTML = addTaskTemplate();
  loadContacts();
  document.getElementById("electedContacts").innerHTML = '';
  selectedCheckboxes = [];
}



let prio = "medium";
let subTask = [];
let checkBox = [];
let selectedCheckboxes = [];
let positionID = ""


async function addTask(event) {
  checkRequired();
  // if (event) event.preventDefault();
  if (document.getElementById("addTasktitleInput").value !== '' && document.getElementById("addTaskDate").value !== '' && document.getElementById("addTaskCategory").value !== ''){
  const task = {Title: document.getElementById("addTasktitleInput").value, Category: document.getElementById("addTaskCategory").value, Description: document.getElementById("addTaskDiscription").value, DueDate: document.getElementById("addTaskDate").value, Prio: prio, AssignedTo: selectedCheckboxes, Subtask: [subTask], PositionID: "toDo", checkboxState: [checkBox]};
  await postData(task.Title, task);
  showConfirmationMessage();
  goToBoard();
  }
}

function checkRequired(){
  let titleR = document.getElementById("addTasktitleInput");
  let dateR = document.getElementById("addTaskDate");
  let categoryR = document.getElementById("addTaskCategory");
  resetRequired();
  if (titleR.value === ""){
    document.getElementById("requiredTitle").classList.remove("d-none");
    titleR.classList.add ("outlineRed");
    event.preventDefault();
  } else if (dateR.value === ""){
    document.getElementById("requiredDate").classList.remove("d-none")
    dateR.classList.add ("outlineRed");
    event.preventDefault();
  } else if (categoryR.value === ""){
    document.getElementById("requiredCat").classList.remove("d-none");
    categoryR.classList.add ("outlineRed");
    event.preventDefault();
} else {addTask();}}


function resetRequired(){
  let titleR = document.getElementById("addTasktitleInput");
  let dateR = document.getElementById("addTaskDate");
  let categoryR = document.getElementById("addTaskCategory");
  if (titleR.classList.contains('outlineRed')) {
    document.getElementById("requiredTitle").classList.add("d-none");
    titleR.classList.remove ("outlineRed");} else if (dateR.classList.contains('outlineRed')) {
      document.getElementById("requiredDate").classList.add("d-none");
      dateR.classList.remove ("outlineRed");} else if (categoryR.classList.contains('outlineRed')) {
        document.getElementById("requiredCat").classList.add("d-none");
        categoryR.classList.remove ("outlineRed");}
}


function goToBoard(){
  window.location.href = 'http://127.0.0.1:5500/board.html';
}

function addTaskPopup(positionId) {
  if (document.getElementById("addTasktitleInput").value !== '' && document.getElementById("addTaskDate").value !== '' && document.getElementById("addTaskCategory").value !== ''){
    positionID = positionId
  const task = {Title: document.getElementById("addTasktitleInput").value, Category: document.getElementById("addTaskCategory").value, Description: document.getElementById("addTaskDiscription").value, DueDate: document.getElementById("addTaskDate").value, Prio: prio, AssignedTo: selectedCheckboxes, Subtask: [subTask], PositionID: positionID, checkboxState: [checkBox]};
  const jsonString = JSON.stringify(task);
  postData(task.Title, task);
  showConfirmationMessage();
  loadTask();
  closePopUp();
  closeDetailCardX();}
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
    if (!Array.isArray(selectedCheckboxes)) {
        selectedCheckboxes = [];
    }
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (selectedCheckboxes.includes(checkbox.id)) {
            checkbox.checked = true;
        }
        if (checkbox.checked && !selectedCheckboxes.includes(checkbox.id)) {
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
  if (document.getElementById("subTaskAdd").value === "") {
  }else{
  let value = document.getElementById("subTaskAdd").value;
  subTask.push(`${value}`);
  renderSubTask();
  checkBox.push("false")
  cancelSubTask();
  event.stopPropagation();}
}


function renderSubTask(){
  let show = document.getElementById("subTaskView");
  show.innerHTML = ""
for (let index = 0; index < subTask.length; index++) {
  const element = subTask[index];
  show.innerHTML += `
  <li class="subTaskList">
  <p id="subtask-text-${index}">${element}</p>
  <div id="subTaskLeft-${index}" class="subTaskLeft">
  <img class="subTaskEdit" onclick="editSubTask(${index})" src="./assets/img/edit.svg" alt="Edit">
  <div class="middleLineShort"></div>
  <img class="subTaskDelete" onclick="deleteSubTask(${index})" src="./assets/img/delete.svg" alt="Delete">
  </div>
  <div id="edit-input-${index}-div" class="editInput d-none">
  <input type="text" id="edit-input-${index}"  class="edit-input" value="${subTask[index]}">
  <div id="save-btn-${index}" class="d-none d-flex d-align">
  <img onclick="saveSubTask(${index})" class="subTaskCheck" src="./assets/img/check.png" alt="">
  <div class="middleLineShort"></div>
  <img class="subTaskDelete" onclick="deleteSubTask(0)" src="./assets/img/delete.svg" alt="Delete">
  </div>
  </div>
  </li>`;
}
}


function editSubTask(index) {
  const subTaskText = document.getElementById(`subtask-text-${index}`);
  const editInput = document.getElementById(`edit-input-${index}-div`);
  const saveButton = document.getElementById(`save-btn-${index}`);
  const subTaskLeft = document.getElementById(`subTaskLeft-${index}`)
  subTaskText.classList.add('d-none');
  subTaskLeft.classList.add('d-none')
  editInput.classList.remove('d-none');
  saveButton.classList.remove('d-none');
}


function saveSubTask(index) {
  const editInput = document.getElementById(`edit-input-${index}`);
  subTask[index] = editInput.value;
  renderSubTask();
}


function deleteSubTask(index) {
  subTask.splice(index, 1); 
  renderSubTask();
}


function fillsubtask(id){
  let subTasks = ""
  if (id === "undefined"){subTask = ""} else {
  for (let index = 0; index < task[id].Subtask[0].length; index++) {
    const element = task[id].Subtask[0][index];
    const check = task[id].checkboxState[0][index];
    subTasks += `<li class="subTaskList">
  <p id="subtask-text-${index}">${element}</p>
  <div id="subTaskLeft-${index}" class="subTaskLeft">
  <img class="subTaskEdit" onclick="editSubTask(${index})" src="./assets/img/edit.svg" alt="Edit">
  <div class="middleLineShort"></div>
  <img class="subTaskDelete" onclick="deleteSubTask(${index})" src="./assets/img/delete.svg" alt="Delete">
  </div>
  <div id="edit-input-${index}-div" class="editInput d-none">
  <input type="text" id="edit-input-${index}"  class="edit-input" value="${element}">
  <div id="save-btn-${index}" class="d-none d-flex d-align">
  <img onclick="saveSubTask(${index})" class="subTaskCheck" src="./assets/img/check.png" alt="">
  <div class="middleLineShort"></div>
  <img class="subTaskDelete" onclick="deleteSubTask(0)" src="./assets/img/delete.svg" alt="Delete">
  </div>
  </div>
  </li>`;
    subTask.push(element);
    checkBox.push(check);
  }}
  return subTasks;
}


function filterContacts() {
  const filterValue = document.getElementById("assinged").value.toLowerCase();
  assigned = "";
  for (let i = 0; i < contacts.length; i++) {
    const element = contacts[i].name;
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
  if (event) event.preventDefault();
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
  } catch (error) {
    console.error("Error during postData:", error);
    return { error: "An error occurred during the data post." };
  }
}


async function addTask(event) {
  if (event) event.preventDefault();

  const task = {
    Title: document.getElementById("addTasktitleInput").value,
    Category: document.getElementById("addTaskCategory").value,
    Description: document.getElementById("addTaskDiscription").value,
    DueDate: document.getElementById("addTaskDate").value,
    Prio: prio,
    AssignedTo: selectedCheckboxes,
    Subtask: [subTask],
    PositionID: "toDo",
    checkboxState: [checkBox]
  };

  try {
    let response = await fetch(BASE_Url + task.Title + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (response.ok) {
      console.log("Task wurde erfolgreich hinzugefügt.");
    } else {
      console.error("Fehler beim Hinzufügen der Aufgabe:", response.status);
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}