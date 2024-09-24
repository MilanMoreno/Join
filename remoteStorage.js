function onloadFunc(){
    console.log("test");
    postData("/name", {"banana": "rama"});
}

const BASE_URL = "https://joinprojekt24-default-rtdb.europe-west1.firebasedatabase.app/";

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
