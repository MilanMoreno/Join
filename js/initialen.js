function login() {
    let email = document.getElementById("inputEmailLogIn").value;
    let password = document.getElementById("inputPasswordLogIn").value;

    // Suche nach einem Benutzer in der Liste aller Benutzer
    let user = usersArray.find(user => user.mail === email && user.password === password);  // user: Einzelner Benutzer

    if (user) {
        // Benutzerobjekt im localStorage speichern (Singular)
        localStorage.setItem("user", JSON.stringify(user));  // Korrektur von "users" zu "user"
        window.location.href = "./summary.html";  // Leitet zum Dashboard weiter
    } else {
        displayErrorMessage("E-Mail oder Passwort sind inkorrekt", document.getElementById("Loginerror"));
    }
}

function displayUserInitials() {
    // Benutzerdaten aus localStorage abrufen (Singular)
    const user = JSON.parse(localStorage.getItem("user"));  // Korrektur von "users" zu "user"

    if (user && user.initials) {
        // Die Initialen des Benutzers in einem HTML-Element anzeigen
        document.getElementById("userInitials").innerText = user.initials;
    }
}

// Diese Funktion beim Laden der Seite aufrufen
window.onload = displayUserInitials;
