const News = require("../../models/news.model"); //database
const filterStatusHelper = require("../../helpers/filterStatus"); // lọc

// [GET] /admin/news
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  
  let find = {
    deleted: false,
  }; // biến này tượng trưng cho bộ lọc
  
  res.render("admin/pages/news/index", {
    pageTitle: 'Trang danh sách tin tức',
});
}

// [GET] /admin/news/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/news/create", {
    pageTitle: 'Trang thêm mới tin tức',
});
}

// [GET] /admin/news/createPost
module.exports.createPost= async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  
  let find = {
    deleted: false,
  }; // biến này tượng trưng cho bộ lọc

  res.render("admin/pages/news/create", {
    pageTitle: 'Trang danh sách tin tức',
});
}