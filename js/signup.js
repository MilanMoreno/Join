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

async function checkEmailAvailability(email) {
    await loadUser();
    return !usersArray.some(users => users.mail === email);
}

async function verifyPassword(users, passwordField, confirmPasswordField) {
    const password = passwordField.value.trim();
    const confirmPassword = confirmPasswordField.value.trim();

    if (!password || !confirmPassword) {
        displayErrorMessage("Passwords cannot be empty", confirmPasswordField);
        return false;
    }

    if (password === confirmPassword) {
        await submitData("users", users);
        return true;
    } else {
        displayErrorMessage("Passwords do not match", confirmPasswordField);
        return false;
    }
}
async function loadUser() {
    usersArray = [];
    let users = await fetchData("users");
    for (let [userID, users] of Object.entries(users || {})) {
        users.id = userID;
        usersArray.push(users);
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
    let email = document.getElementById("inputEmailLogIn").value;
    let password = document.getElementById("inputPasswordLogIn").value;
    let users = usersArray.find(users => users.mail === email && users.password === password);

    if (users) {
        localStorage.setItem("users", JSON.stringify(users));
        window.location.href = "./summary.html";
    } else {
        displayErrorMessage("E-Mail or password are incorrect", document.getElementById("Loginerror"));
    }
}

function guestLogin() {
    let guestUser = { initials: "G", name: "Guest" };
    localStorage.setItem("users", JSON.stringify(guestUser));
    window.location.href = "./summary.html";
}


function handleLogin(event) {
  event.preventDefault();
  const emailInput = document.getElementById("inputEmailLogIn").value;
  const passwordInput = document.getElementById("inputPasswordLogIn").value;

  const matchedUser = usersArray.find(
      (users) => users.mail === emailInput && users.password === passwordInput
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

function saveUserToLocal(users) {
  const userString = JSON.stringify(users);
  localStorage.setItem("users", userString);
}

function redirectToSummary() {
  window.location.href = "./summary.html";
}

function showLoginErrorMessage(message) {
  const loginErrorElement = document.getElementById("Loginerror");
  loginErrorElement.classList.remove("d-none");
  loginErrorElement.innerHTML = message;
}
