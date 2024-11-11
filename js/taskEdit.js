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

function closePopUp(){
    document.getElementById("addTaskSectionBackground").classList.add ("d-none");
    document.getElementById("main").classList.remove ("scrollhidden");
    document.getElementById("body").classList.remove ("scrollhidden");
}

oldTask = []

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

function checkPrioEdit(prioCheck){
    prio = prioCheck
    if(prio == ""){}else{
    document.getElementById(`${prioCheck}`).classList.add (`color${prioCheck}`);
    document.getElementById(`${prioCheck}Color`).classList.add (`d-none`);
    document.getElementById(`${prioCheck}White`).classList.remove (`d-none`);}
}

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

  function hideAssignlist() {
    document.getElementById("hideAssignlist").classList.add("d-none");
    document.getElementById("assingedList").classList.add("d-none");
    renderSelectedContacts();
  }

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