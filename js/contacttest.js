
let list = [];//Ein Array, das Kontakte speichert, bevor sie an den Server gesendet werden
let content = [];//Speichert die geladenen Kontaktdaten
let editkey = null;//Speichert die ID des aktuell bearbeiteten Kontakts.
let highlightKey = null;//Speichert den zuletzt hinzugefügten oder bearbeiteten Kontakt.
let colorPosition = 0; //Die Variable, die die aktuelle Position in der Farbauswahl nachverfolgt.
let loadedColors = [];//Ein Array, das generierte Farben speichert.



async function loadData() {
    try {
        const [contactResponse, colorIndexResponse] = await Promise.all([
            fetch(`${BASE_URL}.json`),
            fetch(`${BASE_URL}colorIndex.json`)
        ]);
//GET Anfrage wird hier gesendet an die REaltimeFirebase um Kontakte zu laden!
//DIe Empfangene Daten werden in der contact-Variable gespeichert und die includeHTML und renderContact funktionen werden aufgerufen, um die Kontakte anzuzeigen

        const contactData = await contactResponse.json();
        const info = contactData.contact;
        content.push(info);
        displayData(info);

        const colorIndexData = await colorIndexResponse.json();
        if (colorIndexData !== null) {
            colorPosition = colorIndexData;
        }
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}
//Die Funktion async function loadData() lädt Kontakte von der Firebase und speichert sie in content.
// Die Kontakte werden anschließend mit displayData() gerendert.

function displayData(info) {
    const contentElement = document.getElementById('contacts');
    contentElement.innerHTML = '';

    // Gruppen und sortieren der Kontakte
    const groupedContacts = groupAndSortContacts(info);
    const sortedLetters = Object.keys(groupedContacts).sort();

    // Jede Gruppe rendern
    sortedLetters.forEach(letter => renderGroup(contentElement, letter, groupedContacts[letter]));

    // Visuelle Aktualisierungen
    updateContactHighlights();
    applyContactsBackgroundMenu();
}

// Umbennenung von Funktionen für mehr Klarheit
function updateContactHighlights() {
    newContactBgHighlight();
}

function applyContactsBackgroundMenu() {
    contactsBgMenu();
}

//Darstellung der Kontakte: Diese Funktion leert den Kontaktbereich und zeigt die Kontakte gruppiert nach Anfangsbuchstaben an.

function groupAndSortContacts(info) {
    // Gruppieren der Kontakte nach dem ersten Buchstaben des Namens
    const groupedContacts = Object.values(info).reduce((groups, contact) => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        groups[firstLetter] = groups[firstLetter] || [];
        groups[firstLetter].push(contact);
        return groups;
    }, {});

    // Sortieren der Kontakte innerhalb jeder Gruppe nach Namen
    for (const letter in groupedContacts) {
        groupedContacts[letter].sort((a, b) => a.name.localeCompare(b.name));
    }

    return groupedContacts;

}
//groupAndSortContacts(): Gruppiert die Kontakte nach ihrem Anfangsbuchstaben und sortiert sie alphabetisch.
//Gruppierung nach Buchstaben: Diese Funktion gruppiert die Kontakte nach ihrem Anfangsbuchstaben.
//Sortierung: Innerhalb jeder Buchstabengruppe werden die Kontakte alphabetisch nach Name sortiert.

function renderGroup(content, letter, contacts) {
    content.innerHTML += `<h3 class="letter">${letter}</h3>`;
    contacts.forEach(contact => {
        displayContact()(content, contact);
    });
}
//renderGroup(): Stellt jede Gruppe von Kontakten dar.
//Highlight und Menüanpassungen: Nach dem Rendern werden newContactBgHighlight() und contactsBgMenu() aufgerufen, 
//um spezielle Stile anzuwenden.

/*Kontakt werden gerendert im Contactsdiv...jeder Contakt wird als contactCard hinzugefüügt,beim Klick auf eine Karte
(onclickrenderDetailedContact ) wird die detaillierte Ansicht des Kontakts angezeigt*/
function displayContact(contain, contact) {
    const contactColor = contact.color || getRandomColor();
    contain.innerHTML += `
        <div onclick="showContactInfo('${contact.id}')" id="${contact.id}" class="contactCard">
             <div id="letter${contact.id}" class="single_letter" style="background-color: ${contactColor};">${contact.name[0]}</div>
             <div class="fullName-email">
               <span>${contact.name}</span>
               <a class="email" href="#">${contact.email}</a>
             </div>
        </div>
    `;
}
//Einzelner Kontakt: displayContact()() stellt eine einzelne Kontaktkarte dar, inklusive Farbe und ersten Buchstaben.
function extractInitials(name) {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join(' ');
}
function showContactInfo(id_Contact) {
    const contact = locateContactById()(id_Contact);  // Holt den Kontakt anhand der ID

    if (!contact) return;  // Falls der Kontakt nicht existiert, abbrechen

    updateActiveContact(id_Contact);  // Aktualisiert den aktiven Kontakt und hebt ihn hervor
    displayContactDetails(contact, id_Contact);  // Zeigt die Details des Kontakts an
    prepareContactForEdit(contact);  // Befüllt das Bearbeitungs-Popup
    implementResponsiveStyling();  // Passt das Design an

    applyContactBackground(id_Contact);  // Setzt die Hintergrundfarbe des initialen Buchstabens
}

