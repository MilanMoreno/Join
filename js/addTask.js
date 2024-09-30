let task = []
let baseUrl = "https://creative33-9f884-default-rtdb.firebaseio.com/task"

function renderAddTask(){
    let contentSection = document.getElementById("addTaskSide");
    

    contentSection.innerHTML = '';
    contentSection.innerHTML = addTaskTemplate();
}

let prio = ""

function addTask(){
    let subTask = [];


    const task = {
        Title: document.getElementById("addTasktitleInput").value,
        Category: document.getElementById("addTaskCategory").value,
        Description: document.getElementById("addTaskDiscription").value,
        DueDate: document.getElementById("addTaskDate").value,
        Prio: prio,
        AssignedTo: [document.getElementById("addTaskContactSelect").value],
        Subtask: [subTask],
        PositionID: "todo"
      };

      const jsonString = JSON.stringify(task);
console.log(jsonString);

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
    document.getElementById("activSubTask").classList.remove ("d-none")
    document.getElementById("activSubTask").classList.add ("d-flex")
    document.getElementById("subTaskPlus").classList.add ("d-none")
}