const NewsCategory = require("../../models/news-category.model"); //database
const News = require("../../models/news.model"); //database
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree")
const Account = require("../../models/account.model"); //database

// [GET] /admin/news-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const record = await NewsCategory.find(find);

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

  res.render("admin/pages/news-category/index", {
    pageTitle: "Trang Danh Mục Tin Tức",
    records: newRecord,
  });
};

// [PATCH] /admin/news-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  // console.log(req.params); dùng để tra tên status và id
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  await NewsCategory.updateOne({ _id: id }, { 
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

// [PATCH] /adim/news-category/change-multi
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
      await NewsCategory.updateMany({ _id: { $in: ids } },{
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
      await NewsCategory.updateMany({ _id: { $in: ids } },{
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
      await NewsCategory.updateMany(
        { _id: ids },
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
      // vì các giá trị của position khác nhau nên ta sẽ phải sử dụng forof
      // để có thể duyệt qua từng phần tử trong mảng
      for (const item of ids) {
        let [id, position] = item.split("-"); // sau đó ta sẽ từ mảng tách chuỗi ra
        position = parseInt(position); // vì position là number nên ta phải convert lại kiểu cho dữ liệu

        await News.updateOne(
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

// [DELETE] /admin/news-category/deleteItem/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await ProductCategory.deleteOne({_id: id}) dùng để xóa vĩnh viễn

  await NewsCategory.updateOne(
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

// [GET] /admin/news-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  };

  const record = await NewsCategory.find(find)

  const newRecord = createTreeHelper.tree(record)
  // sau khi xuất được dữ liệu thì sang bên view 
  // cũng phải sử dụng đệ quy để hiển thị hết các danh mục con
  


  res.render("admin/pages/news-category/create", {
    pageTitle: "Tạo danh mục tin tức",
    records: newRecord
  });
};

// [POST] /admin/news-category/createPost
module.exports.createPost = async (req, res) => {
  const permissions = res.locals.role.permissions

  if(permissions.includes("news-category_create")){
    if (req.body.position == "") {
      const count = await NewsCategory.countDocuments();
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const record = new NewsCategory(req.body); // tạo mới một sản phẩm
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/news-category`);
  }else{
    res.send("403")
    return;
  }
};

// [GET] /admin/news-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const data = await NewsCategory.findOne({
      deleted: false,
      _id: req.params.id,
    });

    const record = await NewsCategory.find({
    deleted: false,
    });

    const newRecord = createTreeHelper.tree(record);

    res.render("admin/pages/news-category/edit", {
      pageTitle: "Chỉnh sửa danh mục tin tức",
      data: data,
      records: newRecord,
    });
  } catch (error) {
    req.flash("error", "Không tồn tại danh mục");
    res.redirect(`${systemConfig.prefixAdmin}/news-category`);
  }
};

// [PATCH] /admin/news-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const permissions = res.locals.role.permissions
  
  if(permissions.includes("news-category_edit")){
    const id = req.params.id
    req.params.position = parseInt(req.params.position)

    try {
      const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
      }
      req.body.updateBy = updatedBy

      await NewsCategory.updateOne({_id: id}, {
        ...req.body, // lấy những phần tử cũ trong req.body
        $push: {updatedBy: updatedBy} // cú pháp của mongoose
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
