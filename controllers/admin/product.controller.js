const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus")

// [GET] /adim/product
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query)

  let find = {} // biến này tượng trưng cho bộ lọc

  // nếu có yêu cầu lọc thì mới sử dụng hàm này không thì thôi
  if(req.query.availabilityStatus){
    find.availabilityStatus = req.query.availabilityStatus
  }

  // tìm kiếm
  let keyword = ""
  if(req.query.keyword){
    keyword = req.query.keyword;

    const regex = new RegExp(keyword, "i"); //tìm hiểu thêm regex js (dùng để search thiếu với ko phân biệt chữ thường, hoa)
    find.title = regex;
  }

  const products = await Product.find(find);

  // console.log(products);
  

  res.render("admin/pages/products/index", {
    pageTitle: 'Trang Danh Sách Sản Phẩm',
    products : products,
    filterStatus : filterStatus,
    keyword : keyword
});
}