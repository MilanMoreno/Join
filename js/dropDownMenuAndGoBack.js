function goToLastPage() {
    history.back();
  }
  function showDropdownMenu() {
    document
      .getElementById("headerDropdownOption")
      .classList.toggle("d-block");
  }
  // Funktion, um das Dropdown-Menü anzuzeigen oder zu verbergen
function showDropdownMenu() {
  document
    .getElementById("headerDropdownOption")
    .classList.toggle("d-block");

  // Eventlistener hinzufügen, um auf Klicks außerhalb zu reagieren
  document.addEventListener("click", handleOutsideClick);
}

// Funktion, um zu prüfen, ob außerhalb des Menüs geklickt wurde
function handleOutsideClick(event) {
  const dropdownMenu = document.getElementById("headerDropdownOption");
  const userButton = document.getElementById("userInitials");

  // Wenn der Klick nicht im Dropdown oder im Button stattfand, Menü schließen
  if (!dropdownMenu.contains(event.target) && !userButton.contains(event.target)) {
    dropdownMenu.classList.remove("d-block");

    // Eventlistener wieder entfernen, um unnötige Checks zu vermeiden
    document.removeEventListener("click", handleOutsideClick);
  }
}
