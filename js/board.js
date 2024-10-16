let task = [];
let BASE_URL = "https://creative33-9f884-default-rtdb.firebaseio.com/task/";

async function loadTask() {
  try {
    const response = await fetch(`${BASE_URL}.json`);
    if (!response.ok) {
      throw new Error(`Fehler beim Laden der Daten: ${response.statusText}`);
    }
    const taskData = await response.json();
    if (!taskData) {
      console.error("Keine Daten aus Firebase erhalten oder Daten sind leer.");
      return;
    }
    task.length = 0;
    for (const key in taskData) {
      if (taskData.hasOwnProperty(key)) {
        task.push(taskData[key]);
      }
    }
  } catch (error) {
    console.error("Fehler beim Laden der Daten:", error);
  }
  render();
}

function render() {
  for (let i = 0; i < task.length; i++) {
    const element = task[i];
    const assignedTo = task[i].AssignedTo && task[i].AssignedTo.length > 0 ? task[i].AssignedTo : "0";
    contentHTML = fillTemplate(
      task[i].Title,
      task[i].Category,
      task[i].Description,
      assignedTo,
      task[i].Prio,
      i
    );
    document.getElementById(`${task[i].PositionID}`).innerHTML += contentHTML;
    updateProgress(i);
  }
  checkPlaceholderVisibility()

}

function fillTemplate(title, category, text, assigned, prio, id) {
  let priosrc = checkPrio(prio);
  let catClass = checkCategory(category);
  let content = limitTextLength(text);
  let initials = getInitials2(assigned);

  return /*html*/ `
    <div class="card" id="${title}" draggable="true" ondragstart="drag(event, ${id}, '${title}')" onclick="openDetailCard(${id})">
        <div class="cardCategory ${catClass} d-flex d-center">${category}</div>
        <h3 class="cardTitle">${title}</h3>
        <p class="cardText">${content}</p>
        <div class="cardBalken d-flex">
            <div class="progress-container" id="progressContainer${id}">
                <div class="progress-bar" id="progressBar${id}"></div>
            </div>
            <div class="progress-text" id="progressText${id}"></div>
        </div>
        <div class="cardFooter d-flex d-space">
            <div class="initials-container">${initials}</div>
            <img class="cardPrio " src="${priosrc}">
        </div>

        </div>
    </div>`;
}

function getInitials2(names){
let initial = ""
if (names === "0") {
  initial += `<div class="initials d-none" style="background-color: ;">0</div>`;
  return initial;
} else {
  for (let i = 0; i < names.length; i++) {
    const element = names[i];
    const color = getRandomColor();
    
 
  const nameParts = element.split(' ');
  const initials = nameParts.map(part => part.charAt(0)).join('');
  ini = initials.toUpperCase();
  initial += `<div class="initials" style="background-color: ${color};">${ini}</div>`;
  
}
return initial;
}
}

function getInitialsDetail(names){
  let initial = ""
        const color = getRandomColor();
      
   
    const nameParts = names.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    ini = initials.toUpperCase();
    initial += `<div class="initialsDetails" style="background-color: ${color};">${ini}</div>`
    
  
  return initial
  }

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function updateProgress(id) {
  let progressBarID = "progressBar" + id;
  let progressTextID = "progressText" + id;
  const totalSubtasks = taskLenght(id);
  const completedSubtasks = numberOfChecked(id);
  const progressPercentage = (completedSubtasks / totalSubtasks) * 100;
  const progressBarElement = document.getElementById(progressBarID);
  if( totalSubtasks === 0){document.getElementById(`progressContainer${id}`).classList.add ("d-none") } else{
  if (progressBarElement) {
    progressBarElement.style.width = `${progressPercentage}%`;
  }
  const progressTextElement = document.getElementById(progressTextID);
  if (progressTextElement) {
    progressTextElement.innerText = `${completedSubtasks}/${totalSubtasks} Subtasks`;
  }
  }
}

function taskLenght(id){
  let result;

  if (task[id].Subtask && task[id].Subtask[0]) {
      result = task[id].Subtask[0].length;
  } else {
      result = 0;
  } return result;
}

