let contacts = [];
let Second_URL = "https://creative33-9f884-default-rtdb.firebaseio.com/contact";


async function loadContacts() {
  try {
    const response = await fetch(`${Second_URL}.json`);
    if (!response.ok) {
      throw new Error(`Fehler beim Laden der Daten: ${response.statusText}`);
    }
    const contactData = await response.json();
    if (!contactData) {
      console.error("Keine Daten aus Firebase erhalten oder Daten sind leer.");
      return;
    }
    contacts.length = 0;
    for (const key in contactData) {
      if (contactData.hasOwnProperty(key)) {
        contacts.push(contactData[key]);
      }
    }
  } catch (error) {
    console.error("Fehler beim Laden der Daten:", error);
  }
}


async function generateAssingTo() {
  await loadContacts();
  if (document.getElementById("assingedList").innerHTML === "") {
    let assigned = "";
    for (let i = 0; i < contacts.length; i++) {
      const element = contacts[i].name;
      const circle = generateCircle(element);
      const isChecked = selectedCheckboxes.includes(element) ? "checked" : "";
      assigned += `
    <div class="d-flex assingUser">
    <label class="container" >
      <div class="d-flex assingLeft" id="container${i}">
        <div>${circle}</div>
        <p>${element}</p>
      </div>    
      <input id="${element}" type="checkbox" ${isChecked} onclick="checkboxshow(${i})">
      <img src="imgs/ckeckMark.png" alt="" class="white d-none checkmark" id="check${i}">
      <img src="imgs/mark.png" alt="" class=" checkmark" id="mark${i}"}]>
    </label>
    </div>`;
    }
    document.getElementById("assingedList").innerHTML = assigned;
  }
  document.getElementById("hideAssignlist").classList.remove("d-none");
  document.getElementById("assingedList").classList.remove("d-none");
}


function hideAssignlist() {
  document.getElementById("hideAssignlist").classList.add("d-none");
  document.getElementById("assingedList").classList.add("d-none");
  renderSelectedContacts();
}


function generateCircle(names) {
  let initial = "";
  const color = getRandomColor();
  const nameParts = names.split(" ");
  const initials = nameParts.map((part) => part.charAt(0)).join("");
  ini = initials.toUpperCase();
  initial += `<div class="initialsDetails" style="background-color: ${color};">${ini}</div>`;
  return initial;
}


function getInitialsDetail(names) {
  let initial = "";
  const color = getRandomColor();
  const nameParts = names.split(" ");
  const initials = nameParts.map((part) => part.charAt(0)).join("");
  ini = initials.toUpperCase();
  initial += `<div class="initialsDetails" style="background-color: ${color};">${ini}</div>`;
  return initial;
}


