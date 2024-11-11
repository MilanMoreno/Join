const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "./index.html";
}

function getInitials(name) {
  const nameParts = name.trim().split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  return (
    nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase()
  );
}

const initials = getInitials(user.name || "G");

const userInitialsDiv = document.getElementById("userInitials");
if (userInitialsDiv) {
  userInitialsDiv.querySelector("div").textContent = initials;
}