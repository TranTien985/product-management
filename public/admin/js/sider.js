document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".inner-menu li a");

  // Gán sự kiện click cho mỗi link
  links.forEach(link => {
    link.addEventListener("click", () => {
      // Lưu href của menu được click
      localStorage.setItem("activeMenu", link.getAttribute("href"));
    });
  });

  // Khi load lại trang, đọc lại menu đã lưu
  const activeHref = localStorage.getItem("activeMenu");
  if (activeHref) {
    links.forEach(link => {
      if (link.getAttribute("href") === activeHref) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
});
