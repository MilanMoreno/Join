let BASE_Url = "https://creative33-9f884-default-rtdb.firebaseio.com/task/";

let taskA = []


async function loadTask() {
  try {const response = await fetch(`${BASE_Url}.json`);
    if (!response.ok) {
      throw new Error(`Fehler beim Laden der Daten: ${response.statusText}`);}
    const taskData = await response.json();
    if (!taskData) {
      console.error("Keine Daten aus Firebase erhalten oder Daten sind leer.");
      return;}
    taskA.length = 0;
    for (const key in taskData) {
      if (taskData.hasOwnProperty(key)) {
        taskA.push(taskData[key]);
      }}} catch (error) {
    console.error("Fehler beim Laden der Daten:", error);}}

function renderAddTask() {
  let contentSection = document.getElementById("addTaskSide");
  contentSection.innerHTML = "";
  contentSection.innerHTML = addTaskTemplate();
  loadContacts();
  document.getElementById("electedContacts").innerHTML = '';
  selectedCheckboxes = [];
  setMinDate();
}

function setMinDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); 
  const dd = String(today.getDate()).padStart(2, '0');      
  const minDate = `${yyyy}-${mm}-${dd}`;
  document.getElementById("addTaskDate").setAttribute("min", minDate);
}

function validateDateInput() {
  const dateInput = document.getElementById("addTaskDate");
  const selectedDate = new Date(dateInput.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate >= today && document.getElementById("addTaskDate").classList.contains("outlineRed")){
    document.getElementById("pastDate").classList.add("d-none");
  document.getElementById("addTaskDate").classList.remove ("outlineRed");
  }else 
  if (selectedDate < today) {
    dateInput.value = "";
    pastDate();
  }
}

function pastDate(){
  document.getElementById("pastDate").classList.remove("d-none");
  document.getElementById("addTaskDate").classList.add ("outlineRed");
    return false
}

let prio = "medium";
let subTask = [];
let checkBox = [];
let selectedCheckboxes = [];
let positionID = ""

async function addTaskSummit() {
  let button =  document.getElementById("submitButton");
  event.preventDefault()
  await loadTask();
  let id = taskA.length;
  if(!checkRequired()) { return;}
  if (document.getElementById("addTasktitleInput").value !== '' && document.getElementById("addTaskDate").value !== '' && document.getElementById("addTaskCategory").value !== ''){
    button.disabled = true;
  const task = {Title: document.getElementById("addTasktitleInput").value, Category: document.getElementById("addTaskCategory").value, Description: document.getElementById("addTaskDiscription").value, DueDate: document.getElementById("addTaskDate").value, Prio: prio, AssignedTo: selectedCheckboxes, Subtask: [subTask], PositionID: "toDo", checkboxState: [checkBox], ID: id};
  await postData(task.Title, task, id);
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
    return false} else if (dateR.value === ""){
    document.getElementById("requiredDate").classList.remove("d-none")
    dateR.classList.add ("outlineRed");
    return false;} else if (categoryR && categoryR.value === ""){
    document.getElementById("requiredCat").classList.remove("d-none");
    categoryR.classList.add ("outlineRed");
    return false} else {return true}}

function resetRequired(){
  let titleR = document.getElementById("addTasktitleInput");
  let dateR = document.getElementById("addTaskDate");
  let categoryR = document.getElementById("addTaskCategory");
  if (titleR.classList.contains('outlineRed')) {
    document.getElementById("requiredTitle").classList.add("d-none");
    titleR.classList.remove ("outlineRed");} else if (dateR.classList.contains('outlineRed')) {
    document.getElementById("requiredDate").classList.add("d-none");
    dateR.classList.remove ("outlineRed");} else if (categoryR && categoryR.classList.contains('outlineRed')) {
    document.getElementById("requiredCat").classList.add("d-none");
    categoryR.classList.remove ("outlineRed");}
}

function goToBoard(){
  window.location.href = './board.html';
}

async function addTaskPopup(positionId) {
  let button = document.getElementById("addTaskPopupButton");
  event.preventDefault();
  if (!checkRequired()) {return;}
  if (button !== null && document.getElementById("addTasktitleInput").value !== '' && document.getElementById("addTaskDate").value !== '' && document.getElementById("addTaskCategory").value !== '') {button.disabled = true;}
  if (document.getElementById("addTasktitleInput").value !== '' && document.getElementById("addTaskDate").value !== '' && document.getElementById("addTaskCategory").value !== ''){
    button.disabled = true;
    positionID = positionId;
  const task = {Title: document.getElementById("addTasktitleInput").value, Category: document.getElementById("addTaskCategory").value, Description: document.getElementById("addTaskDiscription").value, DueDate: document.getElementById("addTaskDate").value, Prio: prio, AssignedTo: selectedCheckboxes, Subtask: [subTask], PositionID: positionID, checkboxState: [checkBox]};
  const jsonString = JSON.stringify(task);
  await postData(task.Title, task);
  showConfirmationMessage();
  closePopUp();
  closeDetailCardX();
  await loadTasks();}}

