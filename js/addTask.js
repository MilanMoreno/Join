
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
  const jsonString = JSON.stringify(task);
  postData(task.Title, task);
  console.log(jsonString);
  showConfirmationMessage();
  loadTask();} else { console.log ("feld nicht ausgefüllt")}
}

function addTaskPopup(positionId) {
  if (document.getElementById("addTasktitleInput").value !== '' && document.getElementById("addTaskDate").value !== '' && document.getElementById("addTaskCategory").value !== ''){
    positionID = positionId
  const task = {
    Title: document.getElementById("addTasktitleInput").value,
    Category: document.getElementById("addTaskCategory").value,
    Description: document.getElementById("addTaskDiscription").value,
    DueDate: document.getElementById("addTaskDate").value,
    Prio: prio,
    AssignedTo: selectedCheckboxes,
    Subtask: [subTask],
    PositionID: positionID,
    checkboxState: [checkBox]
  };
  const jsonString = JSON.stringify(task);
  postData(task.Title, task);
  console.log(jsonString);
  showConfirmationMessage();
  loadTask();} else { console.log ("feld nicht ausgefüllt")}
}

function showConfirmationMessage() {
  const messageElement = document.getElementById('confirmationMessage');
  
  // Zeige das Element und aktiviere die CSS-Klasse für das Einblenden
  messageElement.classList.remove('hidden');
  messageElement.classList.add('show');
  
  // Verstecke die Meldung nach 900ms
  setTimeout(() => {
    messageElement.classList.remove('show');
    messageElement.classList.add('hidden');
  }, 900); }


// Funktion zum Aktualisieren der ausgewählten Checkboxen
function updateSelectedCheckboxes() {
  
    // Leere das Array, um die aktuellen Werte zu speichern
    selectedCheckboxes = []; 

    // Hole alle Checkboxen im Dokument
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Überprüfe jede Checkbox
    checkboxes.forEach(checkbox => {
        // Wenn die Checkbox ausgewählt ist, füge die ID zum Array hinzu
        if (checkbox.checked) {
            selectedCheckboxes.push(checkbox.id);
        }
    });

    // Ausgabe des aktuellen Arrays der ausgewählten Checkboxen (optional)
    console.log(selectedCheckboxes);
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

// firebase

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

    // Prüfen, ob die Antwort erfolgreich ist
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Erfolgreiche Antwort wird zurückgegeben
    let responseToJson = await response.json();
    console.log("Response from Firebase:", responseToJson);
    return responseToJson;
    
  } catch (error) {
    console.error("Error during postData:", error);
    return { error: "An error occurred during the data post." };
  }
}
