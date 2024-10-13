let usersArray = [];

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

    let newUser = buildUserObject();
    if (await verifyPassword(newUser, passwordField, confirmPasswordField)) {
        showSuccessMessage();
    }
}
/**
 * 
 * @param {wichtig } email 
 * 
 * 
 * @returns 
 */

async function checkEmailAvailability(email) {
    await loadUser();
    return !usersArray.some(user => user.mail === email);
}

async function verifyPassword(user, passwordField, confirmPasswordField) {
    const password = passwordField.value.trim();
    const confirmPassword = confirmPasswordField.value.trim();

    if (!password || !confirmPassword) {
        displayErrorMessage("Passwords cannot be empty", confirmPasswordField);
        return false;
    }

    if (password === confirmPassword) {
        await submitData("users", user);
        return true;
    } else {
        displayErrorMessage("Passwords do not match", confirmPasswordField);
        return false;
    }
}
async function loadUser() {
    usersArray = [];
    let users = await fetchData("users");
    for (let [userID, user] of Object.entries(users || {})) {
        user.id = userID;
        usersArray.push(user);
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
    return { name, initials: getInitials(name), password, mail: email };
}

function showSuccessMessage() {
    document.getElementById("bgSignupSuccesfully").classList.remove("d-none");
    setTimeout(() => window.location.href = "./sign_up.html", 1500);
}

function getInitials(name) {
    return name.split(" ").filter(Boolean).map(word => word[0].toUpperCase()).join("");
}

function login() {
    let email = document.getElementById("inputLoginMail").value;
    let password = document.getElementById("inputLoginPassword").value;
    let user = usersArray.find(user => user.mail === email && user.password === password);

    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "./summary.html";
    } else {
        displayErrorMessage("E-Mail or password are incorrect", document.getElementById("failedLogin"));
    }
}

function guestLogin() {
    let guestUser = { initials: "G", name: "Guest" };
    localStorage.setItem("user", JSON.stringify(guestUser));
    window.location.href = "./summary.html";
}


function handleLogin(event) {
  event.preventDefault();
  const emailInput = document.getElementById("inputLoginMail").value;
  const passwordInput = document.getElementById("inputLoginPassword").value;

  const matchedUser = usersArray.find(
      (user) => user.mail === emailInput && user.password === passwordInput
  );

  if (matchedUser) {
      saveUserToLocal(matchedUser);
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
    saveUserToLocal(guestUser);
    redirectToSummary();
  }

function saveUserToLocal(user) {
  const userString = JSON.stringify(user);
  localStorage.setItem("user", userString);
}

function redirectToSummary() {
  window.location.href = "./summary.html";
}

function showLoginErrorMessage(message) {
  const loginErrorElement = document.getElementById("failedLogin");
  loginErrorElement.classList.remove("d-none");
  loginErrorElement.innerHTML = message;
}
