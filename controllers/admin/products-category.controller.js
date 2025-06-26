const ProductCategory = require("../../models/product-category.model") //database
const systemConfig = require("../../config/system")

// [GET] /adim/product-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  }

  const record = await ProductCategory.find(find);
  
  res.render("admin/pages/products-category/index", {
    pageTitle: 'Trang Danh Sách Sản Phẩm',
    records: record
  });
}

// [GET] /adim/product-category/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products-category/create", {
    pageTitle: 'Tạo danh mục sản phẩm',
  });
}

// [POST] /adim/product/create
module.exports.createPost = async (req,res) => {
  if(req.body.position == ""){
      const count = await ProductCategory.countDocuments();
      req.body.position = count + 1
  }else{
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body); // tạo mới một sản phẩm
  await record.save();
  
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}




