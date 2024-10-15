async function deleteTask(id) {
    let firebaseURL = "https://creative33-9f884-default-rtdb.firebaseio.com/task/" + id + ".json"
  
    try {
      const response = await fetch(firebaseURL, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          }
      });
  
      if (response.ok) {
          console.log(`Task ${id} wurde erfolgreich gelöscht.`);
          // Hier kannst du den DOM aktualisieren oder weitere Aktionen ausführen.
          location.reload();
      } else {
          console.error('Fehler beim Löschen des Tasks:', response.statusText);
      }
  } catch (error) {
      console.error('Fehler beim Löschen des Tasks:', error);
}}


function fillAddTaskPopUp(){
    let addTaskSection = document.getElementById("addTaskSection")
    let background = document.getElementById("addTaskSectionBackground")
    background.classList.remove ("d-none");
    addTaskSection.innerHTML = fillAddTaskSection();
}

function closePopUp(){
    document.getElementById("addTaskSectionBackground").classList.add ("d-none")
}

function editTask(){

}