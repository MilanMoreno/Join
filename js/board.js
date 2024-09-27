let task = [] ;
let baseUrl = "https://creative33-9f884-default-rtdb.firebaseio.com/task";
loadTask();



async function loadTask() {
    try {
        fetch(`${BASE_URL}.json`);
//GET Anfrage wird hier gesendet an die REaltimeFirebase um Kontakte zu laden!
//DIe Empfangene Daten werden in der contact-Variable gespeichert und die includeHTML und renderContact funktionen werden aufgerufen, um die Kontakte anzuzeigen

        const contactData = await contactResponse.json();
        const info = contactData.contact;
        content.push(info);
        displayData(info);

        const colorIndexData = await colorIndexResponse.json();
        if (colorIndexData !== null) {
            colorPosition = colorIndexData;
        }
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}

function render(){

}