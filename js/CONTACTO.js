let contactList = [];   // Vorher: array
let storedData = [];    // Vorher: material
let currentEditKey = null; // Vorher: keyForEdit
let selectedContact = null; // Vorher: highlightKey

let colorCounter = 0;   // Vorher: colorIndex
let generatedColors = []; // Vorher: loadedColors

const availableColors = generateColorPalette(20); // Vorher: colors

async function fetchData() { // Vorher: loadData
    try {
        let response = await fetch(BASE_URL + '.json');
        let responseData = await response.json();
        let contactData = responseData.contact;
        storedData.push(responseData.contact);
        displayContacts(contactData); // Vorher: renderData
        let colorCounterResponse = await fetch(BASE_URL + 'colorIndex.json');
        let colorCounterData = await colorCounterResponse.json();
        if (colorCounterData !== null) {
            colorCounter = colorCounterData;
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function displayContacts(contactData) { // Vorher: renderData
    let container = document.getElementById('contacts');
    container.innerHTML = '';

    const sortedGroups = categorizeContacts(contactData); // Vorher: groupAndSortContacts
    const sortedLetters = Object.keys(sortedGroups).sort();

    sortedLetters.forEach(letter => {
        createContactGroup(container, letter, sortedGroups[letter]); // Vorher: renderGroup
    });

    applyNewContactHighlight(); // Vorher: newContactBgHighlight
    highlightContactList(); // Vorher: contactsBgMenu
}

function categorizeContacts(contactData) { // Vorher: groupAndSortContacts
    let groupedContacts = Object.keys(contactData).reduce((groups, id) => {
        const contact = contactData[id];
        const firstLetter = contact.name[0].toUpperCase();

        if (!groups[firstLetter]) {
            groups[firstLetter] = [];
        }
        groups[firstLetter].push({ id, ...contact });

        return groups;
    }, {});
    Object.keys(groupedContacts).forEach(letter => {
        groupedContacts[letter].sort((a, b) => {
            return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
        });
    });
    return groupedContacts;
}

function createContactGroup(container, letter, contacts) { // Vorher: renderGroup
    container.innerHTML += `<h3 class="letter">${letter}</h3>`;
    contacts.forEach(contact => {
        displayContact(container, contact); // Vorher: renderContact
    });
}

function displayContact(container, contact) { // Vorher: renderContact
    const contactColor = contact.color || getRandomHexColor(); // Vorher: getRandomColor
    container.innerHTML += `
        <div onclick="showDetailedContact('${contact.id}')" id="${contact.id}" class="contactCard">
             <div id="letter${contact.id}" class="single_letter" style="background-color: ${contactColor};">${contact.name[0]}</div>
             <div class="fullName-email">
               <span>${contact.name}</span>
               <a class="email" href="#">${contact.email}</a>
             </div>
        </div>
    `;
}

function showDetailedContact(contactId) { // Vorher: renderDetailedContact
    let contactDetails = storedData[0][contactId];

    if (currentEditKey !== null) {
        document.getElementById(currentEditKey).classList.remove('blueBackground');
    }

    currentEditKey = contactId;
    document.getElementById(currentEditKey).classList.add('blueBackground');

    let detailSection = document.getElementById('content');
    detailSection.innerHTML = detailedContactHtml(contactDetails, contactId);
    fillEditPopup(contactDetails); // Vorher: fillEditPopUp
    checkScreenSize(); // Vorher: checkUserMaxWidth
    applyBackgroundColor(contactId); // Vorher: setSingleLetterBackgroundColor
}

function fillEditPopup(contactDetails) { // Vorher: fillEditPopUp
    document.getElementById('letterForPopUp').innerHTML = `${contactDetails['name'][0]}`;
    document.getElementById('editEmail').value = contactDetails['name'];
    document.getElementById('editTel').value = contactDetails['telefonnummer'];
    document.getElementById('editName').value = contactDetails['email'];
}

function applyBackgroundColor(contactId) { // Vorher: setSingleLetterBackgroundColor
    let contactDetails = storedData[0][contactId];
    
    let profileLetterElement = document.getElementById('singleLetterProfile');
    if (profileLetterElement) {
        let contactColor = contactDetails.color || getRandomHexColor();
        profileLetterElement.style.backgroundColor = contactColor;
    }
}

function createNewContact() { // Vorher: addContact
    preventFormSubmit('new'); // Vorher: stopWindowReload

    let email = document.getElementById('email');
    let name = document.getElementById('name');
    let tel = document.getElementById('tel');
    const nextColor = selectNextColor(); // Vorher: getNextColor
    let newContact = {
        'email': email.value,
        'name': name.value,
        'telefonnummer': tel.value,
        'color': nextColor
    };
    contactList.push(newContact);
    submitContact('contact'); // Vorher: postNewContact
}

function generateColorPalette(numColors) { // Vorher: generateColors
    const colors = [];
    const hexCharacters = '0123456789ABCDEF';
    const brightnessThreshold = 132;

    for (let p = 0; p < numColors; p++) {
        let color;
        do {
            color = '#';
            for (let q = 0; q < 6; q++) {
                color += hexCharacters[Math.floor(Math.random() * 16)];
            }
        } while (calculateBrightness(color) < brightnessThreshold);

        colors.push(color);
    }

    return colors;
}

function calculateBrightness(color) { // Vorher: getColorBrightness
    let hex = color.substring(1);
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return (0.2126 * r + 0.7152 * g + 0.0722 * b);
}

function selectNextColor() { // Vorher: getNextColor
    const selectedColor = availableColors[colorCounter % availableColors.length];
    colorCounter++;
    updateColorCounter(); // Vorher: saveColorIndex
    return selectedColor;
}

async function submitContact(path) { // Vorher: postNewContact
    for (let index = 0; index < contactList.length; index++) {
        const contact = contactList[index];
        selectedContact = contact;
        saveHighlight(); // Vorher: saveForBackground
        let response = await fetch(BASE_URL + path + '.json', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contact)
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

function updateColorCounter() { // Vorher: saveColorIndex
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

function saveHighlight() { // Vorher: saveForBackground
    let serializedContact = JSON.stringify(selectedContact);
    localStorage.setItem('selectedContact', serializedContact);
}

function applyNewContactHighlight() { // Vorher: newContactBgHighlight
    let serializedContact = localStorage.getItem('selectedContact');

    if (serializedContact === null) {
        return;
    } else {
        selectedContact = JSON.parse(serializedContact);
        console.log(selectedContact);
        currentEditKey = findContactInStoredData(); // Vorher: searchNameInMaterialArray
        showDetailedContact(currentEditKey);
        localStorage.clear();
        scrollToNewContact(); // Vorher: scrollToNewDiv
    }
}

function findContactInStoredData() { // Vorher: searchNameInMaterialArray
    let contactData = storedData[0];

    for (const key in contactData) {
        if (contactData[key].name === selectedContact['name']) {
            return key;
        }
    }
}

function scrollToNewContact() { // Vorher: scrollToNewDiv
    document.getElementById(currentEditKey).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

async function modifyContact() { // Vorher: UpdateContact
    preventFormSubmit('update'); // Vorher: stopWindowReload
    contactList.length = 0;
    contactList.push(collectEditedContact()); // Vorher: collectEditFormData
    const editId = currentEditKey;
    fetch(BASE_URL + 'contact/' + editId + '.json', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contactList[0])
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update contact');
        }
        console.log('Contact updated successfully');
    })
    .catch(error => console.error('Error updating contact:', error));
    window.location.reload();
}

function collectEditedContact() { // Vorher: collectEditFormData
    let email = document.getElementById('editEmail').value;
    let name = document.getElementById('editName').value;
    let tel = document.getElementById('editTel').value;
    return {
        'email': email,
        'name': name,
        'telefonnummer': tel,
        'color': selectNextColor()
    };
}




/*
function generateColorPalette(numberColors) {
    const availableColors = [];
    const hexValuesForColor = '0123456789ABCDEF'; // Hexadezimal-Ziffern für Farbcodes
    const textContrastLevel = 128; // Helligkeitsschwelle für den Text

    for (let i = 0; i < numberColors; i++) {
        let color;
        do {
            color = '#';
            for (let j = 0; j < 6; j++) {
                color += hexValuesForColor[Math.floor(Math.random() * 16)];
            }
        } while (calculateBrightness(color) < textContrastLevel);

        availableColors.push(color);
    }

    return availableColors;
}*/
/*
function calculateBrightness(color) {
    // Entferne das führende '#' und parse die Farbkomponenten
    let hex = color.substring(1);
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Helligkeit berechnen (Luminanzmethode)
    return (0.2126 * r + 0.7152 * g + 0.0722 * b);
}
*/