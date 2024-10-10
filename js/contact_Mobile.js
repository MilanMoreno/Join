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