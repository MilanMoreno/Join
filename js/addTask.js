

function renderAddTask(){
    let contentSection = document.getElementById("addTaskSide");
    

    contentSection.innerHTML = '';
    contentSection.innerHTML = addTaskTemplate();
}