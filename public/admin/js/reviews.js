// Button Status (Bộ lọc)
const reviewsButtonStatus = document.querySelectorAll("[reviews-button-status]") 
// các thuộc tính tự định nghĩa thì phải thêm ngoặc vuông vào 

if(reviewsButtonStatus.length > 0 ){
  let url = new URL(window.location.href); // lấy url của trang

  reviewsButtonStatus.forEach(button =>{
    button.addEventListener("click", () => {
      const status = button.getAttribute("reviews-button-status")
      if(status){
        // đặt lại trạng thái cho url
        url.searchParams.set("status", status)
      }
      else{
        url.searchParams.delete("status")
      }
      // Điều hướng lại url
      window.location.href = url.href;
    })
  })
}
// End Button Status

// Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");

  buttonsChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      // Đảo ngược trạng thái: Nếu đang active -> inactive, và ngược lại
      let statusChange = statusCurrent == "active" ? "inactive" : "active";

      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action = action;

      formChangeStatus.submit();
    });
  });
}
//End Change Status


// Checkbox multi
const reviewsCheckboxMulti = document.querySelector("[reviews-checkbox-multi]")

if(reviewsCheckboxMulti){
  const inputCheckAll = reviewsCheckboxMulti.querySelector("input[name='checkall']")
  const inputsId = reviewsCheckboxMulti.querySelectorAll("input[name='id']")
  
  // logic checkall
  inputCheckAll.addEventListener("click", () => {
    // kiểm tra ô input được check hay chưa ta dùng từ khóa "check"
    if(inputCheckAll.checked){
      inputsId.forEach(input => {
        input.checked = true
      })
    }
    else{
      inputsId.forEach(input => {
        input.checked = false
      })
    }
  })

  // logic check
  inputsId.forEach(input => {
    input.addEventListener("click", () => {
      const countChecked = reviewsCheckboxMulti.querySelectorAll("input[name='id']:checked").length// tìm ra những ô input checked
      
      if(countChecked == inputsId.length){
        inputCheckAll.checked = true
      }
      else{
        inputCheckAll.checked = false
      }
    })
  })
}
// End Checkbox multi


// Xử lý Form Change Multi
const reviewsFormChangeMulti = document.querySelector("[reviews-form-change-multi]");

if(reviewsFormChangeMulti) {
  reviewsFormChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault(); // Luôn chặn submit mặc định trước

    const form = e.target;
    
    // Tìm các ô checkbox đã được tích
    // name='id' phải khớp với phần view index.pug
    const inputsChecked = document.querySelectorAll("input[name='id']:checked");

    if(inputsChecked.length > 0) {
      let ids = [];
      const inputIds = form.querySelector("input[name='ids']");

      inputsChecked.forEach(input => {
        const id = input.value;
        if(id) {
            ids.push(id);
        }
      });

      inputIds.value = ids.join(",");

      if(inputIds.value) {
        form.submit(); // Gửi form
      }
    } else {
      alert("Vui lòng chọn ít nhất một bản ghi!");
    }
  });
}

// Delete item
const buttonDelete = document.querySelectorAll("[button-delete]")
if(buttonDelete.length > 0){
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");
  buttonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("bạn có chắc muốn xóa sản phẩm này")
      
      if(isConfirm){
        const id = button.getAttribute("data-id");

        const action = path + `/${id}?_method=DELETE`;
        
        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    })
  })
}
//End Delete item

// hiển thị ảnh khi bấm 
document.addEventListener("DOMContentLoaded", function() {
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
  // (Dựa vào class .review-image-zoom chúng ta vừa thêm ở Bước 3)
  const reviewImages = document.querySelectorAll(".review-image-zoom img");

  if (reviewImages.length > 0) {
    reviewImages.forEach(img => {
      img.addEventListener("click", function() {
        // Lấy src của ảnh được bấm gán vào Modal
        fullImage.src = this.src;
        // Hiện Modal
        viewerModal.classList.remove("d-none");
      });
    });
  }
});