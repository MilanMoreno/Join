function showContactMobile() {
    document.getElementById('content-area').classList.add('dNone');
    document.getElementById('mycontacts').classList.remove('displayNone');

}


function checkScreenSize() {
    const mobileWidth = 800;

    if (window.matchMedia(`(max-width: ${mobileWidth}px)`).matches) {
        document.getElementById('responsiveContactBackButton').classList.remove('displayNone');
        document.getElementById('mycontacts').classList.add('displayNone');
        document.getElementById('content-area').classList.remove('dNone');
    }
}


window.addEventListener('resize', concealMobileElements)


function concealMobileElements() {
    if (window.innerWidth > 800) {
        document.getElementById('responsiveContactBackButton').classList.add('displayNone');
        document.getElementById('return_mobilePopUp').classList.add('displayNone');
        document.getElementById('return_editMobilePopUp').classList.add('displayNone');
    } else if (window.innerWidth < 800) {
        document.getElementById('return_mobilePopUp').classList.remove('displayNone');
        document.getElementById('return_editMobilePopUp').classList.remove('displayNone');
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
    if (!event.target.matches('#options_edit_delete')) {
        if (menu.style.display === "block") {
            menu.style.display = "none";
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




function selectNextColor() {
    const color = availableColors[colorCounter % availableColors.length];
    colorCounter++;
    updateColorCounter();
    return color;
}


function generateColorPalette(numberColors) {
    const availableColors = [];
    const hexValuesForColor = '0123456789ABCDEF';
    const textContrastLevel = 40;
    for (let i = 0; i < numberColors; i++) {
        let color;
        let brightness;
        do {
            color = '#';
            for (let j = 0; j < 6; j++) {
                color += hexValuesForColor[Math.floor(Math.random() * 16)];
            }
            brightness = calculateBrightness(color);
        } while (brightness < textContrastLevel);
        availableColors.push(color);
    }
    return availableColors;
}

function calculateBrightness(color) {
    let hex = color.substring(1);
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    const [h, s, l] = rgbToHsl(r, g, b);
    return l;
}


function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
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
        const nextColor = selectNextColor();
        let data = {
            'name': name,
            'email': email,
            'telefonnummer': tel,
            'color': nextColor
        };
        contactList.push(data);
        submitContact('contact');
    }
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


function resetErrorMessages() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.innerText = '';
        element.style.display = 'none';
    });
}