function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function addTaskTemplate() {
  return /*html*/ `
  <form id="addTaskForm">
    <div class="addTaskContent d-flex">
        <div class="addTaskHeader d-flex">
            <h1 class="addTaskHeader">Add Task</h1>
        </div>
        <div class="d-flex d-space addTaskBody">
          <div class="addTaskLeft d-flex">
            <div class="d-flex"><p>Title</p><p class="red">*</p></div>
            
              <input id="addTasktitleInput" type="text" placeholder="Enter a title" >
              <p id="requiredTitle" class="required d-none">This field is required</p>
            
            <p>Description</p>
            <textarea cols="50" placeholder="Enter a Description" name="Discription" id="addTaskDiscription"></textarea>
            <p>Assigned to</p>
            <div class="assingedField d-flex"><input id="assinged" class="assingedInput" type="text" placeholder="Select contacts to assign" onfocus="generateAssingTo()" oninput="filterContacts()"><img class="icon" src="./assets/img/arrow_drop_down.png" alt=""></div>
            <div id="hideAssignlist" class="d-none" onclick="hideAssignlist()"></div><div id="assingedList" class="assingedList d-none" onclick="event.stopPropagation();"></div>
            <div id="electedContacts" class="d-flex "></div>
          </div>
          <div class="middleLine"></div>
          <div class="addTaskRight d-flex">
            <div class="d-flex"><p>Due date</p><p class="red">*</p></div>
            
            <input type="date" name="Date" id="addTaskDate" onblur="validateDateInput()">
            <p id="requiredDate" class="required d-none">This field is required</p>
            <p id="pastDate" class="required d-none">The date must not be in the past</p>
            <p>Prio</p>
            <div class="d-flex d-space">
                <button type="button" id="urgent" onclick="setPrio('urgent')">Urgent <img id="urgentColor" src="./assets/img/icon_PrioAltaRed.svg" alt=""><img id="urgentWhite" class="urgentWhite d-none" src="./assets/img/PrioWhite.svg" alt=""></button>
                <button type="button" id="medium" onclick="setPrio('medium')" class="colormedium">Medium <img id="mediumColor" class="d-none" src="./assets/img/icon_PrioMediaOrange.svg" alt=""><img id="mediumWhite" src="./assets/img/icon_PrioMediaWhite.svg" alt=""></button>
                <button type="button" id="low" onclick="setPrio('low')">Low <img id="lowColor" src="./assets/img/icon_PrioBajaGreen.svg" alt=""><img id="lowWhite" class="d-none" src="./assets/img/PrioWhite.svg" alt=""></button></div>
            <div class="d-flex"><p>Category</p><p class="red">*</p></div>
          
            <select name="Category" id="addTaskCategory" >
                <option disabled selected value="">Select task Category</option>
                <option value="Technical Task">Technical Task</option>
                <option value="User Story">User Story</option>
           </select>
           <p id="requiredCat" class="required d-none">This field is required</p>
          
            <p>Subtasks</p>
            <div id="pointer" onclick="openAddSubTask()" class="d-flex subTask">
                <input id="subTaskAdd" type="text" placeholder="Add new subtask" onkeydown="checkEnter(event, 'subTaskAdd')">
                <img id="subTaskPlus" class="subTaskPlus" src="./assets/img/icon_subtasks.svg" alt="">
                <div id="activSubTask" class="d-none d-center">
                    <img onclick="cancelSubTask()" class="subTaskCross" src="./assets/img/icon_closeVectorBlack.svg" alt="">
                    <div class="middleLineShort"></div>
                    <img onclick="addSubTask()" class="subTaskCheck" src="./assets/img/check.png" alt="">
                </div>
            </div>
            <ul id="subTaskView"></ul>
        </div>
    </div>
    <div class="addTaskFooter d-flex d-space">
            <div class="addTaskNote d-flex">
                <p class="red note">*</p><p class="note">This field is required</p>
            </div>
            <div class="addTaskSubmit d-flex d-space">
                <button type="button" onclick="renderAddTask()" class="clear d-flex">Clear <img src="./assets/img/icon_closeVectorBlack.svg" alt=""></button>
                <button type="button" id="submitButton" onclick="addTaskSummit()" class="createTask d-flex" >Create Task <img src="./assets/img/icon_check-white.svg" alt=""></button>
            </div>
        </div>
    </div>
  </form>
  <div id="confirmationMessage" class="confirmation hidden">Task added to board <img class="conformationImg" src="./assets/img/icon_board.svg" alt=""></div>
    `;
}