function numberOfChecked(id){
  let count = 0
  if(task[id].checkboxState && task[id].checkboxState[0]){
  for (let i = 0; i < task[id].checkboxState[0].length; i++) {
    const element = task[id].checkboxState[0][i].checked;
    if (element === true) {
      count = count+1 
    } else { count =  count+0 }}
    
  } else { return count}
 
  

  return count;
}

function checkPrio(prio) {
  const urgent = "./assets/img/icon_PrioAltaRed.svg";
  const medium = "./assets/img/icon_PrioMediaOrange.svg";
  const low = "./assets/img/icon_PrioBajaGreen.svg";
  if (prio === "urgent") {
    prioImgSrc = urgent;
  } else if (prio === "medium") {
    prioImgSrc = medium;
  } else if (prio === "low") {
    prioImgSrc = low;
  } else {
    prioImgSrc = ""
   
    
  }
  return prioImgSrc;
  
}

function checkPrioDetail(prio) {
  const urgent = "./assets/img/icon_PrioAltaRed.svg";
  const medium = "./assets/img/icon_PrioMediaOrange.svg";
  const low = "./assets/img/icon_PrioBajaGreen.svg";
  if (prio === "urgent") {
    prioImgSrc = `<img class="detailPrioImg" src="${urgent}" alt="">`;
  } else if (prio === "medium") {
    prioImgSrc = `<img class="detailPrioImg" src="${medium}" alt="">`;
  } else if (prio === "low") {
    prioImgSrc = `<img class="detailPrioImg" src="${low}" alt="">`;
  } else {
    prioImgSrc = ""
   
    
  }
  return prioImgSrc;
  
}

function checkCategory(category) {
  if (category === "Technical Task") {
    catClass = "technical";
  } else if (category === "User Story") {
    catClass = "user";
  } else if (category === "") {
    catClass = "";
  }
  return catClass;
}

function limitTextLength(text) {
  if (text.length > 50) {
    content = text.slice(0, 50) + "...";
  } else {
    content = text;
  }
  return content;
}

function openDetailCard(id) {
  let contentSection = document.getElementById("overlay");
  let assign = filterContact(id);
  let cardSubTask = filterSubTask(id);
  let catClass = checkCategory(task[id].Category);
  let formattedDate = formatDateToDDMMYYYY(task[id].DueDate);
  let priosrc = checkPrioDetail(task[id].Prio);
  fillDetailTemplate(
    id,
    contentSection,
    assign,
    cardSubTask,
    catClass,
    formattedDate,
    priosrc,
    
  );
  document.getElementById("overlay").classList.remove("d-none");
  document.getElementById("overlay").classList.add("d-flex");
}

function fillDetailTemplate(
  id,
  contentSection,
  assign,
  cardSubTask,
  catClass,
  formattedDate,
  priosrc,
  
) {
  contentSection.innerHTML = "";
  contentSection.innerHTML = /*html*/ `
        <div id="detailCard" class="detailCard">
            <div class="d-flex d-space">
                <div class="detailCardCategory ${catClass} d-flex d-center">${task[id].Category}</div>
                <img onclick="closeDetailCardX()" class="closeCard" src="./assets/img/icon_closeVectorBlack.svg" alt="">
            </div>
            <h2>${task[id].Title}</h2>
            <div>
                <p class="detailDescription">${task[id].Description}</p>
                <div class="d-flex detailDate">
                    <p class="detailDue">DueDate:</p>
                    <p>${formattedDate}</p> 
                </div>
                <div class="d-flex detailPrio">
                    <p class="detailPr">Priority:</p>
                    <p class="d-flex dPrio">${task[id].Prio} ${priosrc}</p>
                </div>
            </div>
            <ul>
                <p class="detailAssign">Assigned To:</p>
                ${assign}
            </ul>
            <p class="detailSubtask">Subtasks</p>
            <ul id="subtasksContainer${id}" class="subtask-container">
                ${cardSubTask}
        </ul>
        <div class="d-flex detailDeleteEdit">
            <div class="deleteEdit d-flex" onclick="deleteTask('${task[id].Title}')">
                <img src="./assets/img/delete.svg" alt="">
                <p>Delete</p>
            </div>
            <div class="detailMiddleline"></div>
            <div class="deleteEdit d-flex" onclick="editTask('${task[id].Title}', '${task[id].Category}', '${task[id].DueDate}', '${task[id].Description}' ,'${task[id].PositionID}' ,'${id}')">
                <img src="./assets/img/edit.svg" alt="">
                <p>Edit</p>
            </div>
        </div>
        </div>   
    `;
}

