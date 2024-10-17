let contacts = [];
let Second_URL = "https://creative33-9f884-default-rtdb.firebaseio.com/user";


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
      const element = contacts[i].username;
      const circle = generateCircle(element);
      assigned += `
    <div class="d-flex assingUser">
    <label class="container">
      <div class="d-flex assingLeft">
        <div>${circle}</div>
        <p>${element}</p>
      </div>    
  <input id="${element}" type="checkbox" onclick="updateSelectedCheckboxes()">
  <span class="checkmark"></span>
</label>
    </div>`;
    }
    document.getElementById("assingedList").innerHTML = assigned;
  }
  document.getElementById("hideAssignlist").classList.remove("d-none");
}


function hideAssignlist() {
  document.getElementById("hideAssignlist").classList.add("d-none");
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
            <input id="addTasktitleInput" type="text" placeholder="Enter a title" required>
            <p>Description</p>
            <textarea cols="50" placeholder="Enter a Description" name="Discription" id="addTaskDiscription"></textarea>
            <p>Assigned to</p>
            <div class="assingedField d-flex"><input id="assinged" class="assingedInput" type="text" placeholder="Select contacts to assign" onfocus="generateAssingTo()" oninput="filterContacts()"><img class="icon" src="./assets/img/arrow_drop_down.png" alt=""></div>
            <div id="hideAssignlist" class="d-none" onclick="hideAssignlist()"><div id="assingedList" class="assingedList" onclick="event.stopPropagation();"></div></div>
            <div id="electedContacts" class="d-flex"></div>
          </div>
          <div class="middleLine"></div>
          <div class="addTaskRight d-flex">
            <div class="d-flex"><p>Due date</p><p class="red">*</p></div>
            <input type="date" name="Date" id="addTaskDate" required>
            <p>Prio</p>
            <div class="d-flex d-space">
                <button id="urgent" onclick="setPrio('urgent')">Urgent <img id="urgentColor" src="./assets/img/icon_PrioAltaRed.svg" alt=""><img id="urgentWhite" class="urgentWhite d-none" src="./assets/img/PrioWhite.svg" alt=""></button>
                <button id="medium" onclick="setPrio('medium')">Medium <img id="mediumColor" src="./assets/img/icon_PrioMediaOrange.svg" alt=""><img id="mediumWhite" class="d-none" src="./assets/img/icon_PrioMediaWhite.svg" alt=""></button>
                <button id="low" onclick="setPrio('low')">Low <img id="lowColor" src="./assets/img/icon_PrioBajaGreen.svg" alt=""><img id="lowWhite" class="d-none" src="./assets/img/PrioWhite.svg" alt=""></button></div>
            <div class="d-flex"><p>Category</p><p class="red">*</p></div>
           <select name="Category" id="addTaskCategory" required>
                <option value="">Select task Category</option>
                <option value="Technical Task">Technical Task</option>
                <option value="User Story">User Story</option>
           </select>
            <p>Subtasks</p>
            <div id="pointer" onclick="openAddSubTask()" class="d-flex subTask">
                <input id="subTaskAdd" type="text" placeholder="Add new subtask">
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
                <button onclick="renderAddTask()" class="clear d-flex">Clear <img src="./assets/img/icon_closeVectorBlack.svg" alt=""></button>
                <button onclick="addTask()" class="createTask d-flex" >Create Task <img src="./assets/img/icon_check-white.svg" alt=""></button>
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
        <div class="addTaskHeader d-flex d-space">
            <h1 class="addTaskHeader">Add Task</h1>
            <img onclick="closePopUp()" src="./assets/img/icon_closeVectorBlack.svg" alt="close">
        </div>
        <div class="d-flex d-space addTaskBody">
          <div class="addTaskLeft d-flex">
            <div class="d-flex"><p>Title</p><p class="red">*</p></div>
            <input id="addTasktitleInput" type="text" placeholder="Enter a title" required>
            <p>Description</p>
            <textarea cols="50" placeholder="Enter a Description" name="Discription" id="addTaskDiscription"></textarea>
            <p>Assigned to</p>
            <div class="assingedField d-flex"><input id="assinged" class="assingedInput" type="text" placeholder="Select contacts to assign" onfocus="generateAssingTo()" oninput="filterContacts()"><img class="icon" src="./assets/img/arrow_drop_down.png" alt=""></div>
            <div id="hideAssignlist" class="d-none" onclick="hideAssignlist()"><div id="assingedList" class="assingedList" onclick="event.stopPropagation();"></div></div>
            <div id="electedContacts" class="d-flex"></div>
          </div>
          <div class="middleLine"></div>
          <div class="addTaskRight d-flex">
            <div class="d-flex"><p>Due date</p><p class="red">*</p></div>
            <input type="date" name="Date" id="addTaskDate" required>
            <p>Prio</p>
            <div class="d-flex d-space">
                <button id="urgent" onclick="setPrio('urgent')">Urgent <img id="urgentColor" src="./assets/img/icon_PrioAltaRed.svg" alt=""><img id="urgentWhite" class="urgentWhite d-none" src="./assets/img/PrioWhite.svg" alt=""></button>
                <button id="medium" onclick="setPrio('medium')">Medium <img id="mediumColor" src="./assets/img/icon_PrioMediaOrange.svg" alt=""><img id="mediumWhite" class="d-none" src="./assets/img/icon_PrioMediaWhite.svg" alt=""></button>
                <button id="low" onclick="setPrio('low')">Low <img id="lowColor" src="./assets/img/icon_PrioBajaGreen.svg" alt=""><img id="lowWhite" class="d-none" src="./assets/img/PrioWhite.svg" alt=""></button></div>
            <div class="d-flex"><p>Category</p><p class="red">*</p></div>
           <select name="Category" id="addTaskCategory" required>
                <option value="">Select task Category</option>
                <option value="Technical Task">Technical Task</option>
                <option value="User Story">User Story</option>
           </select>
            <p>Subtasks</p>
            <div id="pointer" onclick="openAddSubTask()" class="d-flex subTask">
                <input id="subTaskAdd" type="text" placeholder="Add new subtask">
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
                <button onclick="fillAddTaskPopUp()" class="clear d-flex">Clear <img src="./assets/img/icon_closeVectorBlack.svg" alt=""></button>
                <button onclick="addTaskPopup('${positionId}')" class="createTask d-flex" >Create Task <img src="./assets/img/icon_check-white.svg" alt=""></button>
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
        <div class="addTaskHeader d-flex d-space">
            <h1 class="addTaskHeader">Add Task</h1>
            <img onclick="closePopUp()" src="./assets/img/icon_closeVectorBlack.svg" alt="close">
        </div>
        <div class="d-flex d-space addTaskBody">
          <div class="addTaskLeft d-flex">
            <div class="d-flex"><p>Title</p><p class="red">*</p></div>
            <input id="addTasktitleInput" type="text" placeholder="Enter a title" value="${titleId}" required disabled>
            <p>Description</p>
            <textarea cols="50" placeholder="Enter a Description" name="Discription" id="addTaskDiscription" >${Description}</textarea>
            <p>Assigned to</p>
            <div class="assingedField d-flex"><input id="assinged" class="assingedInput" type="text" placeholder="Select contacts to assign" onfocus="generateAssingTo()" oninput="filterContacts()"><img class="icon" src="./assets/img/arrow_drop_down.png" alt=""></div>
            <div id="hideAssignlist" class="d-none" onclick="hideAssignlist()"><div id="assingedList" class="assingedList" onclick="event.stopPropagation();"></div></div>
            <div id="electedContacts" class="d-flex"></div>
          </div>
          <div class="middleLine"></div>
          <div class="addTaskRight d-flex">
            <div class="d-flex"><p>Due date</p><p class="red">*</p></div>
            <input type="date" name="Date" id="addTaskDate" value="${dueDate}" required>
            <p>Prio</p>
            <div class="d-flex d-space">
                <button id="urgent" onclick="setPrio('urgent')">Urgent <img id="urgentColor" src="./assets/img/icon_PrioAltaRed.svg" alt=""><img id="urgentWhite" class="urgentWhite d-none" src="./assets/img/PrioWhite.svg" alt=""></button>
                <button id="medium" onclick="setPrio('medium')">Medium <img id="mediumColor" src="./assets/img/icon_PrioMediaOrange.svg" alt=""><img id="mediumWhite" class="d-none" src="./assets/img/icon_PrioMediaWhite.svg" alt=""></button>
                <button id="low" onclick="setPrio('low')">Low <img id="lowColor" src="./assets/img/icon_PrioBajaGreen.svg" alt=""><img id="lowWhite" class="d-none" src="./assets/img/PrioWhite.svg" alt=""></button></div>
            <div class="d-flex"><p>Category</p><p class="red">*</p></div>
           <select name="Category" id="addTaskCategory" required>
                <option value="${category}">${category}</option>
                <option value="Technical Task">Technical Task</option>
                <option value="User Story">User Story</option>
           </select>
            <p>Subtasks</p>
            <div id="pointer" onclick="openAddSubTask()" class="d-flex subTask">
                <input id="subTaskAdd" type="text" placeholder="Add new subtask">
                <img id="subTaskPlus" class="subTaskPlus" src="./assets/img/icon_subtasks.svg" alt="">
                <div id="activSubTask" class="d-none d-center">
                    <img onclick="cancelSubTask()" class="subTaskCross" src="./assets/img/icon_closeVectorBlack.svg" alt="">
                    <div class="middleLineShort"></div>
                    <img onclick="addSubTask()" class="subTaskCheck" src="./assets/img/check.png" alt="">
                </div>
            </div>
            <ul id="subTaskView">${subTask}</ul>
        </div>
    </div>
    <div class="addTaskFooter d-flex d-space">
            <div class="addTaskNote d-flex">
                <p class="red note">*</p><p class="note">This field is required</p>
            </div>
            <div class="addTaskSubmit d-flex d-space">
                <button onclick="addTaskPopup('${positionID}')" class="createTask d-flex" >Edit Task <img src="./assets/img/icon_check-white.svg" alt=""></button>
            </div>
        </div>
    </div>
  </form>
  <div id="confirmationMessage" class="confirmation hidden">Task added to board <img class="conformationImg" src="./assets/img/icon_board.svg" alt=""></div>
    `;
}