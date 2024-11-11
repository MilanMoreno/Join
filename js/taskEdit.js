/**
 * This function delete the Task from Firebase.
 * 
 * @param {number} id - This is the id frome the Task on with Place the task is saved at Firebase.
 */
async function deleteTask(id) {
    let firebaseURL = "https://creative33-9f884-default-rtdb.firebaseio.com/task/" + id + ".json"
    try {
      const response = await fetch(firebaseURL, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'}
      });
      if (response.ok) {
          location.reload();
      } else {console.error('Fehler beim Löschen des Tasks:', response.statusText);}
  } catch (error) {
      console.error('Fehler beim Löschen des Tasks:', error);
}}

/**
 * This function fill the AddTask Popup from the board page.
 * 
 * @param {string} positionId - Give the position on the board who the new Task are saved.
 */
function fillAddTaskPopUp(positionId){
    selectedCheckboxes = [];
    subTask = [];
    document.getElementById("main").classList.add ("scrollhidden")
    document.getElementById("body").classList.add ("scrollhidden")
    let addTaskSection = document.getElementById("addTaskSection")
    let background = document.getElementById("addTaskSectionBackground")
    background.classList.remove ("d-none");
    addTaskSection.innerHTML = fillAddTaskSection(positionId);
    setMinDate();
}

/**
 * This function close the AddTask popup at the board Page.
 */
function closePopUp(){
    document.getElementById("addTaskSectionBackground").classList.add ("d-none");
    document.getElementById("main").classList.remove ("scrollhidden");
    document.getElementById("body").classList.remove ("scrollhidden");
}

oldTask = []

/**
 * This Function open the Edit Task popup at the board page.
 * 
 * @param {string} title - Title from the Saved Task
 * @param {string} category -Category from the Saved Task
 * @param {number} dueDate - Date from the Saved Task
 * @param {string} description - Discription from the Saved Task
 * @param {string} positionID - Position ID from the Saved Task
 * @param {number} id -Id from the Saved Task
 * @param {string} Prio -Priority from the Saved Task
 */
function editTask(title, category, dueDate, description, positionID, id, Prio){
    oldTask = []
    document.getElementById("overlay").onclick = null;
    let addTaskSection = document.getElementById("detailCard")
    oldTask.push (title)
    addTaskSection.innerHTML = fillEditTaskSection(title, category, dueDate, description, positionID, id,);
    checkPrioEdit(Prio);
    checkboxHelp(id);
    setMinDate();
}

/**
 * This function Mark the right priority button at the Edit popup
 */
function checkPrioEdit(prioCheck){
    prio = prioCheck
    if(prio == ""){}else{
    document.getElementById(`${prioCheck}`).classList.add (`color${prioCheck}`);
    document.getElementById(`${prioCheck}Color`).classList.add (`d-none`);
    document.getElementById(`${prioCheck}White`).classList.remove (`d-none`);}
}

/**
 * This Function delete the old Task when the title change
 * 
 * @param {string} path - Give the path frome firebase. 
 */
async function deleteForEdit(path) {
    let firebaseURL = "https://creative33-9f884-default-rtdb.firebaseio.com/task/" + path + ".json"
    if (event) event.preventDefault();
    try {
      const response = await fetch(firebaseURL, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'}
      });
      if (response.ok) {
      } else {console.error('Fehler beim Löschen des Tasks:', response.statusText);}
  } catch (error) {
      console.error('Fehler beim Löschen des Tasks:', error);
  }}

  /**
   * This help function edit the Saved task at firebase 
   * 
   * @param {string} positionID - Position from the Saved Task
   * @param {number} id - Id from the Saved Task
   */
 async function editTaskPopup(positionID, id){
    let button = document.getElementById("editTaskButton");
    button.disabled = true;
    let newTask = document.getElementById("addTasktitleInput");
    if (oldTask[0] === newTask.value){
    await addTaskPopup2(positionID, id);
    document.getElementById("overlay").onclick = closeDetailCard;
} else {
       await deleteForEdit(oldTask[0]);
        await addTaskPopup2(positionID, id);
        document.getElementById("overlay").onclick = closeDetailCard;
    }
  }

  /**
   * This function close the Assign to List at the form.
   */
  function hideAssignlist() {
    document.getElementById("hideAssignlist").classList.add("d-none");
    document.getElementById("assingedList").classList.add("d-none");
    renderSelectedContacts();
  }

  /**
   * This Open and generate the Assign to List at the form.
   */
  async function generateAssingTo() {
    await loadContacts();
    if (document.getElementById("assingedList").innerHTML === "") {
      let assigned = "";
      for (let i = 0; i < contacts.length; i++) {
        const element = contacts[i].name;
        const circle = generateCircle(element);
        const isChecked = selectedCheckboxes.includes(element) ? "checked" : "";
        assigned += generateAssingToTemplate(i, circle, element, isChecked);}
      document.getElementById("assingedList").innerHTML = assigned;}
    document.getElementById("hideAssignlist").classList.remove("d-none");
    document.getElementById("assingedList").classList.remove("d-none");}

