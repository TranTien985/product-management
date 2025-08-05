//Show alert

const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute('data-time'));
  const buttonClose = document.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  buttonClose.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden")
  });
}
//End Show alert
