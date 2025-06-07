// file này dùng để xử lí logic của sản phẩm

//Change Status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]")


if(buttonChangeStatus.length > 0){
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path")
  
  buttonChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id= button.getAttribute("data-id");

      let statusChange = statusCurrent == "In Stock" ? "Low Stock" : "In Stock";
      // nếu trạng thái của button là In Lock thì sẽ thay đổi thành Low Stock
      // còn nếu ko thì ngược lại
      

      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      // sử dụng thư viện ghi đè phương thức PATCH
      formChangeStatus.action = action;

      formChangeStatus.submit();
    })
  })
}
//End Change Status

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

        console.log(action);
        

        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    })
  })
}
//End Delete item