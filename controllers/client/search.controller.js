const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");
const filterProductsHelper = require("../../helpers/products");
const paginationHelper = require("../../helpers/pagination"); // phân trang

// [GET] /search
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  //  Khởi tạo bộ lọc cơ bản
  let find = {
    deleted: false,
    availabilityStatus: "In Stock", 
  };

  //  Xử lý KEYWORD: Nếu có từ khóa, thêm điều kiện regex vào object 'find'
  if (keyword) {
    const regex = new RegExp(keyword, "i");
    find.title = regex;
  }

  if (filterProductsHelper && filterProductsHelper.filterProduct) {
     await filterProductsHelper.filterProduct(req.query, find);
  }

  // Đếm số lượng sản phẩm (Dựa trên bộ lọc TỔNG HỢP: Keyword + Sidebar)
  const countProducts = await Product.countDocuments(find);

  // Phân trang
  let objectPagination = paginationHelper(
    { currentPage: 1, limitItems: 18 },
    req.query,
    countProducts
  );

  // Sắp xếp
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  
  // 8. Tính giá mới
  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/search/index", {
    pageTitle: keyword ? `Kết quả tìm kiếm: ${keyword}` : 'Tất cả sản phẩm',
    keyword: keyword,
    products: newProducts,
    pagination: objectPagination,
    queryParams: req.query,
  });
}
