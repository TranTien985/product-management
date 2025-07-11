const ProductCategory = require("../../models/product-category.model"); //database
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree")

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const record = await ProductCategory.find(find);

  const newRecord = createTreeHelper.tree(record)

  res.render("admin/pages/products-category/index", {
    pageTitle: "Trang Danh Sách Sản Phẩm",
    records: newRecord,
  });
};

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  };

  const record = await ProductCategory.find(find)

  const newRecord = createTreeHelper.tree(record)
  // sau khi xuất được dữ liệu thì sang bên view 
  // cũng phải sử dụng đệ quy để hiển thị hết các danh mục con
  


  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecord
  });
};

// [POST] /admin/product/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body); // tạo mới một sản phẩm
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const data = await ProductCategory.findOne({
      deleted: false,
      _id: req.params.id,
    });

    const record = await ProductCategory.find({
    deleted: false,
    });

    const newRecord = createTreeHelper.tree(record);

    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      data: data,
      records: newRecord,
    });
  } catch (error) {
    req.flash("error", "Không tồn tại sản phẩm");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [PATCH] /admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id

  req.params.position = parseInt(req.params.position)

  try {
    await ProductCategory.updateOne({_id: id}, req.body)
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật không thành công!");
  }

  res.redirect(req.get("Referer") || "/");
};
