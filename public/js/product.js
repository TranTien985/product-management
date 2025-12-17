// public/js/script.js

// 1. XỬ LÝ LỌC SẢN PHẨM
const filterInputs = document.querySelectorAll(
  "input[name='category'], input[name='price']"
);

if (filterInputs.length > 0) {
  filterInputs.forEach((input) => {
    input.addEventListener("change", () => {
      // Lấy URL hiện tại
      const url = new URL(window.location.href);

      // Lấy danh sách các ô category đang được check
      const checkedCategories = document.querySelectorAll(
        "input[name='category']:checked"
      );
      // Xóa các param category cũ để cập nhật lại
      url.searchParams.delete("category");
      // Thêm các category mới được chọn vào URL
      checkedCategories.forEach((item) => {
        url.searchParams.append("category", item.value);
      });

      // Lấy danh sách các ô price đang được check
      const checkedPrices = document.querySelectorAll(
        "input[name='price']:checked"
      );
      url.searchParams.delete("price");
      checkedPrices.forEach((item) => {
        url.searchParams.append("price", item.value);
      });

      // Reset về trang 1 khi lọc để tránh lỗi phân trang
      if (checkedCategories.length > 0 || checkedPrices.length > 0) {
        url.searchParams.set("page", 1);
      }

      // Chuyển hướng trang
      window.location.href = url.href;
    });
  });
}

// 2. XỬ LÝ TOGGLE (ĐÓNG/MỞ) HEADER BỘ LỌC
const filterHeaders = document.querySelectorAll(".filter-header");
if (filterHeaders.length > 0) {
  filterHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      // Tìm đến phần content ngay phía sau header
      const content = header.nextElementSibling;
      // Toggle class d-none hoặc dùng style display
      if (content.style.display === "none") {
        content.style.display = "block";
        header.querySelector(".filter-toggle").textContent = "-"; // Đổi dấu
      } else {
        content.style.display = "none";
        header.querySelector(".filter-toggle").textContent = "+"; // Đổi dấu
      }
    });
  });
}

// slider chuyển ảnh trong detail
document.addEventListener("DOMContentLoaded", function () {
  const mainImage = document.getElementById("main-image");
  const thumbnails = document.querySelectorAll(".thumb-item");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");

  let currentIndex = 0; // Chỉ số ảnh hiện tại

  // Hàm cập nhật ảnh chính và trạng thái active của thumbnail
  function updateMainImage(index) {
    // 1. Xóa class 'active' ở tất cả thumbnail
    thumbnails.forEach((thumb) => thumb.classList.remove("active"));

    // 2. Thêm class 'active' cho thumbnail hiện tại
    thumbnails[index].classList.add("active");

    // 3. Thay đổi src của ảnh chính
    const newSrc = thumbnails[index].getAttribute("src");
    mainImage.setAttribute("src", newSrc);

    // 4. Cập nhật chỉ số hiện tại
    currentIndex = index;
  }

  // --- SỰ KIỆN CLICK VÀO THUMBNAIL ---
  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", function () {
      updateMainImage(index);
    });
  });

  // --- SỰ KIỆN CLICK NÚT PREV / NEXT ---
  if (btnPrev && btnNext) {
    // Chỉ chạy khi có nút (có nhiều hơn 1 ảnh)
    btnPrev.addEventListener("click", function () {
      let newIndex = currentIndex - 1;
      // Nếu đang ở ảnh đầu tiên thì quay về ảnh cuối cùng
      if (newIndex < 0) {
        newIndex = thumbnails.length - 1;
      }
      updateMainImage(newIndex);
    });

    btnNext.addEventListener("click", function () {
      let newIndex = currentIndex + 1;
      // Nếu đang ở ảnh cuối cùng thì quay về ảnh đầu tiên
      if (newIndex >= thumbnails.length) {
        newIndex = 0;
      }
      updateMainImage(newIndex);
    });
  }
});
//end slider chuyển ảnh trong detail

