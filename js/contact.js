
let list = [];//Ein Array, das Kontakte speichert, bevor sie an den Server gesendet werden
let content = [];//Speichert die geladenen Kontaktdaten
let editkey = null;//Speichert die ID des aktuell bearbeiteten Kontakts.
let highlightKey = null;//Speichert den zuletzt hinzugefügten oder bearbeiteten Kontakt.
let colorPosition = 0; //Die Variable, die die aktuelle Position in der Farbauswahl nachverfolgt.
let loadedColors = [];//Ein Array, das generierte Farben speichert.

function updateContactHighlights() {
    newContactBgHighlight();
}
function applyContactsBackgroundMenu() {
    contactsBgMenu();
}
/*a*/function displayContact(contain, contact) {
    const contactColor = contact.color || getRandomColor();
    contain.innerHTML += `
        <div onclick="infoNeuContact('${contact.id}')" id="${contact.id}" class="contactCard">
             <div id="letter${contact.id}" class="single_letter" style="background-color: ${contactColor};">${contact.name[0]}</div>
             <div class="fullName-email">
               <span>${contact.name}</span>
               <a class="email" href="#">${contact.email}</a>
             </div>
        </div>
    `;
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

/*Die Funktion sendet eine Delete Anfrage an Firebase, um den spezifischen Kontakt zu löschen*/ 
/*e*/
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
/*c*/

function paramOpen(bgPopUp,popUp,sideBar,header) {
    bgPopUp.classList.remove('displayNone', 'hide');
    bgPopUp.classList.add('show');
    popUp.classList.remove('slide-out');
    popUp.classList.add('slide-in');
    sideBar.classList.add('displayNone');
    header.classList.add('stretch');
}
/*b*/
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
/*d*/
function validatePopUp(key) {
    return key ? 'backgroundPopUpEdit' : 'backgroundPopUp';
}
function showContactMobile() {
    document.getElementById('contentSection').classList.add('dNone');
    document.getElementById('contactList').classList.remove('displayNone');
}
function contactsBgMenu() {
    document.getElementById('link-contact').classList.add('bg-focus');
  }