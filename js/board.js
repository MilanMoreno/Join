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
    }
}


// Template für die Karten, das eindeutige IDs und Klassen verwendet
function fillTemplate(title, category, text, assigned, prio, id){
    let priosrc = checkPrio(prio);
    let catClass = checkCategory(category);
    let content = limitTextLength(text);

    return /*html*/ `
    <div class="card" onclick="openDetailCard(id)">
        <div class="cardCategory ${catClass}">${category}</div>
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

        <!-- Subtasks Container -->
        <div id="subtasksContainer${id}" class="subtask-container">
            <input type="checkbox" class="subtask-checkbox-${id}" onclick="updateProgress('${id}')"> Subtask 1<br>
            <input type="checkbox" class="subtask-checkbox-${id}" onclick="updateProgress('${id}')"> Subtask 2<br>
            <input type="checkbox" class="subtask-checkbox-${id}" onclick="updateProgress('${id}')"> Subtask 3<br>
            <input type="checkbox" class="subtask-checkbox-${id}" onclick="updateProgress('${id}')"> Subtask 4<br>

            <!-- Dynamische Liste von Subtasks -->
            <ul id="subTaskView${id}">
                <li>Subtask 1</li>
                <li>Subtask 2</li>
                <li>Subtask 3</li>
                <li>Subtask 4</li>
            </ul>
        </div>
    </div>`;
}

// Fortschrittsaktualisierungsfunktion, die auf die spezifische Karte abzielt
function updateProgress(id) {
    // IDs für das spezifische Element erstellen
    let progressBarID = "progressBar" + id;
    let progressTextID = "progressText" + id;
    let subTaskViewID = "subTaskView" + id;

    // Ermitteln der gesamten Anzahl an Subtasks für die spezifische Karte
    const totalSubtasks = document.getElementById(subTaskViewID).children.length;

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
    let contentSection = document.getElementById("detailCard")
    let assign = filterContact(id);
    let cardSubTask = filterSubTask(id);

    contentSection.innerHTML = /*html*/`
        <div>
            <div><div>${task.id.Category}</div><p onclick="closeDetailCard()">X</p></div>
            <h2>${task.id.title}</h2>
            <div>
                <p>${task.id.Description}</p>
                <div><p>DueDate:</p><p>${task.id.DueDate}</p> </div>
                <div><p>Priority:</p><p>${task.id.Prio}<img src="" alt=""></p></div>
            </div>
            <ul>
                <p>Assigned To:</p>
                ${assign}
            </ul>
            <p>Subtasks</p>
            <ul>
                ${cardSubTasks}
            </ul>
        </div>   
    `
}