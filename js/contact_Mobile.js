function showContactMobile() {
    document.getElementById('content-area').classList.add('dNone');
    document.getElementById('content-area').classList.remove('d-Block');
    document.getElementById('mycontacts').classList.remove('displayNone');

}


function checkScreenSize() {
    const mobileWidth = 950;

    if (window.matchMedia(`(max-width: ${mobileWidth}px)`).matches) {
        document.getElementById('responsiveContactBackButton').classList.remove('displayNone');
        document.getElementById('mycontacts').classList.add('displayNone');
        document.getElementById('content-area').classList.remove('dNone');
        document.getElementById('content-area').classList.add('d-Block');
    }
}


window.addEventListener('resize', concealMobileElements)

function concealMobileElements() {
    if (window.innerWidth > 800) {
        document.getElementById('responsiveContactBackButton').classList.add('displayNone');
        
    
    } else if (window.innerWidth < 800) {
        
    
        document.getElementById('responsiveContactBackButton').classList.remove('displayNone');
    }
}

function showEditandDelete() {
    var menu = document.getElementById("editDeleteMenu");
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";

    } else {
        menu.style.display = "none";
    }
}

window.onclick = function (event) {
    var menu = document.getElementById("editDeleteMenu");
    if(menu){
        if (!event.target.matches('#options_edit_delete')) {
            {
                menu.style.display = "none";
            }
        }
    } 
}

function showModal(PopUpBgElement, show, header) {
    PopUpBgElement.classList.remove('displayNone', 'hide');
    PopUpBgElement.classList.add('show');
    show.classList.remove('slide-out');
    show.classList.add('slide-in');
    header.classList.add('stretch');
}

function hideModal(bgPopUp, popUp, header) {
    popUp.classList.remove('slide-in');
    popUp.classList.add('slide-out');
    bgPopUp.classList.remove('show');
    bgPopUp.classList.add('hide');
    setTimeout(() => {
        bgPopUp.classList.add('displayNone');
    }, 500);
    header.classList.remove('stretch');
}

document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('name').addEventListener('input', updateSubmitButtonState);
    document.getElementById('email').addEventListener('input', updateSubmitButtonState);
    document.getElementById('tel').addEventListener('input', updateSubmitButtonState);
});

document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('name').addEventListener('input', updateeditSubmitButtonState);
    document.getElementById('email').addEventListener('input', updateeditSubmitButtonState);
    document.getElementById('tel').addEventListener('input', updateeditSubmitButtonState);
});


function updateeditSubmitButtonState() {
    const nameValid = validateName(document.getElementById('name').value);
    const emailValid = validateEmail(document.getElementById('email').value);
    const phoneValid = validatePhoneNumber(document.getElementById('tel').value);

    const submitButton = document.getElementById('createSubmit');
    submitButton.disabled = !(nameValid && emailValid && phoneValid);
}



function validateNameField() {
    let name = document.getElementById('name').value;
    if (!validateName(name)) {
        showErrorMessage('nameError', "Bitte geben Sie einen gültigen Namen ein (mindestens 2 Buchstaben, keine Zahlen).");
    } else {
        hideErrorMessage('nameError');
    }
    updateSubmitButtonState();
}

function validateEmailField() {
    let email = document.getElementById('email').value;
    if (!validateEmail(email)) {
        showErrorMessage('emailError', "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
    } else {
        hideErrorMessage('emailError');
    }
    updateSubmitButtonState();
}

function validatePhoneField() {
    let tel = document.getElementById('tel').value;
    if (!validatePhoneNumber(tel)) {
        showErrorMessage('phoneError', "Bitte geben Sie eine gültige Telefonnummer ein.");
    } else {
        hideErrorMessage('phoneError');
    }
    updateSubmitButtonState();
}

function validateNameFieldBlur() {
    let name = document.getElementById('name').value;
    if (!validateName(name)) {
        showErrorMessage('nameError', "Bitte schreiben Sie den korrekten Namen.");
    } else {
        hideErrorMessage('nameError');
    }
    updateSubmitButtonState();
     updateeditSubmitButtonState();
}

function validatePhoneFieldBlur() {
    let tel = document.getElementById('tel').value;
    if (!validatePhoneNumber(tel)) {
        showErrorMessage('phoneError', "Bitte schreiben Sie die korrekte Telefonnummer beginnend mit einem +.");
    } else {
        hideErrorMessage('phoneError');
    }
    updateSubmitButtonState();
    updateeditSubmitButtonState();
}

function validateEmailFieldBlur() {
    let email = document.getElementById('email').value;
    if (!validateEmail(email)) {
        showErrorMessage('emailError', "Bitte schreiben Sie die korrekte E-Mail-Adresse.");
    } else {
        hideErrorMessage('emailError');
    }
    updateSubmitButtonState();
    updateeditSubmitButtonState();
}


function validateName(name) {
    const namePattern = /^[A-Za-zÄÖÜäöüß]+(?: [A-Za-zÄÖÜäöüß]+)*$/;
    return name.length >= 2 && namePattern.test(name);

}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailPattern.test(email);
}

function validatePhoneNumber(phoneNumber) {
    const phonePattern = /^\+[0-9]+$/;
    return phonePattern.test(phoneNumber);
}

function showErrorMessage(errorElementId, message) {
    const errorElement = document.getElementById(errorElementId);
    errorElement.innerText = message;
    errorElement.style.color = 'red';
    errorElement.style.display = 'block';
}

function hideErrorMessage(errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    errorElement.innerText = '';
}

function resetErrorMessages() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.innerText = '';
        element.style.display = 'none';
    });
}

