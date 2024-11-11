let task = [];
let BASE_URL = "https://creative33-9f884-default-rtdb.firebaseio.com/task/";

/**
 * Fetches tasks from a Firebase database, processes the data, 
 * and updates the `task` array. If no data is received, logs an error. 
 * After loading tasks, it renders the tasks and loads contacts.
 */
async function loadTasks() {
  try {
    const response = await fetch(`${BASE_URL}.json`);
    if (!response.ok) {throw new Error(`Fehler beim Laden der Daten: ${response.statusText}`);}
    const taskData = await response.json();
    if (!taskData) {console.error("Keine Daten aus Firebase erhalten oder Daten sind leer.");
      return;}
    task.length = 0;
    for (const key in taskData) {
      if (taskData.hasOwnProperty(key)) {
        task.push(taskData[key]);
      }}
  } catch (error) {console.error("Fehler beim Laden der Daten:", error);}
  render();
  loadContacts();
}

/**
 * This function render the Task wich loaded frome the Firebase Database.
 * 
 * @param {string} filtered - if set than it rander only filtered Task.
 */
function render(filtered) {
  let tasks = "";
  if (filtered === undefined) {
    tasks = task;
  } else {tasks = filtered;}
  emptyContent();
  for (let i = 0; i < tasks.length; i++) {
    const element = tasks[i];
    const assignedTo =
      tasks[i].AssignedTo && tasks[i].AssignedTo.length > 0
        ? tasks[i].AssignedTo
        : "";
    contentHTML = fillTemplate(tasks[i].Title, tasks[i].Category, tasks[i].Description, assignedTo, tasks[i].Prio, i);
    document.getElementById(`${tasks[i].PositionID}`).innerHTML += contentHTML;
    updateProgress(i);}
  checkPlaceholderVisibility();}

/**
 * This function generate initials for  selectet contacts at the Task card. 
 * 
 * @param {string} names - is the name from the contact.
 *  
 */
function getInitials2(names) {
  let initial = "";
  if (names.length === 0) {initial += "";
    return initial;} else {
    const maxVisibleContacts = 5;
    const extraContacts = names.length - maxVisibleContacts;
    names.slice(0, maxVisibleContacts).forEach((element) => {
      const color = getRandomColor();
      const nameParts = element.split(" ");
      const initials = nameParts.map((part) => part.charAt(0)).join("");
      const ini = initials.toUpperCase();
      initial += `<div class="initials" style="background-color: ${color};">${ini}</div>`;});
    if (extraContacts > 0) {
      initial += `<div class="initials" style="background-color: grey;">+${extraContacts}</div>`;}
    return initial;}}

    /**
     * This function generate the initials for the Deital Card.
     * 
     * @param {string} names - is the name from the contact.
 *  
     */
function getInitialsDetail(names) {
  let initial = "";
  const color = getRandomColor();
  const nameParts = names.split(" ");
  const initials = nameParts.map((part) => part.charAt(0)).join("");
  ini = initials.toUpperCase();
  initial += `<div class="initialsDetails" style="background-color: ${color};">${ini}</div>`;
  return initial;
}

/**
 * This function update the Progressbar.
 * 
 * @param {number} id - is the id from the Task card.
 */
function updateProgress(id) {
  let progressBarID = "progressBar" + id;
  let progressTextID = "progressText" + id;
  const totalSubtasks = taskLenght(id);
  const completedSubtasks = numberOfChecked(id);
  const progressPercentage = (completedSubtasks / totalSubtasks) * 100;
  const progressBarElement = document.getElementById(progressBarID);
  if (totalSubtasks === 0) {
    document.getElementById(`progressContainer${id}`).classList.add("d-none");
  } else {
    if (progressBarElement) {
      progressBarElement.style.width = `${progressPercentage}%`;}
    const progressTextElement = document.getElementById(progressTextID);
    if (progressTextElement) {
      progressTextElement.innerText = `${completedSubtasks}/${totalSubtasks} Subtasks`;
}}}

/**
 * This function returns the length from the Task List.
 * 
 * @param {number} id - id from the Task.
 */
function taskLenght(id) {
  let result;
  if (task[id].Subtask && task[id].Subtask[0]) {
    result = task[id].Subtask[0].length;
  } else {result = 0;}
  return result;
}

/**
 * This function returns the count of checked task. 
 * 
 * @param {number} id - ID from the task.
 */
function numberOfChecked(id) {
  let count = 0;
  if (task[id].checkboxState && task[id].checkboxState[0]) {
    for (let i = 0; i < task[id].checkboxState[0].length; i++) {
      const element = task[id].checkboxState[0][i].checked;
      if (element === true) {
        count = count + 1;
      } else {count = count + 0;}}
  } else {return count;}
  return count;
}

/**
 * This function check the priority and returns the correct img src for the detrail card.
 * 
 * @param {string} prio - Used priority
 */
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
    prioImgSrc = "";
  }
  return prioImgSrc;
}

/**
 * This function open the detail card.
 * 
 * @param {number} id - Id from the Task
 */
function openDetailCard(id) {
  let contentSection = document.getElementById("overlay");
  let assign = filterContact(id);
  let cardSubTask = filterSubTask(id);
  let catClass = checkCategory(task[id].Category);
  let formattedDate = formatDateToDDMMYYYY(task[id].DueDate);
  let priosrc = checkPrioDetail(task[id].Prio);
  fillDetailTemplate(id, contentSection, assign, cardSubTask, catClass, formattedDate, priosrc);
  document.getElementById("overlay").classList.remove("d-none");
  document.getElementById("overlay").classList.add("d-flex");
  document.getElementById("body").classList.add("scrollhidden");
}