// Funktion, um den Kontakt basierend auf der ID zu holen
function locateContactById(id_Contact) {
    return content[0][id_Contact] || null;
}

// Funktion, um den aktiven Kontakt zu aktualisieren
function updateActiveContact(id_Contact) {
    // Entferne die blaue Hintergrundfarbe vom vorherigen Kontakt
    if (editkey !== null) {
        document.getElementById(editkey).classList.remove('blueBackground');
    }

    // Setze den neuen Kontakt als aktiv und füge die blaue Hintergrundfarbe hinzu
    editkey = id_Contact;
    document.getElementById(editkey).classList.add('blueBackground');
}

// Funktion, um die Kontaktdetails zu rendern
function displayContactDetails(contact, id_Contact) {
    const contentElement = document.getElementById('content');
    contentElement.innerHTML = detailedContactHtml(contact, id_Contact);
}

// Funktion, um das Bearbeitungs-Popup zu befüllen
function prepareContactForEdit(contact) {
    setEditPopUpData(contact);
}

// Funktion für responsive Anpassungen (z.B. Design auf verschiedene Bildschirmgrößen anpassen)
function implementResponsiveStyling() {
    checkUserMaxWidth();
}

// Funktion, um die Hintergrundfarbe des initialen Buchstabens zu setzen
function applyContactBackground(id_Contact) {
    adjustLetterOfBackgroundColor(id_Contact);
}

//showContactInfo()=>Details anzeigen: Diese Funktion zeigt die Detailansicht eines Kontakts an und hebt ihn hervor.
//Popup: Das Bearbeitungs-Popup wird mit den Daten des ausgewählten Kontakts gefüllt.

function setEditPopUpData(startingpoint) {
    document.getElementById('letterForPopUp').innerHTML = `${startingpoint['name'][0]}`;
    document.getElementById('editEmail').value = startingpoint['name'];
    document.getElementById('editTel').value = startingpoint['telefonnummer'];
    document.getElementById('editName').value = startingpoint['email'];
}

