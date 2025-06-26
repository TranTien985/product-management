const Product = require("../../models/product.model"); //database

const systemConfig = require("../../config/system")
const filterStatusHelper = require("../../helpers/filterStatus") // lọc
const SearchHelper = require("../../helpers/search") // tìm kiếm
const paginationHelper = require("../../helpers/pagination") // phân trang

// [GET] /adim/product
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query)

  let find = {
    deleted: false,
  } // biến này tượng trưng cho bộ lọc

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
      limitItems : 6
    },
    req.query,
    countProducts
  );
// End pagination

// Sort
let sort = {}

if(req.query.sortKey && req.query.sortValue){
  sort[req.query.sortKey] = req.query.sortValue
}else{
  sort.position = "desc"
}
// End Sort

  const products = await Product.find(find)
  .sort(sort)
  .limit(objectPagination.limitItems)
  .skip(objectPagination.skip);
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

  req.flash('success', 'Cập nhật trạng thái thành công');
  // sử dụng thư viện express-flash

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
      await Product.updateMany({_id: {$in: ids}},{availabilityStatus: "In Stock"});
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
      break;
    case "Low Stock":
      await Product.updateMany({_id: {$in: ids}},{availabilityStatus: "Low Stock"});
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
      break;
    case "delete-all":
      await Product.updateMany({_id: ids}, {
        deleted: true,
        deletedAt: new Date() 
      });
      req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
      break;
    case "change-position":
      // vì các giá trị của position khác nhau nên ta sẽ phải sử dụng forof 
      // để có thể duyệt qua từng phần tử trong mảng
      for (const item of ids) {
        let [id, position] = item.split("-"); // sau đó ta sẽ từ mảng tách chuỗi ra 
        position = parseInt(position); // vì position là number nên ta phải convert lại kiểu cho dữ liệu

        await Product.updateOne({_id: id},{
          position: position
        });
      }
      req.flash("success", `Cập nhật vị trí thành công ${ids.length} sản phẩm!`);
      break;
  
    default:
      break;
  }
  res.redirect(req.get("Referer") || "/");
  
}

// [DELETE] /adim/product/deleteItem/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id

  // await Product.deleteOne({_id: id}) dùng để xóa vĩnh viễn 

  await Product.updateOne({_id: id}, {
    deleted: true,
    deletedAt: new Date()  // hàm để lấy ra thời gian hiên tại
  });
  req.flash("success", `Xóa thành công sản phẩm!`);

  res.redirect(req.get("Referer") || "/");
  
}

// [GET] /adim/product/create
module.exports.create = async (req,res) => {
  res.render("admin/pages/products/create", {
    pageTitle: 'Trang Thêm mới sản phẩm'
  });
}

// [POST] /adim/product/create
module.exports.createPost = async (req,res) => {
  // chuyển dữ liệu từ string -> number
  req.body.price = parseFloat(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  try {
    // nếu người dùng không nhập vị trí thì hệ thống sẽ tự động tăng thêm 1
    if(req.body.position == ""){
      const countProducts = await Product.countDocuments();
      req.body.position = countProducts + 1
    }else{
      req.body.position = parseInt(req.body.position);
    }
    
    const product = new Product(req.body); // tạo mới một sản phẩm
    await product.save(); // lưu dữ liệu sản phẩm mới vào model db

  } catch (error) {
    res.redirect(req.get("Referer") || "/");
  }
  
  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /adim/product/edit/:id
module.exports.edit = async (req,res) => {
  // dùng try catch để tránh trường hợp tự ý ghi id linh tinh gây ra die server
  try {
    const find = {
    deleted: false,
    _id: req.params.id
    };

    const product = await Product.findOne(find);
    
    res.render("admin/pages/products/edit", {
      pageTitle: 'Chỉnh sửa sản phẩm',
      product: product
    });
  } catch (error) {
    req.flash("error", "Không tồn tại sản phẩm")
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}

// [PATCH] /adim/product/edit/:id
module.exports.editPatch = async (req,res) => {
  const id = req.params.id

  req.body.price = parseFloat(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  req.body.position = parseInt(req.body.position);
  
  try {
    await Product.updateOne({_id: id}, req.body)
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }
  
  res.redirect(req.get("Referer") || "/");
}

// [GET] /adim/product/detail/:id
module.exports.detail = async (req,res) => {
  try {
    const find = {
    deleted: false,
    _id: req.params.id
    };

    const product = await Product.findOne(find);
    
    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    req.flash("error", "Không tồn tại sản phẩm")
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}