function formatDateToDDMMYYYY(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function filterContact(id) {
  let tasks = task;
  let contact = "";
 if("AssignedTo" in tasks[id]){
  for (let i = 0; i < tasks[id].AssignedTo.length; i++) {
    const element = tasks[id].AssignedTo[i];
    const initial = getInitialsDetail(element);
    contact += `<li class="assignList d-flex">${initial}${element}</li>`;
  }} else {
    contact += ""
  }

  return contact;
}

function filterSubTask(id) {
  let subTask = "";
  if (task[id].Subtask && task[id].Subtask[0]){
  for (let i = 0; i < task[id].Subtask[0].length; i++) {
    const element = task[id].Subtask[0][i];
    const checkedTask = task[id].checkboxState[0][i].checked
    const checked = filterCheckBox(checkedTask);
    subTask += `<li class="d-flex subtaskList"><input id="${id}${i}" type="checkbox" class="subtask-checkbox-${id}" onclick="updatecheckbox(${id}, ${i})" ${checked}><p>${element}</p></li> `;
  }} else { return subTask}

  return subTask;
}

function filterCheckBox(checked){
  if (checked === true) { return "checked"
  } else {
    return "unchecked"
  }
}


function updatecheckbox(id, i){
  updateCheckboxStateInFirebase(i, id);
  updateProgress(id);
}


function closeDetailCard(event) {
  const overlay = document.getElementById("overlay");
  const detailCard = document.getElementById("overlay");

  if (event.target === overlay) {
    document.getElementById("overlay").classList.add("d-none");
    document.getElementById("overlay").classList.remove("d-flex");
  }
}

function closeDetailCardX() {
  document.getElementById("overlay").classList.add("d-none");
  document.getElementById("overlay").classList.remove("d-flex");
}


function checkPlaceholderVisibility() {
  const sections = [
      { container: document.getElementById('toDo'), placeholder: document.getElementById('toDoPlaceholder') },
      { container: document.getElementById('inProgress'), placeholder: document.getElementById('progressPlaceholder') },
      { container: document.getElementById('awaitFeedback'), placeholder: document.getElementById('feedbackPlaceholder') },
      { container: document.getElementById('done'), placeholder: document.getElementById('donePlaceholder') }
  ];

  for (const section of sections) {
      const hasContent = section.container.querySelectorAll('.card').length > 0;
      section.placeholder.style.display = hasContent ? 'none' : 'flex';
  }
}


let draggedElement;
let idUpdate;
let savedTitle;

function drag(event, id, name) {
    draggedElement = event.target; 
    idUpdate = id
    savedTitle = name
    task = task
    event.dataTransfer.setData("text", event.target.id); 
}


function allowDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

function dragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

function drop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');

    
    if (draggedElement && event.currentTarget !== draggedElement.parentNode) {
        event.currentTarget.appendChild(draggedElement);
        checkPlaceholderVisibility(); 
    }
   
    const dropTargetID = event.currentTarget.id;
    updateTaskPosition(dropTargetID);
}

function updateTaskPosition(dropTargetID){
  task[idUpdate].PositionID = dropTargetID;
  task = task[idUpdate]
  updatePosition(task.Title, task);
}


async function updateCheckboxStateInFirebase(checkboxId, taskId) {
  const checkbox = document.getElementById(`${taskId}${checkboxId}`);
  const checkboxState = { checked: checkbox.checked };
  task[taskId].checkboxState[0][checkboxId] = checkboxState;
  const data = task[taskId].checkboxState[0]
  const taskTitle = task[taskId].Title
  await fetch(`https://creative33-9f884-default-rtdb.firebaseio.com/task/${taskTitle}/checkboxState/0.json`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => console.log('Checkbox state updated:', data))
  .catch(error => console.error('Error updating checkbox state:', error));
}
    

  async function updatePosition(path = "", data = {}) {
    const title = savedTitle;
    path = title;
    let response = await fetch(BASE_URL + path + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    return (responseToJson = await response.json());
  }