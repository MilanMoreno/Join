

function onloadFunc(){
    console.log("test");
    deleteData("/user/dsasa");
}

const BASE_URL = "https://creative33-9f884-default-rtdb.firebaseio.com/";

async function loadData(path="") {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
}

async function postData(path="", data={}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {  // Hier wurde der Fehler korrigiert
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

async function deleteData(path=""){
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
     
    });
    return responseToJson = await response.json();
}
