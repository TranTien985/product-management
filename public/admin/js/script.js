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
const formSearch = document.querySelector("#form-search")

if(formSearch){
  let url = new URL(window.location.href)
  formSearch.addEventListener("submit", (e) =>{
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


