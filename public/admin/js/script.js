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