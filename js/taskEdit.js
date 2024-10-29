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
    let addTaskSection = document.getElementById("addTaskSection")
    let background = document.getElementById("addTaskSectionBackground")
    background.classList.remove ("d-none");
    addTaskSection.innerHTML = fillAddTaskSection(positionId);
}


function closePopUp(){
    document.getElementById("addTaskSectionBackground").classList.add ("d-none")
}


oldTask = []

function editTask(title, category, dueDate, description, positionID, id, Prio){
    let addTaskSection = document.getElementById("addTaskSection")
    let background = document.getElementById("addTaskSectionBackground")
    background.classList.remove ("d-none");
    oldTask.push (title)
    addTaskSection.innerHTML = fillEditTaskSection(title, category, dueDate, description, positionID, id,);
    checkPrioEdit(Prio);
    checkboxHelp(id);
}

function checkPrioEdit(prioCheck){
    prio = prioCheck
    document.getElementById(`${prioCheck}`).classList.add (`color${prioCheck}`);
    document.getElementById(`${prioCheck}Color`).classList.add (`d-none`);
    document.getElementById(`${prioCheck}White`).classList.remove (`d-none`);
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
          location.reload();
      } else {console.error('Fehler beim Löschen des Tasks:', response.statusText);}
  } catch (error) {
      console.error('Fehler beim Löschen des Tasks:', error);
  }
  }


 async function editTaskPopup(positionID){
    let button = document.getElementById("editTaskButton");
    button.disabled = true;
    let newTask = document.getElementById("addTasktitleInput");
    if (oldTask[0] === newTask.value){
    await addTaskPopup(positionID);} else {
       await deleteForEdit(oldTask[0]);
        await addTaskPopup(positionID);
    }
  }