function validateEditNameField() {
    let name = document.getElementById('editName').value;
    if (!validateName(name)) {
        showErrorMessage('editNameError', "Bitte geben Sie einen gültigen Namen ein (mindestens 2 Buchstaben, keine Zahlen).");
    } else {
        hideErrorMessage('editNameError');
    }
    updateeditSubmitButtonState();
    
}
function validateEditEmailField() {
    let email = document.getElementById('editEmail').value;
    if (!validateEmail(email)) {
        showErrorMessage('editEmailError', "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
    } else {
        hideErrorMessage('editEmailError');
    }
    updateeditSubmitButtonState();
}

function validateEditPhoneField() {
    let tel = document.getElementById('editTel').value;
    if (!validatePhoneNumber(tel)) {
        showErrorMessage('editPhoneError', "Bitte geben Sie eine gültige Telefonnummer ein.");
    } else {
        hideErrorMessage('editPhoneError');
    }
    updateeditSubmitButtonState();
}

function validateEditNameFieldBlur() {
    let name = document.getElementById('editName').value;
    if (!validateName(name)) {
        showErrorMessage('editNameError', "Bitte schreiben Sie den korrekten Namen.");
    } else {
        hideErrorMessage('editNameError');
    }
}


function validateEditEmailFieldBlur() {
    let email = document.getElementById('editEmail').value;
    if (!validateEmail(email)) {
        showErrorMessage('editEmailError', "Bitte schreiben Sie die korrekte E-Mail-Adresse.");
    } else {
        hideErrorMessage('editEmailError');
    }
}


function validateEditPhoneFieldBlur() {
    let tel = document.getElementById('editTel').value;
    if (!validatePhoneNumber(tel)) {
        showErrorMessage('editPhoneError', "Bitte schreiben Sie die korrekte Telefonnummer.");
    } else {
        hideErrorMessage('editPhoneError');
    }
}

function updateSubmitButtonState() {
    const nameValid = validateName(document.getElementById('name').value);
    const emailValid = validateEmail(document.getElementById('email').value);
    const phoneValid = validatePhoneNumber(document.getElementById('tel').value);

    const submitButton = document.getElementById('createSubmit');
    submitButton.disabled = !(nameValid && emailValid && phoneValid);
}


function checkFormFields() {
    const field1 = document.getElementById('editName').value.trim();
    const field2 = document.getElementById('editEmail').value.trim();
    const field3 = document.getElementById('editTel').value.trim();
    const submitButton = document.getElementById('editSubmit');
    submitButton.disabled = !(field1 && field2 && field3);
  }

  function checkFormFields2() {
    const field1 = document.getElementById('name').value.trim();
    const field2 = document.getElementById('email').value.trim();
    const field3 = document.getElementById('tel').value.trim();
    const submitButton = document.getElementById('createSubmit');
    submitButton.disabled = !(field1 && field2 && field3);
  }

function resetEditErrorMessages() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.innerText = '';
        element.style.display = 'none';
    });
}

function createNewContact(event) {
    event.preventDefault();

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let tel = document.getElementById('tel').value;

    resetErrorMessages();

    let isValid = true;

    if (!validateName(name)) {
        showErrorMessage('nameError', "Bitte geben Sie einen gültigen Namen ein (mindestens 2 Buchstaben, keine Zahlen).");
        isValid = false;
    }

    if (!validateEmail(email)) {
        showErrorMessage('emailError', "Bitte geben Sie eine gültige E-Mail-Adresse ein (z.B. beispiel@domain.com).");
        isValid = false;
    }

    if (!validatePhoneNumber(tel)) {
        showErrorMessage('phoneError', "Bitte geben Sie eine gültige Telefonnummer ein (mit + und nur Zahlen).");
        isValid = false;
    }

    if (isValid) {
        let button = document.getElementById("createSubmit");
        button.disabled = true;
        const nextColor = selectNextColor();
        let data = {
            'name': name,
            'email': email,
            'telefonnummer': tel,
            'color': nextColor
        };
        contactList.push(data);
        submitContact('contact');
        openClosePopUp('close');
    }
}

async function modifyContact(event) {
    event.preventDefault();

    let name = document.getElementById('editName').value;
    let email = document.getElementById('editEmail').value;
    let tel = document.getElementById('editTel').value;

    resetEditErrorMessages();

    let isValid = true;

    if (!validateName(name)) {
        showErrorMessage('editNameError', "Bitte geben Sie einen gültigen Namen ein (mindestens 2 Buchstaben, keine Zahlen).");
        isValid = false;
    }

    if (!validateEmail(email)) {
        showErrorMessage('editEmailError', "Bitte geben Sie eine gültige E-Mail-Adresse ein (z.B. beispiel@domain.com).");
        isValid = false;
    }

    if (!validatePhoneNumber(tel)) {
        showErrorMessage('editPhoneError', "Bitte geben Sie eine gültige Telefonnummer ein (mit + und nur Zahlen).");
        isValid = false;
    }

    if (isValid) {
        let button = document.getElementById("editSubmit");
        button.disabled = true;
        preventFormSubmit('update');
        contactList.length = 0;
        contactList.push(modifyContactDetails());
        const response = await fetch(`${BASE_URL}contact/${currentEditKey}.json`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(contactList[0]),
        });
        openClosePopUp('close', key = true);
        await fetchData();
        updateDetail();
    }

}


function preventFormSubmit(key) {
    let target;
    if (key == 'new') {
        target = 'addContactForm';
    } else if (key == 'update') {
        target = 'editContactForm';
    }
    document.getElementById(target), addEventListener('submit', function (event) {
        event.preventDefault();
    });
}






