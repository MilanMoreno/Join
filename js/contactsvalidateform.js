/**
 * Validates a given phone number string.
 * 
 * @param {string} variable - The field variable to confirm.
 * @param {string or number}  value - Object string to validate. 
 * @returns {boolean} True if the object is valid, false otherwise.
 */
function validateInput(variable, value) {
    if (variable === "name" || variable === "editName") {
        const namePattern = /^[A-Za-zÄÖÜäöüß]+(?: [A-Za-zÄÖÜäöüß]+)*$/;
        return value.length >= 2 && namePattern.test(value);
    }
    if (variable === "email" || variable === "editEmail") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailPattern.test(value);
    }
    if (variable === "tel" || variable === "editTel") {
        const phonePattern = /^\+[0-9]+$/;
        return phonePattern.test(value);
    }
    return false;
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
function validateEditField(fieldID) {
    let errottext = checkErrorText(fieldID);
    let name = document.getElementById(`${fieldID}`).value;
    if (!validateInput(fieldID, name)) {
        showErrorMessage(`${fieldID}Error`, `${errottext}`);
    } else {
        hideErrorMessage(`${fieldID}Error`);
    }
    // updateeditSubmitButtonState();  
}

/**
 * This function check wich Error massage to use.
 * 
 * @param {string} fieldID - The ID from the input field.
 * @returns 
 */
function checkErrorText(fieldID){
    if (fieldID == "editName" || fieldID === "name"){
        return "Please enter a valid name."
    } else if (fieldID == "editEmail" || fieldID === "email") {
        return "Please select a valid e-mail address (beispiel@domain.com)."
    } else if (fieldID == "editTel" || fieldID === "tel") {
        return "Please enter a valid telephone number (starting with +)."
    }
}