// Funktion für die Anmeldung
// Diese Funktion wird aufgerufen, wenn das Anmeldeformular abgesendet wird. Sie validiert die Eingaben,
// überprüft die E-Mail-Verfügbarkeit, verifiziert das Passwort und speichert den neuen Benutzer, wenn alles korrekt ist.
async function handleSignUp(event) {
  event.preventDefault(); // Verhindert das Formularabsenden
  const usersArray = await loadUsers();
  let emailField = document.getElementById("inputSignUpMail");
  let passwordField = document.getElementById("inputSignUpPassword1");
  let confirmPasswordField = document.getElementById("inputSignUpPassword2");
  let acceptCheckbox = document.getElementById("checkboxAccept");
  let errorDisplay = document.getElementById("passwordIncorrect");

  // Überprüfen, ob der Benutzer die AGB akzeptiert hat
  if (!acceptCheckbox.checked) {
    displayErrorMessage("You must accept the terms of use", acceptCheckbox);
    return;
  }

  // Überprüfen, ob die E-Mail bereits registriert ist
  if (!checkEmailAvailability(usersArray, emailField.value)) {
    displayErrorMessage("Email is already registered", emailField);
    return;
  }

  // Erstelle das Benutzerobjekt mit den Formulardaten
  let newUser = buildUserObject();

  // Überprüft, ob das Passwort und die Bestätigung korrekt sind
  if (await verifyPassword(newUser, passwordField, confirmPasswordField)) {
    showSuccessMessage();
  }
}

// Überprüft die Verfügbarkeit der E-Mail-Adresse
// Diese Funktion überprüft, ob die angegebene E-Mail-Adresse bereits in der Benutzerdatenbank vorhanden ist.
async function checkEmailAvailability(usersArray, email) {
  return !usersArray.some((user) => user.mail === email); // Gibt true zurück, wenn die E-Mail verfügbar ist
}

// Verifiziert, ob die Passwörter übereinstimmen und speichert den Benutzer
// Diese Funktion prüft, ob das Passwort und die Bestätigung übereinstimmen und speichert den Benutzer,
// wenn alles korrekt ist. Wenn die Passwörter nicht übereinstimmen, wird eine Fehlermeldung angezeigt.
async function verifyPassword(user, passwordField, confirmPasswordField) {
  const password = passwordField.value.trim();
  const confirmPassword = confirmPasswordField.value.trim();

  if (!password || !confirmPassword) {
    displayErrorMessage("Passwords cannot be empty", confirmPasswordField);
    return false; // Passwort darf nicht leer sein
  }

  // Wenn die Passwörter übereinstimmen, wird der Benutzer gespeichert
  if (password === confirmPassword) {
    await submitData("users", user); // Benutzer speichern
    return true;
  } else {
    displayErrorMessage("Passwords do not match", confirmPasswordField); // Fehlermeldung, wenn Passwörter nicht übereinstimmen
    return false;
  }
}

// Lädt die Benutzerdaten
// Diese Funktion lädt die Benutzerdaten von einem Server oder einer Datenquelle und gibt sie als Array zurück.
async function loadUsers() {
  let usersArray = [];
  let usersData = await fetchData("users");
  for (let [userID, userData] of Object.entries(usersData || {})) {
    userData.id = userID; // ID für jeden Benutzer setzen
    usersArray.push(userData); // Benutzer zum Array hinzufügen
  }
  return usersArray; // Gibt das Array mit allen Benutzern zurück
}

// Zeigt eine Fehlermeldung an
// Diese Funktion zeigt eine Fehlermeldung unter dem Eingabefeld an und färbt das Feld rot.
function displayErrorMessage(message, targetElement) {
  let errorElement = document.getElementById("passwordIncorrect");
  errorElement.classList.remove("d-none"); // Fehler anzeigen
  errorElement.innerText = message; // Fehlermeldung setzen
  targetElement.style.border = "2px solid red"; // Eingabefeld rot markieren
}

// Baut das Benutzerobjekt mit den Formulardaten
// Diese Funktion erstellt ein Benutzerobjekt mit den Daten aus den Eingabefeldern.
function buildUserObject() {
  let name = document.getElementById("inputSignUpName").value;
  let email = document.getElementById("inputSignUpMail").value;
  let password = document.getElementById("inputSignUpPassword1").value;
  return { name, initials: getInitials(name), password, mail: email }; // Benutzerobjekt zurückgeben
}

// Zeigt eine Erfolgsmeldung an
// Diese Funktion zeigt eine Erfolgsmeldung an, wenn die Anmeldung erfolgreich war, und leitet dann auf die Startseite weiter.
function showSuccessMessage() {
  document.getElementById("bgSignupSuccesfully").classList.remove("d-none");
  setTimeout(() => {
    window.location.href = "./index.html"; // Weiterleitung zur Startseite nach 1.5 Sekunden
  }, 1500);
}

