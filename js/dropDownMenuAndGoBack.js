function goToLastPage() {
    history.back();
  }
  function showDropdownMenu() {
    document
      .getElementById("headerDropdownOption")
      .classList.toggle("d-block");
  }

function showDropdownMenu() {
  document
    .getElementById("headerDropdownOption")
    .classList.toggle("d-block");

  document.addEventListener("click", handleOutsideClick);
}

function handleOutsideClick(event) {
  const dropdownMenu = document.getElementById("headerDropdownOption");
  const userButton = document.getElementById("userInitials");


  if (!dropdownMenu.contains(event.target) && !userButton.contains(event.target)) {
    dropdownMenu.classList.remove("d-block");


    document.removeEventListener("click", handleOutsideClick);
  }
}
