const Product = require("../../models/product.model"); //database

const filterStatusHelper = require("../../helpers/filterStatus") // lọc
const SearchHelper = require("../../helpers/search") // tìm kiếm
const paginationHelper = require("../../helpers/pagination") // phân trang

// [GET] /adim/product
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query)

  let find = {} // biến này tượng trưng cho bộ lọc

  // nếu có yêu cầu lọc thì mới sử dụng hàm này không thì thôi
  if(req.query.availabilityStatus){
    find.availabilityStatus = req.query.availabilityStatus
  }

// search
  const objectSearch = SearchHelper(req.query);

  if(objectSearch.regex){
    find.title = objectSearch.regex;
  }
// end search

  // 1h bài 21 
//Pagination
  const countProducts = await Product.countDocuments(find); 
  // dùng để đếm tổng số lượng sản phẩm có trong db

  // đây dùng để truyền đối số sang cho hàm paginationHelper
  // sau khi truyền hàm bên kia sẽ thực hiện logic và trả lại kết quả cho bên này
  // cuối cùng là update object
  let objectPagination = paginationHelper(
    {
      currentPage : 1,
      limitItems : 7
    },
    req.query,
    countProducts
  );
// End pagination

  const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);
  // limit(objectPagination.limitItems) giới hạn một trang có bao nhiêu sản phẩm
  // skip(objectPagination.skip) khi bấm vào trang kế tiếp thì nó sẽ skip qua bao nhiêu sản phẩm
  

  res.render("admin/pages/products/index", {
    pageTitle: 'Trang Danh Sách Sản Phẩm',
    products : products,
    filterStatus : filterStatus,
    keyword : objectSearch.keyword,
    pagination : objectPagination
});
}