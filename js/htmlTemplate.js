function addTaskTemplate() {
  return /*html*/ `
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
            <select id="addTaskContactSelect">
                <option value="">Select contacts to assign</option>
            </select>
        </div>
        <div class="middleLine"></div>
        <div class="addTaskRight d-flex">
            <div class="d-flex"><p>Due date</p><p class="red">*</p></div>
            <input type="date" name="Date" id="addTaskDate" required>
            <p>Prio</p>
            <div class="d-flex d-space">
                <button id="urgent" onclick="setPrio('urgent')">Urgent <img id="urgentColor" src="./assets/img/icon_PrioAltaRed.svg" alt=""><img id="urgentWhite" class="d-none" src="./assets/img/icon_PrioMediaWhite.svg" alt=""></button>
                <button id="medium" onclick="setPrio('medium')">Medium <img id="mediumColor" src="./assets/img/icon_PrioMediaOrange.svg" alt=""><img id="mediumWhite" class="d-none" src="./assets/img/icon_PrioMediaWhite.svg" alt=""></button>
                <button id="low" onclick="setPrio('low')">Low <img id="lowColor" src="./assets/img/icon_PrioBajaGreen.svg" alt=""><img id="lowWhite" class="d-none" src="./assets/img/icon_PrioMediaWhite.svg" alt=""></button></div>
            <div class="d-flex"><p>Category</p><p class="red">*</p></div>
           <select name="Category" id="addTaskCategory" required>
                <option value="">Select task Category</option>
                <option value="">Technical Task</option>
                <option value="">User Story</option>
           </select>
            <p>Subtasks</p>
            <input type="text" placeholder="Add new subtask">
        </div>
</div>
        <div class="addTaskFooter d-flex d-space">
            <div class="addTaskNote d-flex">
                <p class="red note">*</p><p class="note">This field is required</p>
            </div>
            <div class="addTaskSubmit d-flex d-space">
                <button class="clear d-flex">Clear <img src="./assets/img/icon_closeVectorBlack.svg" alt=""></button>
                <button onclick="addTask()" class="createTask d-flex">Create Task <img src="./assets/img/icon_check-white.svg" alt=""></button>
            </div>
        </div>
    </div>
    `;
}
