const ProductCategory = require("../../models/product-category.model"); //database
const Product = require("../../models/product.model"); //database
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const getSubCategoryHelper = require("../../helpers/product-category");
const Account = require("../../models/account.model"); //database

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const record = await ProductCategory.find(find);

  const newRecord = createTreeHelper.tree(record)

  for (const record of newRecord) {
    const updatedBy = record.updatedBy.slice(-1)[0]; // lấy ra bản ghi ở vị trí cuối cùng

    if(updatedBy){
      const userUpdated = await Account.findOne({
        _id : updatedBy.account_id
      });

      updatedBy.accountFullName = userUpdated.fullName
    }
  }

  res.render("admin/pages/products-category/index", {
    pageTitle: "Trang Danh Sách Sản Phẩm",
    records: newRecord,
  });
};

// [PATCH] /admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  // console.log(req.params); dùng để tra tên status và id
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  await ProductCategory.updateOne({ _id: id }, { 
    availabilityStatus: status,
    $push: {updatedBy: updatedBy} // cú pháp của mongoose
   });
  // hàm updateOne này dùng để update một sản phầm với các thông số truyền vào
  // tìm hiểu thêm thông tin ở mongoose -> queries

  req.flash("success", "Cập nhật trạng thái thành công");
  // sử dụng thư viện express-flash

  res.redirect(req.get("Referer") || "/");
  // thay cho res.redirect("back")
  // sau khi thay đổi trạng thái thì nó sẽ link sang trang khác để update trạng thái sản phẩm
  // nhưng khi dùng câu lệnh trên thì nó sẽ tự động back về trang cũ sau khi update
};

// [PATCH] /adim/product-category/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  // dùng split(", ") để convert nó thành một mảng

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  // sử dụng updateMany của mongoose
  switch (type) {
    case "In Stock":
      await ProductCategory.updateMany({ _id: { $in: ids } },{
        availabilityStatus: "In Stock",
        $push: {updatedBy: updatedBy} 
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} danh mục!`
      );
      break;
    case "Low Stock":
      await ProductCategory.updateMany({ _id: { $in: ids } },{
        availabilityStatus: "Low Stock", 
        $push: {updatedBy: updatedBy} 
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} danh mục!`
      );
      break;
    case "delete-all":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(), 
          }
        }
      );
      req.flash("success", `Đã xóa thành công ${ids.length} danh mục!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await ProductCategory.updateOne(
          { _id: id },
          {
            position: position,
            $push: {updatedBy: updatedBy} 
          }
        );
      }
      req.flash(
        "success",
        `Cập nhật vị trí thành công ${ids.length} danh mục!`
      );
      break;

    default:
      break;
  }
  res.redirect(req.get("Referer") || "/");
};

// [DELETE] /adim/product-category/deleteItem/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // Ràng buộc 1: Kiểm tra xem có danh mục con trực thuộc hay không
  const hasChildCategory = await ProductCategory.findOne({
    parent_id: id,
    deleted: false
  });
  if (hasChildCategory) {
    req.flash("error", "Không thể xóa danh mục này vì còn tồn tại danh mục con trực thuộc!");
    return res.redirect(req.get("Referer") || "/");
  }

  // Ràng buộc 2: Kiểm tra xem có sản phẩm nào thuộc danh mục này hay không
  const hasProduct = await Product.findOne({
    product_category_id: id,
    deleted: false
  });
  if (hasProduct) {
    req.flash("error", "Không thể xóa danh mục này vì còn sản phẩm đang thuộc danh mục!");
    return res.redirect(req.get("Referer") || "/");
  }

  await ProductCategory.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(), 
      }
    }
  );
  req.flash("success", `Xóa thành công danh mục!`);

  res.redirect(req.get("Referer") || "/");
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

// [POST] /admin/product/createPost
module.exports.createPost = async (req, res) => {
  const permissions = res.locals.role.permissions

  if(permissions.includes("products-category_create")){
    if (req.body.position == "") {
      const count = await ProductCategory.countDocuments();
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body); // tạo mới một sản phẩm
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }else{
    res.send("403")
    return;
  }
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
  const permissions = res.locals.role.permissions;
  
  if(permissions.includes("products-category_edit")){
    const id = req.params.id;

    // Ràng buộc chống chọn chính nó làm danh mục cha
    if (req.body.parent_id === id) {
      req.flash("error", "Danh mục cha không thể là chính danh mục này!");
      return res.redirect(req.get("Referer") || "/");
    }

    // Ràng buộc chống chọn danh mục con làm cha (chống lặp đệ quy vô hạn)
    if (req.body.parent_id) {
      const subCategories = await getSubCategoryHelper.getSubCategory(id);
      const subCategoryIds = subCategories.map(item => item.id);
      if (subCategoryIds.includes(req.body.parent_id)) {
        req.flash("error", "Không thể chọn danh mục con của danh mục này làm danh mục cha!");
        return res.redirect(req.get("Referer") || "/");
      }
    }

    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    }

    try {
      const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
      };
      req.body.updateBy = updatedBy;

      await ProductCategory.updateOne({_id: id}, {
        ...req.body,
        $push: {updatedBy: updatedBy}
      });

      req.flash("success", "Cập nhật thành công!");
    } catch (error) {
      console.log(error);
      req.flash("error", "Cập nhật không thành công!");
    }

    res.redirect(req.get("Referer") || "/");
  }else{
    res.send("403")
    return;
  }
};