/**
 * This function limit the text length on the Task Card
 * 
 * @param {string} text - Is the text to shorten.
 */
function limitTextLength(text) {
    if (text.length > 50) {
      content = text.slice(0, 50) + "...";
    } else {content = text;}
    return content;
  }

/**
 * This function returns the correct date format.
 * 
 * @param {number} dateString - Is the original date format
 */
function formatDateToDDMMYYYY(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }
  
/**
 * This function check witch Category is used and return the correct class.
 * 
 * @param {string} category - Is the used Category
 */
function checkCategory(category) {
    if (category === "Technical Task") {
      catClass = "technical";
    } else if (category === "User Story") {
      catClass = "user";
    } else if (category === "") {
      catClass = "";}
    return catClass;
  }

/**
 * This function check the used Priority and returns the correct img src.
 * 
 * @param {string} prio 
 */
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
      prioImgSrc = "";}
    return prioImgSrc;
  }

/**
 * This function generate a random color for the Background for contact initials at the Task card.
 */
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

/**
* This function clear the board.
*/
function emptyContent() {
    document.getElementById(`toDo`).innerHTML = `<div id="toDoPlaceholder" class="noTask d-flex"><p>No tasks To do</p></div>`;
    document.getElementById(`inProgress`).innerHTML = `<div id="progressPlaceholder" class="noTask d-flex"><p>No tasks In progress</p></div>`;
    document.getElementById(`awaitFeedback`).innerHTML = `<div id="feedbackPlaceholder" class="noTask d-flex"><p>No tasks Await feedback</p></div>`;
    document.getElementById(`done`).innerHTML = `<div id="donePlaceholder" class="noTask d-flex"><p>No tasks Done</p></div>`;
  }

/**
 * This function focus the inputfield when click at the div container detectet. 
 * 
 * @param {string} inputId - Is the ID from the inputfield wich are clicked.
 */
function focusInput(inputId) {
    document.getElementById(inputId).focus();
  }

/**
 * This function check if the div container contains task else show Placeholder.
 */
function checkPlaceholderVisibility() {
    const sections = [
      { container: document.getElementById("toDo"),
        placeholder: document.getElementById("toDoPlaceholder"),},
      { container: document.getElementById("inProgress"),
        placeholder: document.getElementById("progressPlaceholder"),},
      { container: document.getElementById("awaitFeedback"),
        placeholder: document.getElementById("feedbackPlaceholder"),},
      { container: document.getElementById("done"),
        placeholder: document.getElementById("donePlaceholder"),},];
    for (const section of sections) {
      const hasContent = section.container.querySelectorAll(".card").length > 0;
      section.placeholder.style.display = hasContent ? "none" : "flex";}}

/**
 * This function close the detail card at click at the cross.
 */
function closeDetailCardX() {
    document.getElementById("overlay").classList.add("d-none");
    document.getElementById("overlay").classList.remove("d-flex");
    if (document.getElementById("body").classList.contains("scrollhidden")) {
      document.getElementById("body").classList.remove("scrollhidden");}
    document.getElementById("overlay").onclick = closeDetailCard;}