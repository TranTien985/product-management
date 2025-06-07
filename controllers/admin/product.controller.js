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

// [PATCH] /adim/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  // console.log(req.params); dùng để tra tên status và id
  const status = req.params.status
  const id = req.params.id

  await Product.updateOne({_id: id}, {availabilityStatus: status});
  // hàm updateOne này dùng để update một sản phầm với các thông số truyền vào
  // tìm hiểu thêm thông tin ở mongoose -> queries

  res.redirect(req.get("Referer") || "/");
  // thay cho res.redirect("back")
  // sau khi thay đổi trạng thái thì nó sẽ link sang trang khác để update trạng thái sản phẩm 
  // nhưng khi dùng câu lệnh trên thì nó sẽ tự động back về trang cũ sau khi update

}

// [PATCH] /adim/product/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  // dùng split(", ") để convert nó thành một mảng 

  // sử dụng updateMany của mongoose
  switch (type) {
    case "In Stock":
      await Product.updateMany({_id: {$in: ids}},{availabilityStatus: "In Stock"} );
      break;
    case "Low Stock":
      await Product.updateMany({_id: {$in: ids}},{availabilityStatus: "Low Stock"} );
      break;
  
    default:
      break;
  }
  res.redirect(req.get("Referer") || "/");
  
}