// thu gọn, phóng to description
document.addEventListener("DOMContentLoaded", function () {
  // ... (Code phần chuyển ảnh cũ giữ nguyên) ...

  // --- LOGIC XEM THÊM / THU GỌN MÔ TẢ ---
  const descContent = document.getElementById("desc-content");
  const descOverlay = document.getElementById("desc-overlay");
  const btnToggleDesc = document.getElementById("btn-toggle-desc");
  const btnText = document.getElementById("btn-desc-text");
  const btnIcon = document.getElementById("btn-desc-icon");

  // Kiểm tra: Nếu nội dung quá ngắn (ít hơn 500px) thì ẩn nút và overlay luôn
  if (descContent && descContent.scrollHeight <= 500) {
    btnToggleDesc.style.display = "none";
    descOverlay.style.display = "none";
    descContent.style.height = "auto"; // Hiện full luôn
  } else if (btnToggleDesc) {
    btnToggleDesc.addEventListener("click", function () {
      // Kiểm tra xem đang mở hay đóng
      const isExpanded = descContent.classList.contains("expanded");

      if (!isExpanded) {
        // HÀNH ĐỘNG: MỞ RỘNG (Xem thêm)
        descContent.classList.add("expanded");
        descOverlay.classList.add("hidden");

        // Đổi text và icon
        btnText.innerText = "Thu gọn";
        btnIcon.classList.remove("fa-chevron-down");
        btnIcon.classList.add("fa-chevron-up");
      } else {
        // HÀNH ĐỘNG: THU GỌN
        descContent.classList.remove("expanded");
        descOverlay.classList.remove("hidden");

        // Đổi text và icon
        btnText.innerText = "Xem thêm";
        btnIcon.classList.remove("fa-chevron-up");
        btnIcon.classList.add("fa-chevron-down");

        // Cuộn nhẹ lên đầu phần mô tả để người dùng dễ theo dõi lại
        descContent.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
});
//end thu gọn, phóng to description

// Logic hiển thị ảnh Preview khi upload
const uploadImage = document.querySelector("[upload-image]");

if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector(
    "[upload-image-preview]"
  );
  const previewContainer = uploadImage.querySelector(
    "[upload-image-preview-container]"
  );
  const deleteButton = uploadImage.querySelector("[icon-delete-image]");
  const labelButton = uploadImage.querySelector("label"); // Nút thêm ảnh

  // 1. Khi người dùng chọn file
  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tạo đường dẫn ảnh ảo từ file vừa chọn
      uploadImagePreview.src = URL.createObjectURL(file);

      // Hiện khung ảnh, ẩn nút chọn ảnh đi (hoặc để cả 2 tùy bạn)
      previewContainer.classList.remove("d-none");
      labelButton.classList.add("d-none"); // Ẩn nút thêm ảnh đi cho gọn
    }
  });

  // 2. Khi người dùng bấm nút X xóa ảnh
  deleteButton.addEventListener("click", () => {
    // Reset giá trị input và ảnh
    uploadImageInput.value = "";
    uploadImagePreview.src = "";

    // Ẩn khung ảnh, hiện lại nút chọn ảnh
    previewContainer.classList.add("d-none");
    labelButton.classList.remove("d-none");
  });
}
// End Logic hiển thị ảnh Preview khi upload

// hiển thị ảnh khi bấm
document.addEventListener("DOMContentLoaded", function () {
  // Lấy các thành phần của Modal
  const viewerModal = document.getElementById("imageViewerModal");
  const fullImage = document.getElementById("fullImage");
  const closeViewer = document.querySelector(".close-viewer");

  // Hàm đóng modal
  const closeModal = () => {
    if (viewerModal) viewerModal.classList.add("d-none");
  };

  // Gắn sự kiện đóng
  if (closeViewer) closeViewer.onclick = closeModal;
  if (viewerModal) {
    viewerModal.onclick = (e) => {
      if (e.target === viewerModal) closeModal();
    };
  }

  // Lấy TẤT CẢ các ảnh trong danh sách đánh giá
  const reviewImages = document.querySelectorAll(".review-image-zoom");

  if (reviewImages.length > 0) {
    reviewImages.forEach((img) => {
      img.addEventListener("click", function () {
        // Lấy src của ảnh được bấm gán vào Modal
        fullImage.src = this.src;
        viewerModal.classList.remove("d-none");
      });
    });
  }
});

// Tìm tất cả các nút phân trang review
const listButtonPagination = document.querySelectorAll(
  "[button-pagination-reviews]"
);

if (listButtonPagination.length > 0) {
  let url = new URL(window.location.href);
  listButtonPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination-reviews");
      url.searchParams.set("page", page);
      // Thêm hash #reviews-section để trình duyệt cuộn xuống
      url.hash = "reviews-section";
      // Chuyển trang
      window.location.href = url.href;
    });
  });
}