async function addTaskPopup2(positionId, id) {
  let button = document.getElementById("editTaskButton")
  if (!checkRequired()) {return;}
  if (button !== null && document.getElementById("addTasktitleInput").value !== '' && document.getElementById("addTaskDate").value !== '' && document.getElementById("addTaskCategory").value !== '') {button.disabled = true;}
  if (document.getElementById("addTasktitleInput").value !== '' && document.getElementById("addTaskDate").value !== '' && document.getElementById("addTaskCategory").value !== ''){
    button.disabled = true;
    positionID = positionId
  const task = {Title: document.getElementById("addTasktitleInput").value, Category: document.getElementById("addTaskCategory").value, Description: document.getElementById("addTaskDiscription").value, DueDate: document.getElementById("addTaskDate").value, Prio: prio, AssignedTo: selectedCheckboxes, Subtask: [subTask], PositionID: positionID, checkboxState: [checkBox]};
  const jsonString = JSON.stringify(task);
  await postData(task.Title, task);
  await loadTasks();
  closeDetailCardX();
}
}

function showConfirmationMessage() {
  const messageElement = document.getElementById('confirmationMessage');
  messageElement.classList.remove('hidden');
  messageElement.classList.add('show');
  setTimeout(() => {
    messageElement.classList.remove('show');
    messageElement.classList.add('hidden');
  }, 900); }

function updateSelectedCheckboxes(i) {
  selectedCheckboxes = []; 
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedCheckboxes.push(checkbox.id);
    }
  });
}

function checkboxshow(i){
  if(document.getElementById(`check${i}`).classList.contains("d-none")){
    document.getElementById(`container${i}`).classList.add ("backgroundAssing")
  document.getElementById(`check${i}`).classList.remove ("d-none");
  document.getElementById(`mark${i}`).classList.add ("d-none");
  updateSelectedCheckboxes();}
  else {
    document.getElementById(`container${i}`).classList.remove ("backgroundAssing")
    document.getElementById(`check${i}`).classList.add ("d-none");
  document.getElementById(`mark${i}`).classList.remove ("d-none");
  updateSelectedCheckboxes();
  }
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
  }}

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

function checkEnter(event, inputId) {
  const enabledInputs = ["subTaskAdd"];
  if (event.key === "Enter" && enabledInputs.includes(inputId)) {
    addSubTask();
  }
}

function renderSubTask(){
  let show = document.getElementById("subTaskView");
  show.innerHTML = ""
for (let index = 0; index < subTask.length; index++) {
  const element = subTask[index];
  show.innerHTML += renderSubTaskTemplate(index, element);
}
}

function editSubTask(index) {
  renderSubTask();
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
  if (editInput.value.trim() !== "") {
    subTask[index] = editInput.value;
    renderSubTask();
  }else{
    editInput.placeholder = "This field must not be empty"
  }
}

function deleteSubTask(index) {
  subTask.splice(index, 1); 
  renderSubTask();
}

let subTask2 = []

function fillsubtask(id){
  subTask2 = []
  let subTasks = ""
  if (id === "undefined"){subTask = ""} else if (task[id].Subtask && task[id].Subtask[0]){
  for (let index = 0; index < task[id].Subtask[0].length; index++) {
    const element = task[id].Subtask[0][index];
    const check = task[id].checkboxState[0][index];
    subTasks += fillsubtaskTemplate(index, element);
    subTask2.push(element);
    checkBox.push(check);
  }}
  subTask = subTask2
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
      assigned += filterContactsTemplate(circle, element, isChecked);
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
  const maxVisibleContacts = 5;
  const extraContacts = selectedCheckboxes.length - maxVisibleContacts;
  selectedCheckboxes.slice(0, maxVisibleContacts).forEach(contact => {
    const circle = generateCircle(contact);
    electedContactsDiv.innerHTML += circle;
  });
  if (extraContacts > 0) {
    const extraCircle = `<div class="initialsDetails" style="background-color: brown;">+${extraContacts}</div>`;
    electedContactsDiv.innerHTML += extraCircle;
  }
}

function checkboxHelp(id){
  selectedCheckboxes = task[id].AssignedTo;
  updateSelectedCheckboxes2();
    renderSelectedContacts();
}

async function postData(path = "", data = {}, id) {
  const title = data.Title;
  path = title;
  if (event) event.preventDefault();
  try {
    let response = await fetch(BASE_Url + path + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",},
      body: JSON.stringify(data),});
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);}
  } catch (error) {
    console.error("Error during postData:", error);
    return { error: "An error occurred during the data post." };
  }}

async function addTask(event) {
  if (event) event.preventDefault();
  const task = {Title: document.getElementById("addTasktitleInput").value, Category: document.getElementById("addTaskCategory").value, Description: document.getElementById("addTaskDiscription").value, DueDate: document.getElementById("addTaskDate").value, Prio: prio, AssignedTo: selectedCheckboxes, Subtask: [subTask], PositionID: "toDo", checkboxState: [checkBox]};
  try {
    let response = await fetch(BASE_Url + task.Title + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",},
      body: JSON.stringify(task),});
    if (response.ok) {
    } else {console.error("Fehler beim Hinzufügen der Aufgabe:", response.status);}
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }}