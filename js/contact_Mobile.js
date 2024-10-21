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

window.onclick = function(event) {
    var menu = document.getElementById("editDeleteMenu");
    if (!event.target.matches('#options_edit_delete')) {
        if (menu.style.display === "block") {
            menu.style.display = "none";
        }
    }
}

function showModal(PopUpBgElement, show, sideBar, header) {
    PopUpBgElement.classList.remove('displayNone', 'hide');
    PopUpBgElement.classList.add('show');
    show.classList.remove('slide-out');
    show.classList.add('slide-in');
    sideBar.classList.add('displayNone');
    header.classList.add('stretch');
}

function hideModal(bgPopUp, popUp, sideBar, header) {
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
