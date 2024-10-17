async function deleteTask(id) {
    let firebaseURL = "https://creative33-9f884-default-rtdb.firebaseio.com/task/" + id + ".json"
    try {
      const response = await fetch(firebaseURL, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'}
      });
      if (response.ok) {
          console.log(`Task ${id} wurde erfolgreich gelöscht.`);
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


function editTask(title, category, dueDate, description, positionID, id){
    let addTaskSection = document.getElementById("addTaskSection")
    let background = document.getElementById("addTaskSectionBackground")
    background.classList.remove ("d-none");
    addTaskSection.innerHTML = fillEditTaskSection(title, category, dueDate, description, positionID, id);
    checkboxHelp(id);
}