/**
 * This function change the Position after Drag and Drop from the task
 * 
 * @param {number} id - Task ID
 * @param {string} title - Task title
 */
async function changePosition(id, title) {
  const position = document.getElementById("positionSwitch").value;
  idUpdate = id;
  savedTitle = title;
  await updateTaskPosition(position);
  await loadTasks();
  closeDetailCardX();
}

/**
 * This function filter the selectet Contacts for the deitail card
 * 
 * @param {number} id - Task ID
 */
function filterContact(id) {
  let tasks = task;
  let contact = "";
  if (tasks[id] && "AssignedTo" in tasks[id]) {
    for (let i = 0; i < tasks[id].AssignedTo.length; i++) {
      const element = tasks[id].AssignedTo[i];
      const initial = getInitialsDetail(element);
      contact += `<li class="assignList d-flex">${initial}${element}</li>`;
    }
  } else {contact += "";}
  return contact;
}

/**
 * This function filter the Subtask and checkmark the checked Subtask.
 * 
 * @param {number} id - Task ID
 */
function filterSubTask(id) {
  let subTask = "";
  if (task[id].Subtask && task[id].Subtask[0]) {
    for (let i = 0; i < task[id].Subtask[0].length; i++) {
      const element = task[id].Subtask[0][i];
      const checkedTask = task[id].checkboxState[0][i].checked;
      const checked = filterCheckBox(checkedTask);
      subTask += filterSubTaskTemplate(id, i, checked, element);}
  } else {
    return subTask;}
  return subTask;
}

/**
 * This function check wich subtask are checked
 * 
 * @param {true or false} checked - if checked or not
 */
function filterCheckBox(checked) {
  if (checked === true) {
    return "checked";
  } else {return "unchecked";}
}

/**
 * This function Updates the firebase and progressbar when a subtask checked
 * 
 * @param {number} id - Task ID
 * @param {number} i - Subtask Position
 */
function updatecheckbox(id, i) {
  updateCheckboxStateInFirebase(i, id);
  updateProgress(id);
}

/**
 * This function close the Detail card when clicked at the backgrund.
 * 
 * @param {event} event - give the positon from the click. 
 */
function closeDetailCard(event) {
  const overlay = document.getElementById("overlay");
  const detailCard = document.getElementById("overlay");
  if (event.target === overlay) {
    document.getElementById("overlay").classList.add("d-none");
    document.getElementById("overlay").classList.remove("d-flex");
  }
}

let draggedElement;
let idUpdate;
let savedTitle;

/**
 * This function saves the Information for Drag and Drop
 * 
 * @param {event} event 
 * @param {number} id - Task Id
 * @param {string} name - Task Title
 */
function drag(event, id, name) {
  draggedElement = event.target;
  idUpdate = id;
  savedTitle = name;
  task = task;
  event.dataTransfer.setData("text", event.target.id);
}

/**
 * This function show the outline from the drop container when drag over.
 * 
 * @param {event} event - position of the element 
 */
function allowDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.add("drag-over");
}

/**
 * This function Remove the outline when drag Leave.
 *  
 * @param {event} event - position of the element
 */
function dragLeave(event) {
  event.currentTarget.classList.remove("drag-over");
}

/**
 * This function finish the drag an drop when droped and update the position.
 * 
 * @param {event} event - position of the element
 */
function drop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove("drag-over");
  if (draggedElement && event.currentTarget !== draggedElement.parentNode) {
    event.currentTarget.appendChild(draggedElement);
    checkPlaceholderVisibility();
  }
  const dropTargetID = event.currentTarget.id;
  updateTaskPosition(dropTargetID);
}

/**
 * This function help the update and geneerate the Information
 * 
 * @param {string} dropTargetID - ID from drop container
 */
async function updateTaskPosition(dropTargetID) {
  task[idUpdate].PositionID = dropTargetID;
  taskSave = task[idUpdate];
  await updatePosition(task.Title, taskSave);
}

/**
 * This function update the firebase database when a subtask are checked
 * 
 * @param {number} checkboxId - ID witch subtask are checked
 * @param {number} taskId - Task ID
 */
async function updateCheckboxStateInFirebase(checkboxId, taskId) {
  const checkbox = document.getElementById(`${taskId}${checkboxId}`);
  const checkboxState = { checked: checkbox.checked };
  task[taskId].checkboxState[0][checkboxId] = checkboxState;
  const data = task[taskId].checkboxState[0];
  const taskTitle = task[taskId].Title;
  await fetch(
    `https://creative33-9f884-default-rtdb.firebaseio.com/task/${taskTitle}/checkboxState/0.json`,
    {
      method: "PUT",
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error updating checkbox state:", error));
}

/**
 * This function update the firebase database when Task are drag and drop to a new position.
 * 
 * @param {string} path - task path in firebase
 * @param {string} data - contains the new data
 */
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

/**
 * This function filter the task at the board page.
 * 
 * @param {number} id - ID from the input.
 */
function filterTasks(id) {
  const filterInput = document.getElementById(id).value.toLowerCase();
  const filteredTasks = task.filter((task) => {
    return (
      task.Title.toLowerCase().includes(filterInput) ||
      task.Description.toLowerCase().includes(filterInput)
    );
  });
  render(filteredTasks);
}