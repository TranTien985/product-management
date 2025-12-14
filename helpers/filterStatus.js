// phút 30 bài 21
module.exports.filterStatus = (query) =>{
  // mảng này dùng để chứa các trạng thái cho từng nút bấm để
  // vẽ giao diện trong trang products
  let filterStatus = [
    {
      name : "Tất cả",
      status : "",
      class : ""
    },
    {
      name : "Hoạt động",
      status : "In Stock",
      class : ""
    },
    {
      name : "Dừng Hoạt động",
      status : "Low Stock",
      class : ""
    },
    {
      name: "Nổi bật",
      status: "featured", 
      class: ""
    }
  ]
  
  // hàm này để thay đổi trạng thái nút khi bấm vào
  if(query.availabilityStatus){
    // hàm findIndex để tìm index của 1 bản ghi thỏa mãn một điều kiện nào đó
    // ta sẽ lọc từng item một và lấy ra cái item.status để so sánh với các status mà người dùng truyền lên
    const index = filterStatus.findIndex(item => item.status == query.availabilityStatus)
    if(index !== -1) {
        filterStatus[index].class = "active";
    }
  }
  else{
    const index = filterStatus.findIndex(item => item.status == "")
    filterStatus[index].class = "active"
  }

  return filterStatus;
}


module.exports.filterUser = (query) =>{
  let filterStatusUser = [
    {
      name : "Tất cả",
      status : "",
      class : ""
    },
    {
      name : "Hoạt động",
      status : "active",
      class : ""
    },
    {
      name : "Dừng Hoạt động",
      status : "inactive",
      class : ""
    },
  ]
  
  // hàm này để thay đổi trạng thái nút khi bấm vào
  if(query.status){
    const index = filterStatusUser.findIndex(item => item.status == query.status)
    if(index !== -1) {
        filterStatusUser[index].class = "active";
    }
  }
  else{
    const index = filterStatusUser.findIndex(item => item.status == "")
    filterStatusUser[index].class = "active"
  }

  return filterStatusUser;
}