// Extrahiert die Initialen aus dem Namen
// Diese Funktion gibt die Initialen eines Benutzernamens zurück (z.B. "Max Mustermann" => "MM").
function getInitials(name) {
  return name
    .split(" ") // Den Namen nach Leerzeichen aufteilen
    .filter(Boolean) // Leere Strings filtern
    .map((word) => word[0].toUpperCase()) // Den ersten Buchstaben jedes Wortes in Großbuchstaben umwandeln
    .join(""); // Die Initialen zusammenfügen
}

// Gast-Login Funktion
// Diese Funktion erstellt einen Gastbenutzer und speichert ihn im LocalStorage.
// Danach wird der Benutzer zur Übersichtsseite weitergeleitet.
function guestLogin() {
  let guestUser = { initials: "G", name: "Guest" }; // Erstelle Gastbenutzer
  localStorage.setItem("user", JSON.stringify(guestUser)); // Benutzer im LocalStorage speichern
  window.location.href = "./summary.html"; // Weiterleitung zur Übersichtsseite
}

// Login Funktion
// Diese Funktion überprüft, ob die E-Mail und das Passwort mit einem Benutzer übereinstimmen.
// Falls ja, wird der Benutzer eingeloggt, andernfalls wird eine Fehlermeldung angezeigt.
async function login() {
  const usersArray = await loadUsers();
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let matchedUser = usersArray.find(
    (user) => user.mail === email && user.password === password // Benutzer finden
  );
  if (matchedUser) {
    localStorage.setItem("user", JSON.stringify(matchedUser)); // Benutzer im LocalStorage speichern
    window.location.href = "./summary.html"; // Weiterleitung zur Übersichtsseite
  } else {
    displayErrorMessage(
      "E-Mail or password are incorrect", // Fehlermeldung anzeigen
      document.getElementById("Loginerror")
    );
  }
}

// Funktion für den Login-Handler
// Diese Funktion wird aufgerufen, wenn der Login-Formular abgesendet wird. Sie validiert die Eingaben und ruft die Login-Funktion auf.
function handleLogin(event) {
  event.preventDefault(); // Verhindert das Formularabsenden
  const emailInput = document.getElementById("email").value;
  const passwordInput = document.getElementById("password").value;
  loginUser(emailInput, passwordInput); // Login durchführen
}

// Login Benutzer Funktion
// Diese Funktion überprüft, ob ein Benutzer mit der angegebenen E-Mail und dem Passwort existiert.
// Wenn ja, wird der Benutzer eingeloggt, andernfalls wird eine Fehlermeldung angezeigt.
async function loginUser(email, password) {
  const usersArray = await loadUsers();
  const matchedUser = usersArray.find(
    (user) => user.mail === email && user.password === password
  );
  if (matchedUser) {
    saveUserToLocal(matchedUser); // Speichert den Benutzer im LocalStorage
    redirectToSummary(); // Weiterleitung zur Übersichtsseite
  } else {
    showLoginErrorMessage("E-Mail or password are incorrect"); // Fehlermeldung anzeigen
  }
}

// Login als Gast
// Diese Funktion loggt den Benutzer als Gast ein, ohne dass eine E-Mail oder Passwort erforderlich ist.
function loginAsGuest() {
  const guestUser = {
    initials: "G", // Initialen für den Gast
    name: "Guest",
  };
  saveUserToLocal(guestUser); // Speichern des Gastbenutzers im LocalStorage
  redirectToSummary(); // Weiterleitung zur Übersichtsseite
}

// Speichert den Benutzer im LocalStorage
// Diese Funktion speichert die Benutzerdaten im LocalStorage, um sie auf anderen Seiten verfügbar zu machen.
function saveUserToLocal(user) {
  const userString = JSON.stringify(user); // Benutzerobjekt in einen JSON-String umwandeln
  localStorage.setItem("user", userString); // Speichern im LocalStorage
}

// Weiterleitung zur Zusammenfassungsseite
// Diese Funktion leitet den Benutzer zur Übersichtsseite weiter.
function redirectToSummary() {
  window.location.href = "./summary.html"; // Weiterleitung zur Übersichtsseite
}

// Zeigt eine Fehlernachricht beim Login an
// Diese Funktion zeigt eine Fehlermeldung auf der Login-Seite an, wenn die Anmeldeversuche fehlschlagen.
function showLoginErrorMessage(message) {
  const loginErrorElement = document.getElementById("Loginerror");
  loginErrorElement.classList.remove("d-none"); // Fehler anzeigen
  loginErrorElement.innerHTML = message; // Fehlermeldung setzen
}




