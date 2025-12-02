// Button Status (Bộ lọc)
const orderButtonStatus = document.querySelectorAll("[order-button-status]") 
// các thuộc tính tự định nghĩa thì phải thêm ngoặc vuông vào 

if(orderButtonStatus.length > 0 ){
  let url = new URL(window.location.href); // lấy url của trang

  orderButtonStatus.forEach(button =>{
    button.addEventListener("click", () => {
      const status = button.getAttribute("order-button-status")
      if(status){
        // đặt lại trạng thái cho url
        url.searchParams.set("orderStatus", status)
      }
      else{
        url.searchParams.delete("orderStatus")
      }

      // Điều hướng lại url
      window.location.href = url.href;
    })
  })
}
// End Button Status

// Form Search Order
const formSearchOrder = document.querySelector("#form-search-order")

if(formSearchOrder){
  let url = new URL(window.location.href)
  formSearchOrder.addEventListener("submit", (e) =>{
    e.preventDefault(); // để không bị load trang
    const keyword = e.target.elements.keyword.value

    if(keyword){
      url.searchParams.set("keyword", keyword)
    }
    else{
      url.searchParams.delete("keyword")
    }
    
    window.location.href = url.href;
  })
}
// End Form Search

// Checkbox multi
const orderCheckboxMulti = document.querySelector("[order-checkbox-multi]")
if(orderCheckboxMulti){
  const inputCheckAll = orderCheckboxMulti.querySelector("input[name='checkall']")
  const inputsId = orderCheckboxMulti.querySelectorAll("input[name='id']")
  
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
      const countChecked = orderCheckboxMulti.querySelectorAll("input[name='id']:checked").length// tìm ra những ô input checked
      
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
const orderFormChangeMulti = document.querySelector("[order-form-change-multi]");

if(orderFormChangeMulti) {
  orderFormChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault(); // Luôn chặn submit mặc định trước

    console.log("Đã click nút Cập nhật!"); // Dòng này để debug xem nút có hoạt động không

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

      // Chuyển mảng ids thành chuỗi: "id1, id2, id3"
      inputIds.value = ids.join(", ");
      
      console.log("Các ID sẽ gửi đi:", inputIds.value); // Kiểm tra xem đã lấy được ID chưa

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