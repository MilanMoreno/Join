let usersArray = [];  // 

async function handleSignUp(event) {
    event.preventDefault();
    let emailField = document.getElementById("inputSignUpMail");
    let passwordField = document.getElementById("inputSignUpPassword1");
    let confirmPasswordField = document.getElementById("inputSignUpPassword2");
    let acceptCheckbox = document.getElementById("checkboxAccept");
    let errorDisplay = document.getElementById("passwordIncorrect");

    if (!acceptCheckbox.checked) {
        displayErrorMessage("You must accept the terms of use", acceptCheckbox);
        return;
    }

    if (!(await checkEmailAvailability(emailField.value))) {
        displayErrorMessage("Email is already registered", emailField);
        return;
    }

    let newUser = buildUserObject();  // newUser: Einzelner Benutzer
    if (await verifyPassword(newUser, passwordField, confirmPasswordField)) {
        showSuccessMessage();
    }
}

async function checkEmailAvailability(email) {
    await loadUsers();  // Benutzer laden (Plural)
    return !usersArray.some(user => user.mail === email);  // Hier prüfen wir die E-Mail für einen einzelnen user
}

async function verifyPassword(user, passwordField, confirmPasswordField) {  // user: einzelner Benutzer
    const password = passwordField.value.trim();
    const confirmPassword = confirmPasswordField.value.trim();

    if (!password || !confirmPassword) {
        displayErrorMessage("Passwords cannot be empty", confirmPasswordField);
        return false;
    }

    if (password === confirmPassword) {
        await submitData("users", user);  // Hier fügen wir den neuen Benutzer (user) zur Datenbank hinzu
        return true;
    } else {
        displayErrorMessage("Passwords do not match", confirmPasswordField);
        return false;
    }
}

async function loadUsers() {
    usersArray = [];  // Leeren des Benutzers-Arrays (Plural)
    let usersData = await fetchData("users");  // usersData: Daten aller Benutzer
    for (let [userID, userData] of Object.entries(usersData || {})) {
        userData.id = userID;  // Einzelner Benutzer (userData) bekommt eine ID
        usersArray.push(userData);  // Benutzer (userData) wird zur Benutzerliste (users) hinzugefügt
    }
}

function displayErrorMessage(message, targetElement) {
    let errorElement = document.getElementById("passwordIncorrect");
    errorElement.classList.remove("d-none");
    errorElement.innerText = message;
    targetElement.style.border = "2px solid red";
}

function buildUserObject() {
    let name = document.getElementById("inputSignUpName").value;
    let email = document.getElementById("inputSignUpMail").value;
    let password = document.getElementById("inputSignUpPassword1").value;
    return { name, initials: getInitials(name), password, mail: email };  // Einzelner Benutzer wird zurückgegeben
}

function showSuccessMessage() {
    document.getElementById("bgSignupSuccesfully").classList.remove("d-none");
    setTimeout(() => window.location.href = "./sign_up.html", 1500);
}

function getInitials(name) {
    return name.split(" ").filter(Boolean).map(word => word[0].toUpperCase()).join("");
}

function login() {
    let email = document.getElementById("inputEmailLogIn").value;
    let password = document.getElementById("inputPasswordLogIn").value;
    let matchedUser = usersArray.find(user => user.mail === email && user.password === password);  // matchedUser: einzelner Benutzer

    if (matchedUser) {
        localStorage.setItem("user", JSON.stringify(matchedUser));  // Nur ein Benutzer wird im localStorage gespeichert
        window.location.href = "./summary.html";
    } else {
        displayErrorMessage("E-Mail or password are incorrect", document.getElementById("Loginerror"));
    }
}

function guestLogin() {
    let guestUser = { initials: "G", name: "Guest" };
    localStorage.setItem("user", JSON.stringify(guestUser));  // Gastbenutzer wird als einzelner Benutzer gespeichert
    window.location.href = "./summary.html";
}

function handleLogin(event) {
    event.preventDefault();
    const emailInput = document.getElementById("inputEmailLogIn").value;
    const passwordInput = document.getElementById("inputPasswordLogIn").value;

    const matchedUser = usersArray.find(user => user.mail === emailInput && user.password === passwordInput);  // matchedUser: einzelner Benutzer

    if (matchedUser) {
        saveUserToLocal(matchedUser);  // matchedUser wird gespeichert
        redirectToSummary();
    } else {
        showLoginErrorMessage("E-Mail or password are incorrect");
    }
}

function loginAsGuest() {
    const guestUser = {
        initials: "G",
        name: "Guest",
    };
    saveUserToLocal(guestUser);  // Gastbenutzer wird gespeichert
    redirectToSummary();
}

function saveUserToLocal(user) {
    const userString = JSON.stringify(user);  // einzelner Benutzer (user) wird gespeichert
    localStorage.setItem("user", userString);
}

function redirectToSummary() {
    window.location.href = "./summary.html";
}

function showLoginErrorMessage(message) {
    const loginErrorElement = document.getElementById("Loginerror");
    loginErrorElement.classList.remove("d-none");
    loginErrorElement.innerHTML = message;
}
