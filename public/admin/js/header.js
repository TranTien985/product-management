const userIcon = document.querySelector(".userIcon")
const dropdownMenu = document.querySelector(".userDropdown")


userIcon.addEventListener("click", () => {
  dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block"
});

// nếu như bấm ra ngoài thì sẽ tắt hiển thị
document.addEventListener("click", (e) => {
  if(!userIcon.contains(e.target) && !dropdownMenu.contains(e.target)){
    dropdownMenu.style.display = "none"
  }
})