function adjustLetterOfBackgroundColor(id_Contact) {
    let startingpoint = content[0][id_Contact];
    
    let singleLetterElement = document.getElementById('singleLetterProfile');
    if (singleLetterElement) {
        let contactColor = startingpoint.color || getRandomColor(); // Verwende die vorhandene Farbe oder generiere eine neue
        singleLetterElement.style.backgroundColor = contactColor;
    }
}
/*2   Die Funktion sammelt HIer die Formulardaten und ErsTElt ein neues Konmtaktobjekt, dann eine POST-Anfrage wird an Firebase gesendet
um den neuen Kontakt zu speichern..Nach dem speichern werden die Daten halt erneut geladen, um die Anzeige zu aktuallisierRen*/
function addContact() {
    stopWindowReload('new');
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const tel = document.getElementById('tel').value;
    const nextColor = getNextColor();
    
    const data = {
        email,
        name,
        telefonnummer: tel,
        color: nextColor
    };
    list.push(data);
    postNewContact('contact');
}
//Kontakt hinzufügen: Diese Funktion sammelt die Eingabewerte aus einem Formular, erstellt ein Kontaktobjekt und
// speichert es mit postNewContact().
/*1*/
function generateColors(totalColors) {
    const hexChars = '0123456789ABCDEF'; // Hex-Zeichen für Farbwerte
    const minBrightness = 128; // Helligkeitsschwelle
    let colorList = []; // Liste für generierte Farben

    while (colorList.length < totalColors) {
        let randomColor = Array.from({ length: 6 }, () => hexChars[Math.floor(Math.random() * 16)]).join('');
        let colorHex = `#${randomColor}`;

        if (getColorBrightness(colorHex) >= minBrightness) {
            colorList.push(colorHex);
        }
    }
    return colorList;
}
function getColorBrightness(color) {
    // Entferne das führende '#' und parse die Farbkomponenten
    let hex = color.substring(1);
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Helligkeit berechnen (Luminanzmethode)
    return (0.2126 * r + 0.7152 * g + 0.0722 * b);
}
function getNextColor() {
    const color = colors[colorPosition % colors.length];
    colorPosition++;
    saveColorIndex();
    return color;
}
async function postNewContact(path) {
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        highlightKey = element;
        saveForBackground();
        let response = await fetch(BASE_URL + path + '.json', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(element)
        });
        if (response.ok) {
            console.log('Contact saved successfully');
            
            // Änderung hier: Speichern des aktuellen colorIndex in Firebase nach erfolgreicher Speicherung des Kontakts
            saveColorIndex();
        } else {
            console.error('Failed to save contact');
        }
    }
    window.location.reload();
}
function saveColorIndex() {
    fetch(BASE_URL + 'colorIndex.json', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(colorPosition)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update color index');
        }
        console.log('Color index updated successfully');
    })
    .catch(error => console.error('Error updating color index:', error));
}
function saveForBackground() {
    let asTexthighlightKey = JSON.stringify(highlightKey);
    localStorage.setItem('highlightKey', asTexthighlightKey);
}
function newContactBgHighlight() {
    let asTexthighlightKey = localStorage.getItem('highlightKey')

    if (asTexthighlightKey === null) {
        return
    } else
    highlightKey = JSON.parse(asTexthighlightKey)
    console.log(highlightKey)
    editkey = searchNameInMaterialArray();
    showContactInfo(editkey);
    localStorage.clear();
    scrollToNewDiv();
}
function searchNameInMaterialArray() {
    let nameData = content[0]

    for (const key in nameData) {
        if (nameData[key].name === highlightKey['name']) {
            return key;
        }
    }
}
function scrollToNewDiv() {
    document.getElementById(editkey).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
}
/*.Beim Abschicken des Formulars(onsubmit=UpdateContact() wird eben die Fktion aktiviert und diese sammelt die bearbeiteten Formulardaten
und ERSTELLT ein KontaktObkekT...Eine Patch Anfrage wird an FireBASE gesendet, damit die Anzeige aktuallisiert wird!!Nachdem Aktuallisieren
werden die Daten erneut geladen,um die Anzeige zu aktuallisieren!)..*/
async function UpdateContact() {
    stopWindowReload('update');
    list.length = 0;
    list.push(ContactAdd());
    const response = await fetch(`${BASE_URL}contact/${editkey}.json`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(list[0]),
    });
    window.location.reload();
}
function ContactAdd() {
    let email = document.getElementById('editEmail');
    let name = document.getElementById('editName');
    let tel = document.getElementById('editTel');
    let data =
    {
        'email': email.value,
        'name': name.value,
        'telefonnummer': tel.value
    };
    return data;
}
function stopWindowReload(key) {
    let target;
    if (key == 'new') {
        target = 'ContactAddForm';
    } else if (key == 'update') {
        target = 'editContactForm';
    }
    document.getElementById(target), addEventListener('submit', function (event) {
        event.preventDefault();
    });
}
/*Die Funktion sendet eine Delete Anfrage an Firebase, um den spezifischen Kontakt zu löschen*/ 
async function eraseContact(path = 'contact', id) {
    try {
        const url = `${BASE_URL}${path}/${id}.json`;
        let response = await fetch(url, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error('Fehler beim Löschen des Kontakts');
        }
        window.location.reload();
    } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error.message);
    }
}
function togglePopUp(param, key) {
    hideMobileAssets();
    let target = validatePopUp(key);
    let bgPopUp = document.getElementById(target);
    let popUp = bgPopUp.querySelector('.popUp');
    let sideBar = document.getElementById('containerSidebar');
    let header = document.getElementById('header');

    if (param === 'open') {
        paramOpen(bgPopUp,popUp,sideBar,header);
    } else if (param === 'close') {
        paramClose(bgPopUp,popUp,sideBar,header)
    } else {
        param.stopPropagation();
    }
}
function paramOpen(bgPopUp,popUp,sideBar,header) {
    bgPopUp.classList.remove('displayNone', 'hide');
    bgPopUp.classList.add('show');
    popUp.classList.remove('slide-out');
    popUp.classList.add('slide-in');
    sideBar.classList.add('displayNone');
    header.classList.add('stretch');
}
function paramClose(bgPopUp,popUp,sideBar,header) {
    popUp.classList.remove('slide-in');
    popUp.classList.add('slide-out');
    bgPopUp.classList.remove('show');
    bgPopUp.classList.add('hide');
    setTimeout(() => {
        bgPopUp.classList.add('displayNone');
    }, 500);
    sideBar.classList.remove('displayNone')
    header.classList.remove('stretch');
}
function validatePopUp(key) {
    return key ? 'backgroundPopUpEdit' : 'backgroundPopUp';
}
function getRandomColor() {
    const letters = '89ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    console.log(color);
    return color;
}
function showContactMobile() {
    document.getElementById('contentSection').classList.add('dNone');
    document.getElementById('contactList').classList.remove('displayNone');
}
function contactsBgMenu() {
    document.getElementById('link-contact').classList.add('bg-focus');
  }

//*3  html function//
function detailedContactHtml(contactData, contactId) {
    return `
        <div class="contact-profile">
            <div id="singleLetterProfile" class="single-letter">${contactData.name.charAt(0)}</div>
            <div class="h4_edit-delete">
                <h4>${contactData.name}</h4>
                <div class="edit-delete">
                    <span onclick="togglePopUp('open', true)">
                        <img src="contact-assets/img/edit.png" alt="Edit" />Edit
                    </span>
                    <span onclick="eraseContact('contact', '${contactId}')">
                        <img src="contact-assets/img/delete.png" alt="Delete" />Delete
                    </span>
                </div>
            </div>
        </div>
        <div class="pers-info">
            <b>Email:</b>
            <a href="mailto:${contactData.email}">${contactData.email}</a>
        </div>
        <div class="pers-info">
            <span><b>Phone:</b></span>
            <span>${contactData.telefonnummer}</span>
        </div>
    `;
}