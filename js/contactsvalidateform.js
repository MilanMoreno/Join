/**
 * Validates the 'name' input field.
 */
function validateNameField() {
    let name = document.getElementById('name').value;
    if (!validateName(name)) {
        showErrorMessage('nameError', "Bitte geben Sie einen gültigen Namen ein (mindestens 2 Buchstaben, keine Zahlen).");
    } else {
        hideErrorMessage('nameError');
    }
    updateSubmitButtonState();
}
/**
 * Validates the 'email' input field.
 */
function validateEmailField() {
    let email = document.getElementById('email').value;
    if (!validateEmail(email)) {
        showErrorMessage('emailError', "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
    } else {
        hideErrorMessage('emailError');
    }
    updateSubmitButtonState();
}

/**
 * Validates the 'phone' input field.
 */
function validatePhoneField() {
    let tel = document.getElementById('tel').value;
    if (!validatePhoneNumber(tel)) {
        showErrorMessage('phoneError', "Bitte geben Sie eine gültige Telefonnummer ein.");
    } else {
        hideErrorMessage('phoneError');
    }
    updateSubmitButtonState();
}

/**
 * Validates the name input field on blur.
 */
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

/**
 * Validates the phone input field on blur.
 */
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

/**
 * Validates the email input field on blur.
 */

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

/**
 * Validates a given name string.
 * 
 * @param {string} name - The name string to validate.
 * @returns {boolean} True if the name is valid, false otherwise.
 */
function validateName(name) {
    const namePattern = /^[A-Za-zÄÖÜäöüß]+(?: [A-Za-zÄÖÜäöüß]+)*$/;
    return name.length >= 2 && namePattern.test(name);

}

/**
 * Validates a given email string.
 * 
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailPattern.test(email);
}

/**
 * Validates a given phone number string.
 * 
 * @param {string} phoneNumber - The phone number string to validate.
 * @returns {boolean} True if the phone number is valid, false otherwise.
 */
function validatePhoneNumber(phoneNumber) {
    const phonePattern = /^\+[0-9]+$/;
    return phonePattern.test(phoneNumber);
}


/**
 * Modifies an existing contact, validates form inputs, and updates contact information.
 * 
 * @param {Event} event - The form submit event.
 */
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

/**
 * Validates and displays the edit name input.
 */
function validateEditNameField() {
    let name = document.getElementById('editName').value;
    if (!validateName(name)) {
        showErrorMessage('editNameError', "Bitte geben Sie einen gültigen Namen ein (mindestens 2 Buchstaben, keine Zahlen).");
    } else {
        hideErrorMessage('editNameError');
    }
    updateeditSubmitButtonState();
    
}

/**
 * Validates and displays the edit email input.
 */
function validateEditEmailField() {
    let email = document.getElementById('editEmail').value;
    if (!validateEmail(email)) {
        showErrorMessage('editEmailError', "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
    } else {
        hideErrorMessage('editEmailError');
    }
    updateeditSubmitButtonState();
}

/**
 * Validates and displays the edit phone number input.
 */
function validateEditPhoneField() {
    let tel = document.getElementById('editTel').value;
    if (!validatePhoneNumber(tel)) {
        showErrorMessage('editPhoneError', "Bitte geben Sie eine gültige Telefonnummer ein.");
    } else {
        hideErrorMessage('editPhoneError');
    }
    updateeditSubmitButtonState();
}

/**
 * Validates the 'editName' input field on blur.
 */
function validateEditNameFieldBlur() {
    let name = document.getElementById('editName').value;
    if (!validateName(name)) {
        showErrorMessage('editNameError', "Bitte schreiben Sie den korrekten Namen.");
    } else {
        hideErrorMessage('editNameError');
    }
}

/**
 * Validates the 'editEmail' input field on blur.
 */
function validateEditEmailFieldBlur() {
    let email = document.getElementById('editEmail').value;
    if (!validateEmail(email)) {
        showErrorMessage('editEmailError', "Bitte schreiben Sie die korrekte E-Mail-Adresse.");
    } else {
        hideErrorMessage('editEmailError');
    }
}

/**
 * Validates the 'editTel' input field on blur.
 */
function validateEditPhoneFieldBlur() {
    let tel = document.getElementById('editTel').value;
    if (!validatePhoneNumber(tel)) {
        showErrorMessage('editPhoneError', "Bitte schreiben Sie die korrekte Telefonnummer.");
    } else {
        hideErrorMessage('editPhoneError');
    }
}
