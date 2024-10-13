function login() {
    let email = document.getElementById("inputEmailLogIn").value;
    let password = document.getElementById("inputPasswordLogIn").value;

    let user = usersArray.find(user => user.mail === email && user.password === password);

    if (user) {
        // Benutzerobjekt im localStorage speichern
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "./summary.html";  // Leitet zum Dashboard weiter
    } else {
        displayErrorMessage("E-Mail oder Passwort sind inkorrekt", document.getElementById("Loginerror"));
    }
}




function displayUserInitials() {
    // Benutzerdaten aus localStorage abrufen
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.initials) {
        // Die Initialen des Benutzers in einem HTML-Element anzeigen
        document.getElementById("userInitials").innerText = user.initials;
    }
}

// Diese Funktion beim Laden der Seite aufrufen
window.onload = displayUserInitials;
