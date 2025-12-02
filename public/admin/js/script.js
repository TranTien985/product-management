// Button Status (Bộ lọc)
const ButtonStatus = document.querySelectorAll("[button-status]") 
// các thuộc tính tự định nghĩa thì phải thêm ngoặc vuông vào 

if(ButtonStatus.length > 0 ){
  let url = new URL(window.location.href); // lấy url của trang

  ButtonStatus.forEach(button =>{
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status")
      if(status){
        // đặt lại trạng thái cho url
        url.searchParams.set("availabilityStatus", status)
      }
      else{
        url.searchParams.delete("availabilityStatus")
      }

      // Điều hướng lại url
      window.location.href = url.href;
    })
  })
}
// End Button Status

// Form Search
const formSearch = document.querySelector("#form-search");

if(formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();

    //  Lấy giá trị từ ô nhập từ khóa
    const keyword = e.target.elements.keyword.value;

    //  Lấy giá trị từ ô chọn danh mục (Thêm đoạn này)
    const categoryId = e.target.elements.category_id.value;

    // --- Xử lý Keyword ---
    if(keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }

    // --- Xử lý Category (Thêm đoạn này) ---
    if(categoryId) {
      url.searchParams.set("category_id", categoryId);
    } else {
      url.searchParams.delete("category_id");
    }

    // Chuyển hướng trang theo URL mới
    window.location.href = url.href;
  });
}
// End Form Search

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

// Checkbox multi
const CheckboxMulti = document.querySelector("[checkbox-multi]")
if(CheckboxMulti){
  const inputCheckAll = CheckboxMulti.querySelector("input[name='checkall']")
  const inputsId = CheckboxMulti.querySelectorAll("input[name='id']")
  
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
      const countChecked = CheckboxMulti.querySelectorAll("input[name='id']:checked").length// tìm ra những ô input checked
      
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

// Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const CheckboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = CheckboxMulti.querySelectorAll("input[name='id']:checked");

    // delete-all
    const typeChange = e.target.elements.type.value
    if(typeChange == "delete-all"){
      const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này?")

      if(!isConfirm){
        return;
      }
    }

    if(inputsChecked.length > 0){
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputsChecked.forEach(input => {
        const id = input.value;

        // change-position
        if(typeChange == "change-position"){
          const position = input.closest("tr").querySelector("input[name='position']").value
          // hàm closest để trỏ đến thẻ cha
          // tại vì từ ô input ko thể trỏ đến ô input được

          ids.push(`${id}-${position}`);
        }
        else{
          ids.push(id)
        }
      });

      inputIds.value = ids.join(", ")
      // vì ids là một mảng mà input chỉ lưu dc dạng string 
      // nên ta dùng join để biến nó thành một chuỗi.
      formChangeMulti.submit();
    }
    else{
      alert("vui lòng chọn ít nhất một bản ghi")
    }
  });
}
// End Form change multi

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


// Upload image
const uploadImage = document.querySelector("[upload-image]")

if(uploadImage){
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  const iconDeleteImage = document.querySelector("[icon-delete-image]")

  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if(file){
      uploadImagePreview.src = URL.createObjectURL(file); 
      // tạo url cho ảnh khi thêm ảnh từ file để view ảnh lên giao diện
      iconDeleteImage.classList.remove('hide');// nếu có ảnh thì sẽ hiện dấu x lên
    }
    else {
      uploadImagePreview.src = '';
      iconDeleteImage.classList.add('hide'); // nếu ko có thì ẩn đi
    }
    
  })

  // xử lí sự kiện nút x
  iconDeleteImage.addEventListener('click', () => {
    uploadImageInput.value = ""
    uploadImagePreview.src = ""
    iconDeleteImage.classList.add('hide')
  })

}
// End Upload image

// Sort
const sort = document.querySelector("[sort]")
if(sort){
  let url = new URL(window.location.href);

  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");

  sortSelect.addEventListener("change", (e) => {
    const selectValue = e.target.value.split("-")
    const [sortKey, sortValue] = selectValue

    url.searchParams.set("sortKey", sortKey)
    url.searchParams.set("sortValue", sortValue)
    
    window.location.href = url.href;
  });

  // clear sort
  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey")
    url.searchParams.delete("sortValue")

    window.location.href = url.href;
  });

  // Thêm selected cho option
  const sortKey = url.searchParams.get("sortKey")
  const sortValue = url.searchParams.get("sortValue")

  if(sortKey && sortValue){
    const stringSort = `${sortKey}-${sortValue}`
    const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);

    optionSelected.selected = true
    
  }
}

// End Sort

// Active Menu Sider
const siderLinks = document.querySelectorAll(".sider .inner-menu ul li a");

if(siderLinks.length > 0) {
    const pathname = window.location.pathname; // Lấy đường dẫn hiện tại

    siderLinks.forEach(link => {
        const href = link.getAttribute("href");

        if(href) {
            // Logic: Nếu đường dẫn hiện tại trùng khớp HOẶC là trang con
            // Ví dụ: pathname = /admin/products/create
            // href = /admin/products
            // => Active
            
            // Điều kiện active:
            // 1. pathname bằng chính xác href (Trang danh sách)
            // 2. pathname bắt đầu bằng href + "/" (Trang chi tiết/sửa/xóa)
            // Lưu ý: Thêm dấu "/" để tránh nhầm lẫn giữa "products" và "products-category"
            
            if(pathname === href || pathname.startsWith(href + "/")) {
                link.parentElement.classList.add("active");
            }
        }
    });
}
