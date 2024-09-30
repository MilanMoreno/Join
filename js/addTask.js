let task = []
let BASE_URL = "https://creative33-9f884-default-rtdb.firebaseio.com/task/"

function renderAddTask(){
    let contentSection = document.getElementById("addTaskSide");
    

    contentSection.innerHTML = '';
    contentSection.innerHTML = addTaskTemplate();
}

let prio = ""
const subTask = [];

function addTask(){
    const task = {
        Title: document.getElementById("addTasktitleInput").value,
        Category: document.getElementById("addTaskCategory").value,
        Description: document.getElementById("addTaskDiscription").value,
        DueDate: document.getElementById("addTaskDate").value,
        Prio: prio,
        AssignedTo: [document.getElementById("addTaskContactSelect").value],
        Subtask: [subTask],
        PositionID: "toDo"
      };
      const jsonString = JSON.stringify(task);
      postData(task.Title, task);
console.log(jsonString);
clearForm(prio);
}


function setPrio(p){
    const prios = p;
    if(prio == p){
    prio = '';}else{
        prio = p
    };
    if(document.getElementById(`${p}`).classList.contains (`color${p}`)){
        removeClasslist(p);
    }else{
        removeOtherClasslist();
        addClasslist(p);
    }  
}


function checkClasslist(p){
    document.getElementById(`${p}`).classList.contains (`color${p}`);
}

function addClasslist(p){
    document.getElementById(`${p}`).classList = `color${p}`
    document.getElementById(`${p}Color`).classList = `d-none`
    document.getElementById(`${p}White`).classList = ``
}

function removeClasslist(p){
    document.getElementById(`${p}`).classList = ``
    document.getElementById(`${p}Color`).classList = ``
    document.getElementById(`${p}White`).classList = `d-none`
}

function removeOtherClasslist(p){
    document.getElementById(`urgent`).classList = ``
    document.getElementById(`urgentColor`).classList = ``
    document.getElementById(`urgentWhite`).classList = `d-none`
    document.getElementById(`medium`).classList = ``
    document.getElementById(`mediumColor`).classList = ``
    document.getElementById(`mediumWhite`).classList = `d-none`
    document.getElementById(`low`).classList = ``
    document.getElementById(`lowColor`).classList = ``
    document.getElementById(`lowWhite`).classList = `d-none`
}


function openAddSubTask(){
    document.getElementById("activSubTask").classList.remove ("d-none");
    document.getElementById("activSubTask").classList.add ("d-flex");
    document.getElementById("subTaskPlus").classList.add ("d-none");

}

function cancelSubTask(){
    document.getElementById("subTaskAdd").value = "";
    document.getElementById("activSubTask").classList.add ("d-none");
    document.getElementById("activSubTask").classList.remove ("d-flex");
    document.getElementById("subTaskPlus").classList.remove ("d-none");
    event.stopPropagation();
}


function addSubTask(){
    let show = document.getElementById("subTaskView");
    let value = document.getElementById("subTaskAdd").value ;
    show.innerHTML += `<li>${value}</li>`;
    subTask.push (`${value}`);

    
    cancelSubTask();
    event.stopPropagation();
}


function clearForm(prio){
    document.getElementById("addTasktitleInput").value = '';
    document.getElementById("addTaskDiscription").value = '';
    document.getElementById("addTaskContactSelect").value = '';
    document.getElementById("addTaskDate").value = '';
    document.getElementById("addTaskCategory").value = '';
    document.getElementById("subTaskAdd").value = '';
    document.getElementById("subTaskView").innerHTML = '';
    removeOtherClasslist(prio);
}

// firebase 


async function postData(path="", data={}) {
    const title = data.Title;
    path = title;
    let response = await fetch(BASE_URL + path + ".json",{
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return responseToJson = await response.json();

    
}