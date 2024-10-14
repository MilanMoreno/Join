/*Klappt noch nicht ganz deshalb lasse ich sie momentan weg  header wird nicht geladen bei board.html summary.html und add_task.html*/ 
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]")
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i]
    file = element.getAttribute("w3-include-html") // "includes/header.html"
    let resp = await fetch(file)
    if (resp.ok) {
      element.innerHTML = await resp.text()
    } else {
      element.innerHTML = "Page not found"
    }
  }
}

;(async function () {
  await includeHTML()
  showUser()
})()

function showUser() {
  let userInitials = document.getElementById("userInitials")
  if (!userInitials) {
    console.error("Can not find container userInitials")
    return
  }
  let userAsText = localStorage.getItem("users")
  let user = JSON.parse(userAsText)
  userInitials.innerHTML = `<div>${user.initials}</div>`
}

function summaryBgMenu() {
  document.getElementById("summary-link").classList.add("bg-focus")
}

function addTaskBgMenu() {
  document.getElementById("task-link").classList.add("bg-focus")
}

function boardBgMenu() {
  document.getElementById("board-link").classList.add("bg-focus")
}
