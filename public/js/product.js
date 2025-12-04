// public/js/script.js

// 1. XỬ LÝ LỌC SẢN PHẨM
const filterInputs = document.querySelectorAll("input[name='category'], input[name='price']");

if (filterInputs.length > 0) {
  filterInputs.forEach((input) => {
    input.addEventListener("change", () => {
      // Lấy URL hiện tại
      const url = new URL(window.location.href);

      // Lấy danh sách các ô category đang được check
      const checkedCategories = document.querySelectorAll("input[name='category']:checked");
      // Xóa các param category cũ để cập nhật lại
      url.searchParams.delete("category");
      // Thêm các category mới được chọn vào URL
      checkedCategories.forEach((item) => {
        url.searchParams.append("category", item.value);
      });

      // Lấy danh sách các ô price đang được check
      const checkedPrices = document.querySelectorAll("input[name='price']:checked");
      url.searchParams.delete("price");
      checkedPrices.forEach((item) => {
        url.searchParams.append("price", item.value);
      });

      // Reset về trang 1 khi lọc để tránh lỗi phân trang
      if(checkedCategories.length > 0 || checkedPrices.length > 0) {
        url.searchParams.set("page", 1);
      }

      // Chuyển hướng trang
      window.location.href = url.href;
    });
  });
}

// 2. XỬ LÝ TOGGLE (ĐÓNG/MỞ) HEADER BỘ LỌC
const filterHeaders = document.querySelectorAll(".filter-header");
if(filterHeaders.length > 0) {
    filterHeaders.forEach(header => {
        header.addEventListener("click", () => {
            // Tìm đến phần content ngay phía sau header
            const content = header.nextElementSibling;
            // Toggle class d-none hoặc dùng style display
            if(content.style.display === "none") {
                content.style.display = "block";
                header.querySelector(".filter-toggle").textContent = "-"; // Đổi dấu
            } else {
                content.style.display = "none";
                header.querySelector(".filter-toggle").textContent = "+"; // Đổi dấu
            }
        });
    });
}