let task = [] ;
let BASE_URL = "https://creative33-9f884-default-rtdb.firebaseio.com/task";


async function loadTask() {
    try {const response = await fetch(`${BASE_URL}.json`);
        if (!response.ok) {throw new Error(`Fehler beim Laden der Daten: ${response.statusText}`);
        }const taskData = await response.json();
        if (!taskData) {
            console.error("Keine Daten aus Firebase erhalten oder Daten sind leer.");
            return;
        }task.length = 0;
        for (const key in taskData) {
            if (taskData.hasOwnProperty(key)) {
                task.push(taskData[key]);
            }}console.log("Geladene Aufgaben:", task);
    } catch (error) {console.error('Fehler beim Laden der Daten:', error);
    }render();}


function render() {
    console.log(task)
    for (let i = 0; i < task.length; i++) {
        const element = task[i];
        contentHTML = fillTemplate(task[i].Title, task[i].Category, task[i].Description, task[i].AssignedTo, task[i].Prio, i);
        document.getElementById(`${task[i].PositionID}`).innerHTML += contentHTML;
        updateProgress(i);
    }
}


// Template für die Karten, das eindeutige IDs und Klassen verwendet
function fillTemplate(title, category, text, assigned, prio, id){
    let priosrc = checkPrio(prio);
    let catClass = checkCategory(category);
    let content = limitTextLength(text);

    return /*html*/ `
    <div class="card" onclick="openDetailCard(${id})">
        <div class="cardCategory ${catClass} d-flex d-center">${category}</div>
        <h3 class="cardTitle">${title}</h3>
        <p class="cardText">${content}</p>
        <div class="cardBalken d-flex">
            <div class="progress-container">
                <div class="progress-bar" id="progressBar${id}"></div>
            </div>
            <div class="progress-text" id="progressText${id}">0/0 Subtasks</div>
        </div>
        <div class="cardFooter d-flex d-space">
            <div class="cardAssigned">${assigned}</div>
            <img class="cardPrio" src="${priosrc}">
        </div>

        </div>
    </div>`;
    
}

// Fortschrittsaktualisierungsfunktion, die auf die spezifische Karte abzielt
function updateProgress(id) {
    // IDs für das spezifische Element erstellen
    let progressBarID = "progressBar" + id;
    let progressTextID = "progressText" + id;
    let subTaskViewID = "subtasksContainer" + id;

    // Ermitteln der gesamten Anzahl an Subtasks für die spezifische Karte
    const totalSubtasks = task[id].Subtask[0].length;

    // Zählen der abgehakten Subtasks (Checkboxen) für die spezifische Karte
    const completedSubtasks = document.querySelectorAll(`.subtask-checkbox-${id}:checked`).length;

    // Berechnen des Fortschritts in Prozent
    const progressPercentage = (completedSubtasks / totalSubtasks) * 100;

    // Überprüfen, ob das Fortschrittsbalken-Element vorhanden ist, bevor es aktualisiert wird
    const progressBarElement = document.getElementById(progressBarID);
    if (progressBarElement) {
        progressBarElement.style.width = `${progressPercentage}%`;
    }

    // Aktualisieren des Fortschrittstextes
    const progressTextElement = document.getElementById(progressTextID);
    if (progressTextElement) {
        progressTextElement.innerText = `${completedSubtasks}/${totalSubtasks} Subtasks`;
    }
}


function checkPrio(prio){
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
        prioImgSrc = "";
    } return prioImgSrc;
}


function checkCategory(category){
    if (category === "Technical Task") {
        catClass = "technical";
    } else if (category === "User Story") {
        catClass = "user";
    } else if (category === ""){
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
    let contentSection = document.getElementById("overlay")
    let assign = filterContact(id);
    let cardSubTask = filterSubTask(id);
    let catClass = checkCategory(task[id].Category);
    let formattedDate = formatDateToDDMMYYYY(task[id].DueDate);
    let priosrc = checkPrio(task[id].Prio);
    contentSection.innerHTML = ""
    contentSection.innerHTML = /*html*/`
        <div id="detailCard" class="detailCard">
            <div class="d-flex d-space"><div class="detailCardCategory ${catClass} d-flex d-center">${task[id].Category}</div><img onclick="closeDetailCard()" class="closeCard" src="./assets/img/icon_closeVectorBlack.svg" alt=""></div>
            <h2>${task[id].Title}</h2>
            <div>
                <p class="detailDescription">${task[id].Description}</p>
                <div class="d-flex detailDate"><p class="detailDue">DueDate:</p><p>${formattedDate}</p> </div>
                <div class="d-flex detailPrio"><p class="detailPr">Priority:</p><p class="d-flex dPrio">${task[id].Prio}<img class="detailPrioImg" src="${priosrc}" alt=""></p></div>
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
            <div class="deleteEdit d-flex"><img src="./assets/img/delete.svg" alt=""><p>Delete</p></div>
            <div class="detailMiddleline"></div>
            <div class="deleteEdit d-flex"><img src="./assets/img/edit.svg" alt=""><p>Edit</p></div>
        </div>
        </div>   
    `

   document.getElementById("overlay").classList.remove("d-none");
   document.getElementById("overlay").classList.add("d-flex") ; 
}


function formatDateToDDMMYYYY(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
}


function filterContact(id){
    let tasks = task
let contact = ""

    for (let i = 0; i < tasks[id].AssignedTo.length; i++) {
        const element = tasks[id].AssignedTo[i];
        contact += `<li class="assignList d-flex">${element}</li>`
    }

    return contact
}


function filterSubTask(id){
    let subTask = ""

    for (let i = 0; i < task[id].Subtask[0].length; i++) {
        const element = task[id].Subtask[0][i];
        subTask += `<li class="d-flex subtaskList"><input type="checkbox" class="subtask-checkbox-${id}" onclick="updateProgress('${id}')"><p>${element}</p></li> `
    }

    return subTask
}



function closeDetailCard(event) {
    const overlay = document.getElementById("overlay");
    const detailCard = document.getElementById("overlay");

    // Überprüft, ob das Klick-Event auf das Overlay und nicht auf die Detailkarte (oder deren Kinder) erfolgt ist
    if (event.target === overlay) {
        document.getElementById("overlay").classList.add("d-none"); 
        document.getElementById("overlay").classList.remove("d-flex");  // Versteckt das Overlay
    }
}