module.exports.filterRating = (query) => {
  // Array chứa các trạng thái trong Model Rating
  let filterRating = [
    {
      name: "Tất cả",
      rating: "",
      class: ""
    },
    {
      name: "5 sao",
      rating: 5,
      class: ""
    },
    {
      name: "4 sao",
      rating: 4,
      class: ""
    },
    {
      name: "3 sao",
      rating: 3,
      class: ""
    },
    {
      name: "2 sao",
      rating: 2,
      class: ""
    },
    {
      name: "1 sao",
      rating: 1,
      class: ""
    },
    {
      name: "Có ảnh",
      rating: "images",
      class: ""
    },
  ];

  // Logic gán class active cho nút bấm dựa trên query.orderStatus
  if (query.rating) {
    const index = filterRating.findIndex(item => item.rating == query.rating);
    if (index !== -1) {
      filterRating[index].class = "active";
    }
  } else {
    // Mặc định active nút "Tất cả"
    const index = filterRating.findIndex(item => item.rating == "");
    filterRating[index].class = "active";
  }

  return filterRating;
}


module.exports.filterStatus = (query) => {
  // Array chứa các trạng thái trong Model Rating
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: ""
    },
    {
      name: "Đã duyệt",
      status: "active",
      class: ""
    },
    {
      name: "Chưa duyệt",
      status: "inactive",
      class: ""
    },
    {
      name: "Có ảnh",
      status: "images",
      class: ""
    },
  ];

  // Logic gán class active cho nút bấm dựa trên query.orderStatus
  if (query.status) {
    const index = filterStatus.findIndex(item => item.status == query.status);
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