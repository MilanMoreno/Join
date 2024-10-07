
let list = []; // Ein Array, das Kontakte speichert, bevor sie an den Server gesendet werden
let content = []; 
let editkey = null; 
let highlightKey = null; 
let colorPosition = 0; 
let loadedColors = []; 

function updateContactHighlights() {
    newContactBgHighlight();
}

function applyContactsBackgroundMenu() {
    contactsBgMenu();
}

function updateActiveContact(id_Contact) {

    if (editkey !== null) {
        document.getElementById(editkey).classList.remove('blueBackground');
    }

    editkey = id_Contact;
    document.getElementById(editkey).classList.add('blueBackground');
}

function displayContactDetails(contact, id_Contact) {
    const contentElement = document.getElementById('content');
    contentElement.innerHTML = detailedContactHtml(contact, id_Contact);
}

function prepareContactForEdit(contact) {
    setEditPopUpData(contact);
}

function implementResponsiveStyling() {
    checkUserMaxWidth();
}

function togglePopUp(param, key) {
    hideMobileAssets();
    let target = validatePopUp(key);
    let bgPopUp = document.getElementById(target);
    let popUp = bgPopUp.querySelector('.popUp');
    let sideBar = document.getElementById('containerSidebar');
    let header = document.getElementById('header');

    if (param === 'open') {
        paramOpen(bgPopUp, popUp, sideBar, header);
    } else if (param === 'close') {
        paramClose(bgPopUp, popUp, sideBar, header)
    } else {
        param.stopPropagation();
    }
}

function paramOpen(bgPopUp, popUp, sideBar, header) {
    bgPopUp.classList.remove('displayNone', 'hide');
    bgPopUp.classList.add('show');
    popUp.classList.remove('slide-out');
    popUp.classList.add('slide-in');
    sideBar.classList.add('displayNone');
    header.classList.add('stretch');
}

function paramClose(bgPopUp, popUp, sideBar, header) {
    popUp.classList.remove('slide-in');
    popUp.classList.add('slide-out');
    bgPopUp.classList.remove('show');
    bgPopUp.classList.add('hide');
    setTimeout(() => {
        bgPopUp.classList.add('displayNone');
    }, 500);
    sideBar.classList.remove('displayNone');
    header.classList.remove('stretch');
}

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






      // Funktion zum Öffnen/Schließen des Pop-ups
      function toggleContactForm() {
        const overlay = document.getElementById('overlay');
        
        // Umschalten zwischen ein- und ausgeblendetem Zustand
        if (overlay.style.display === 'none' || overlay.style.display === '') {
          overlay.style.display = 'flex'; // Flex-Layout zum Zentrieren des Pop-ups
        } else {
          overlay.style.display = 'none';
        }
      }

      // Funktion zum Schließen des Pop-ups durch Klick außerhalb des Fensters
      function closeOnOutsideClick(event) {
        const overlay = document.getElementById('overlay');
        const formContainer = document.getElementById('contactFormContainer');

        // Überprüfen, ob der Klick außerhalb des Pop-ups erfolgt ist
        if (event.target === overlay) {
          overlay.style.display = 'none';
        }
      }

      // Dummy-Funktion für das Formular-Submit
      function ContactAdd(event) {
        event.preventDefault(); // Verhindert das automatische Neuladen der Seite
        console.log("Kontakt wurde hinzugefügt!");
        toggleContactForm(); // Schließt das Pop-up nach dem Hinzufügen des Kontakts
      }