function fillAddTaskSection(positionId) {
  return /*html*/ `
  <form id="addTaskForm">
    <div class="addTaskContent d-flex">
        <div class="addTaskHeader d-flex d-space headerResponsiv">
            <h1 class="addTaskHeader">Add Task</h1>
            <img onclick="closePopUp()" src="./assets/img/icon_closeVectorBlack.svg" alt="close">
        </div>
        <div class="d-flex d-space addTaskBody">
          <div class="addTaskLeft d-flex">
            <div class="d-flex"><p>Title</p><p class="red">*</p></div>
            <input id="addTasktitleInput" type="text" placeholder="Enter a title" >
            <p id="requiredTitle" class="required d-none">This field is required</p>
            <p>Description</p>
            <textarea cols="50" placeholder="Enter a Description" name="Discription" id="addTaskDiscription"></textarea>
            <p>Assigned to</p>
            <div class="assingedField d-flex"><input id="assinged" class="assingedInput" type="text" placeholder="Select contacts to assign" onfocus="generateAssingTo()" oninput="filterContacts()"><img class="icon" src="./assets/img/arrow_drop_down.png" alt=""></div>
            <div id="hideAssignlist" class="d-none" onclick="hideAssignlist()"></div><div id="assingedList" class="assingedList d-none" onclick="event.stopPropagation();"></div>
            <div id="electedContacts" class="d-flex"></div>
          </div>
          <div class="middleLine"></div>
          <div class="addTaskRight d-flex">
            <div class="d-flex"><p>Due date</p><p class="red">*</p></div>
            <input type="date" name="Date" id="addTaskDate" onblur="validateDateInput()">
            <p id="requiredDate" class="required d-none">This field is required</p>
            <p id="pastDate" class="required d-none">The date must not be in the past</p>
            <p>Prio</p>
            <div class="d-flex d-space">
                <button type="button" id="urgent" onclick="setPrio('urgent')">Urgent <img id="urgentColor" src="./assets/img/icon_PrioAltaRed.svg" alt=""><img id="urgentWhite" class="urgentWhite d-none" src="./assets/img/PrioWhite.svg" alt=""></button>
                <button type="button" id="medium" onclick="setPrio('medium')" class="colormedium">Medium <img id="mediumColor" class="d-none" src="./assets/img/icon_PrioMediaOrange.svg" alt=""><img id="mediumWhite" src="./assets/img/icon_PrioMediaWhite.svg" alt=""></button>
                <button type="button" id="low" onclick="setPrio('low')">Low <img id="lowColor" src="./assets/img/icon_PrioBajaGreen.svg" alt=""><img id="lowWhite" class="d-none" src="./assets/img/PrioWhite.svg" alt=""></button></div>
            <div class="d-flex"><p>Category</p><p class="red">*</p></div>
           <select name="Category" id="addTaskCategory" >
                <option disabled selected value="">Select task Category</option>
                <option value="Technical Task">Technical Task</option>
                <option value="User Story">User Story</option>
           </select>
           <p id="requiredCat" class="required d-none">This field is required</p>
            <p>Subtasks</p>
            <div id="pointer" onclick="openAddSubTask()" class="d-flex subTask">
                <input id="subTaskAdd" type="text" placeholder="Add new subtask" onkeydown="checkEnter(event, 'subTaskAdd')">
                <img id="subTaskPlus" class="subTaskPlus" src="./assets/img/icon_subtasks.svg" alt="">
                <div id="activSubTask" class="d-none d-center">
                    <img onclick="cancelSubTask()" class="subTaskCross" src="./assets/img/icon_closeVectorBlack.svg" alt="">
                    <div class="middleLineShort"></div>
                    <img onclick="addSubTask()" class="subTaskCheck" src="./assets/img/check.png" alt="">
                </div>
            </div>
            <ul id="subTaskView"></ul>
        </div>
    </div>
    <div class="addTaskFooter d-flex d-space">
            <div class="addTaskNote d-flex">
                <p class="red note">*</p><p class="note">This field is required</p>
            </div>
            <div class="addTaskSubmit d-flex d-space">
                <button type="button" onclick="fillAddTaskPopUp()" class="clear d-flex">Clear <img src="./assets/img/icon_closeVectorBlack.svg" alt=""></button>
                <button type="button" id="addTaskPopupButton" onclick="addTaskPopup('${positionId}')" class="createTask d-flex" >Create Task <img src="./assets/img/icon_check-white.svg" alt=""></button>
            </div>
        </div>
    </div>
  </form>
  <div id="confirmationMessage" class="confirmation hidden">Task added to board <img class="conformationImg" src="./assets/img/icon_board.svg" alt=""></div>
    `;
}


