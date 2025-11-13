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

//Pagination
const ButtonPagination = document.querySelectorAll("[button-pagination]")

if(ButtonPagination){
  let url = new URL(window.location.href)
  ButtonPagination.forEach(button => {
    button.addEventListener("click", ()=>{
      const page = button.getAttribute("button-pagination");
      
      url.searchParams.set("page", page)

      window.location.href = url.href;
    })
  })
}
// End Pagination