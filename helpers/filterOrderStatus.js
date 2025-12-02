// helpers/filterOrderStatus.js
module.exports = (query) => {
  // Array chứa các trạng thái trong Model Order
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: ""
    },
    {
      name: "Chờ xác nhận",
      status: "Pending",
      class: ""
    },
    {
      name: "Đã xác nhận",
      status: "Confirmed",
      class: ""
    },
    {
      name: "Đang giao",
      status: "Shipping",
      class: ""
    },
    {
      name: "Đã giao",
      status: "Delivered",
      class: ""
    },
    {
      name: "Đã hủy",
      status: "Cancelled",
      class: ""
    },
  ];

  // Logic gán class active cho nút bấm dựa trên query.orderStatus
  if (query.orderStatus) {
    const index = filterStatus.findIndex(item => item.status == query.orderStatus);
    if (index !== -1) {
      filterStatus[index].class = "active";
    }
  } else {
    // Mặc định active nút "Tất cả"
    const index = filterStatus.findIndex(item => item.status == "");
    filterStatus[index].class = "active";
  }

  return filterStatus;
}