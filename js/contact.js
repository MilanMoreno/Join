let contactList = [];
let storedData = [];
let colorCounter = 0;
let generatedColors = [];
let currentEditKey = null;
let selectedContact = null;
const availableColors = generateColorPalette(20);


async function fetchData() {
    try {
        let returnValue = await fetch(BASE_URL + '.json');
        let returnValueAsJson = await returnValue.json();
        let info = returnValueAsJson.contact;
        storedData.push(returnValueAsJson.contact);
        displayContacts(info);
        let colorCounterResponse = await fetch(BASE_URL + 'colorIndex.json');
        let colorCounterData = await colorCounterResponse.json();
        if (colorCounterData !== null) {
            colorCounter = colorCounterData;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function displayContacts(contactData) {
    let container = document.getElementById('contacts');
    container.innerHTML = '';
    const sortedGroups = categorizeContacts(contactData);
    const sortedLetters = Object.keys(sortedGroups).sort();
    sortedLetters.forEach(letter => {
        createContactGroup(container, letter, sortedGroups[letter]);
    });
    applyNewContactHighlight();
    highlightContactList();
}


function categorizeContacts(contactData) {
    const organizedContacts = Object.keys(contactData).reduce((groups, id) => {
        const firstLetter = contactData[id].name[0].toUpperCase();
        groups[firstLetter] = groups[firstLetter] || [];
        groups[firstLetter].push({ id, ...contactData[id] });
        return groups;
    }, {});
    Object.keys(organizedContacts).forEach(letter =>
        organizedContacts[letter].sort((a, b) => a.name.localeCompare(b.name))
    );
    return organizedContacts;
}


function createContactGroup(container, letter, contacts) {
    container.innerHTML += `<h3 class="letter">${letter}</h3>`;
    contacts.forEach(contact => {
        displayContact(container, contact);
    });
}


function displayContact(container, contact) {
    const contactShade = contact.color || getRandomHexColor();
    container.innerHTML += `
        <div onclick="showDetailedContact('${contact.id}')" id="${contact.id}" class="contactCard">
             <div id="letter${contact.id}" class="one_letter" style="background-color: ${contactShade};">${contact.name[0]}</div>
             <div class="fullName-email">
               <span>${contact.name}</span>
               <a class="email" href="#">${contact.email}</a>
             </div>
        </div>
    `;
}


function getInitials(name) {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join(' ');
}


function showDetailedContact(contactId) {
    let root = storedData[0][contactId];
    if (currentEditKey !== null) {
        document.getElementById(currentEditKey).classList.remove('blueBackground');
    }
    currentEditKey = contactId;
    document.getElementById(currentEditKey).classList.add('blueBackground');
    let target = document.getElementById('content');
    target.innerHTML = contactInfoHtml(root, contactId);
    setEditPopupContent(root);
    checkScreenSize();
    applyBackgroundColor(contactId);
}


function setEditPopupContent(root) {
    document.getElementById('letterForPopUp').innerHTML = `${root['name'][0]}`;
    document.getElementById('editName').value = root['name'];
    document.getElementById('editEmail').value = root['email'];
    document.getElementById('editTel').value = root['telefonnummer'];

}


function applyBackgroundColor(contactId) {
    let root = storedData[0][contactId];
    let profileLetterElement = document.getElementById('singleLetterProfile');
    if (profileLetterElement) {
        let contactShade = root.color || getRandomHexColor();
        profileLetterElement.style.backgroundColor = contactShade;
    }
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


function selectNextColor() {
    const color = availableColors[colorCounter % availableColors.length];
    colorCounter++;
    updateColorCounter();
    return color;
}


async function submitContact(path) {
    for (let index = 0; index < contactList.length; index++) {
        const element = contactList[index];
        selectedContact = element;
        saveHighlight();
        let response = await fetch(BASE_URL + path + '.json', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(element)
        });
        if (response.ok) {
            console.log('Contact saved successfully');
            updateColorCounter();
        } else {
            console.error('Failed to save contact');
        }
    }
    window.location.reload();
}


function updateColorCounter() {
    fetch(BASE_URL + 'colorIndex.json', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(colorCounter)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update color index');
            }
            console.log('Color index updated successfully');
        })
        .catch(error => console.error('Error updating color index:', error));
}


function saveHighlight() {
    let serializedContact = JSON.stringify(selectedContact);
    localStorage.setItem('highlightKey', serializedContact);
}


function applyNewContactHighlight() {
    let serializedContact = localStorage.getItem('highlightKey')
    if (serializedContact === null) {
        return
    } else
        selectedContact = JSON.parse(serializedContact)
    console.log(selectedContact)
    currentEditKey = findContactInStoredData();
    showDetailedContact(currentEditKey);
    localStorage.removeItem('highlightKey');
    scrollToNewContact();
}


function findContactInStoredData() {
    let contactData = storedData[0]

    for (const key in contactData) {
        if (contactData[key].name === selectedContact['name']) {
            return key;
        }
    }
}


function scrollToNewContact() {
    document.getElementById(currentEditKey).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}


async function modifyContact() {
    let tel = document.getElementById("editTel")
    if (!validatePhoneNumber(tel.value)) {
        alert("Please enter a valid telephone number (starting with + and only numbers).");
        return;
    } else {
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
        window.location.reload();
    }
}


function modifyContactDetails() {
    let name = document.getElementById('editName');
    let email = document.getElementById('editEmail');
    let tel = document.getElementById('editTel');

    let data =
    {
        'name': name.value,
        'email': email.value,
        'telefonnummer': tel.value

    };
    return data;
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


async function removeContact(path = 'contact', id) {
    try {
        const url = `${BASE_URL}${path}/${id}.json`;
        let response = await fetch(url, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error('Löschfehler des Kontakts');
        }
        window.location.reload();
    } catch (error) {
        console.error('Löschfehler des Kontakts:', error.message);
    }
}


function openClosePopUp(param, key) {
    concealMobileElements();
    let target = validatePopUp(key);
    let bgPopUp = document.getElementById(target);
    let popUp = bgPopUp.querySelector('.popUp');
    let sideBar = document.getElementById('.sidebar');
    let header = document.getElementById('header');
    if (param === 'open') {
        showModal(bgPopUp, popUp, sideBar, header);
    } else if (param === 'close') {
        hideModal(bgPopUp, popUp, sideBar, header)
    } else {
        param.stopPropagation();
    }

}

function validatePopUp(key) {
    return key ? 'EditModalBackground' : 'modalBackground';
}


function getRandomHexColor() {
    const letters = '89ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}


function highlightContactList() {
    document.getElementById('link-contact').classList.add('bg-focus');
}


function contactInfoHtml(root, contactId) {
    return `
        <div class="contact-profile">
            <div id="singleLetterProfile" class="single-letter">${root['name'][0]}</div>
            <div class="h4_edit-delete">
                <h4>${root['name']}</h4>
                <div class="edit-delete">
                    <span onclick="openClosePopUp('open', true)"><img src="imgs/icon_edit.png"/>Edit</span>
                    <span onclick="removeContact('contact', '${contactId}')"><img src="imgs/icon_trash.png" />Delete</span>
                </div>
            </div>
        </div>
        <div class="pers-info">
            <b>Email</b>
            <a href="#">${root['email']}</a>
        </div>
        <div class="pers-info">
            <span><b>Phone</b></span>
            <span>${root['telefonnummer']}</span>
        </div>

        <div id="editDeleteMenu">
      
        <a href="#" onclick="openClosePopUp('open', true)"><img src="imgs/icon_edit.png"/>Edit</a>
        <a href="#" onclick="removeContact('contact', '${contactId}')"><img src="imgs/icon_trash.png" />Delete</a>
    </div>

    `;
}
