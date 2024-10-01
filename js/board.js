let task = [] ;
let BASE_URL = "https://creative33-9f884-default-rtdb.firebaseio.com/task";




async function loadTask() {
    try {
        // Lade die Daten aus Firebase
        const response = await fetch(`${BASE_URL}.json`);
        
        // Überprüfe, ob die Anfrage erfolgreich war
        if (!response.ok) {
            throw new Error(`Fehler beim Laden der Daten: ${response.statusText}`);
        }

        // Parse die Antwort in ein JSON-Objekt
        const taskData = await response.json();
        
        // Falls die Antwort `null` oder leer ist, gebe eine Fehlermeldung aus
        if (!taskData) {
            console.error("Keine Daten aus Firebase erhalten oder Daten sind leer.");
            return;
        }

        // Leere das `task`-Array, um alte Daten zu entfernen (optional)
        task.length = 0;

        // Füge die Daten in das `task`-Array ein
        // Falls `taskData` ein Objekt ist, iteriere durch die Schlüssel und füge die Werte (Aufgaben) hinzu
        for (const key in taskData) {
            if (taskData.hasOwnProperty(key)) {
                task.push(taskData[key]);
            }
        }

        // Logge die geladenen Daten zur Überprüfung
        console.log("Geladene Aufgaben:", task);

    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }

    render();
}


function render() {
    
    console.log(task)
    for (let i = 0; i < task.length; i++) {
        const element = task[i];

        
        contentHTML = fillTemplate(task[i].Title, task[i].Category, task[i].Description, task[i].AssignedTo, task[i].Prio);
        document.getElementById(`${task[i].PositionID}`).innerHTML += contentHTML;
    }

    
    

}


function fillTemplate(title, category, text, assigned, prio){
    let priosrc = checkPrio(prio);
    let catClass= checkCategory(category);
    let content = limitTextLength(text);
    return /*html*/ `<div class="card">
        <div class="cardCategory ${catClass}">${category}</div>
        <h3 class="cardTitle">${title}</h3>
        <p class="cardText">${content}</p>
        <div class="cardBalken">balken und text</div>
        <div class="cardFooter d-flex d-space"><div class="cardAssigned">zugeteilt</div><img class="cardPrio" src="${priosrc}"></div>
    </div>`;
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