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


function fillTemplate(title, category, text, zuteilung, prio){
    let priosrc = checkPrio(prio)

    return /*html*/ `<div>
        <div>${category}</div>
        <h3>${title}</h3>
        <p>${text}</p>
        <div>balken und text</div>
        <div><div>zugeteilt</div><img src="${priosrc}"></div>
    </div>`;
}


function checkPrio(prio){
    const urgent = "./assets/img/icon_PrioAltaRed.svg";
    const medium = "./assets/img/icon_PrioMediaOrange.svg";
    const low = "./assets/img/icon_PrioBajaGreen.svg";

    // Variable für die Bild-URL, basierend auf `prio`
    let prioImgSrc = "";

    // Prüfe den Wert von `prio` und weise die entsprechende Bild-URL zu
    if (prio === "urgent") {
        prioImgSrc = urgent;
    } else if (prio === "medium") {
        prioImgSrc = medium;
    } else if (prio === "low") {
        prioImgSrc = low;
    } else {
        prioImgSrc = ""; // Optional: Standardbild oder leer lassen, falls `prio` unbekannt ist
    }

    return prioImgSrc;
}