function fillEditTaskSection(
  titleId,
  category,
  dueDate,
  Description,
  positionID,
  id
) {
  let subTask = fillsubtask(id);
  return /*html*/ `
  <form id="addTaskForm">
    <div class="addTaskContent d-flex">
        <div class="editTaskX">
            <img onclick="closeDetailCardX()" src="./assets/img/icon_closeVectorBlack.svg" alt="close">
        </div>
        <div class="d-flex d-space addTaskBody">
          <div class="addTaskLeft d-flex">
            <div class="d-flex"><p>Title</p><p class="red">*</p></div>
            <input id="addTasktitleInput" type="text" placeholder="Enter a title" value="${titleId}" >
            <p id="requiredTitle" class="required d-none">This field is required</p>
            <p>Description</p>
            <textarea cols="50" placeholder="Enter a Description" name="Discription" id="addTaskDiscription" >${Description}</textarea>
            <div class="d-flex"><p>Due date</p><p class="red">*</p></div>
            <input type="date" name="Date" id="addTaskDate" value="${dueDate}" >
            <p id="requiredDate" class="required d-none">This field is required</p>
            <p>Prio</p>
            <div class="d-flex d-space">
                <button type="button" id="urgent" onclick="setPrio('urgent')">Urgent <img id="urgentColor" src="./assets/img/icon_PrioAltaRed.svg" alt=""><img id="urgentWhite" class="urgentWhite d-none" src="./assets/img/PrioWhite.svg" alt=""></button>
                <button type="button" id="medium" onclick="setPrio('medium')">Medium <img id="mediumColor" src="./assets/img/icon_PrioMediaOrange.svg" alt=""><img id="mediumWhite" class="d-none" src="./assets/img/icon_PrioMediaWhite.svg" alt=""></button>
                <button type="button" id="low" onclick="setPrio('low')">Low <img id="lowColor" src="./assets/img/icon_PrioBajaGreen.svg" alt=""><img id="lowWhite" class="d-none" src="./assets/img/PrioWhite.svg" alt=""></button></div>
            <p>Assigned to</p>
            <div class="assingedField d-flex"><input id="assinged" class="assingedInput" type="text" placeholder="Select contacts to assign" onfocus="generateAssingTo()" oninput="filterContacts()"><img class="icon" src="./assets/img/arrow_drop_down.png" alt=""></div>
            <div id="hideAssignlist" class="d-none" onclick="hideAssignlist()"></div><div id="assingedList" class="assingedList d-none" onclick="event.stopPropagation();"></div>
            <div id="electedContacts" class="d-flex"></div>
            <p>Subtasks</p>
            <div id="pointer" onclick="openAddSubTask()" class="d-flex subTask">
                <input id="subTaskAdd" type="text" placeholder="Add new subtask"  onkeydown="checkEnter(event, 'subTaskAdd')">
                <img id="subTaskPlus" class="subTaskPlus" src="./assets/img/icon_subtasks.svg" alt="">
                <div id="activSubTask" class="d-none d-center">
                    <img onclick="cancelSubTask()" class="subTaskCross" src="./assets/img/icon_closeVectorBlack.svg" alt="">
                    <div class="middleLineShort"></div>
                    <img onclick="addSubTask()" class="subTaskCheck" src="./assets/img/check.png" alt="">
                </div>
            </div>
            <ul id="subTaskView" class="editSubtaskView">${subTask}</ul>
            <div class="editFooter d-flex d-space">
            <div class="addTaskNote d-flex">
                <p class="red note">*</p><p class="note">This field is required</p>
            </div>
            <div class="editTaskSubmit d-flex d-space">
                <button type="button" id="editTaskButton" onclick="editTaskPopup('${positionID}', '${id}')" class="createTask d-flex editTask" >Ok <img src="./assets/img/icon_check-white.svg" alt=""></button>
            </div>
            <select name="Category" id="addTaskCategory" class="d-none">
                <option value="${category}">${category}</option>
                <option value="Technical Task">Technical Task</option>
                <option value="User Story">User Story</option>
           </select>
        </div>
    </div>


          </div>
          
  </form>
  
    `;
}