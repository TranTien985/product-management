const Role = require("../../models/roles.model")
const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");

// [GET] /adim/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  }

  const records = await Role.find(find)

  for (const record of records) {
    const updatedBy = record.updatedBy.slice(-1)[0];

    if(updatedBy){
      const userUpdated = await Account.findOne({
        _id : updatedBy.account_id
      });

      updatedBy.accountFullName = userUpdated.fullName
    }
  }
  res.render("admin/pages/roles/index", {
    pageTitle: 'Trang nhóm quyền',
    records: records
});
}

// [GET] /adim/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: 'Trang nhóm quyền',
});
}

// [Post] /adim/roles/createPost
module.exports.createPost = async (req, res) => {
  if (!req.body.title || !req.body.title.trim()) {
    req.flash("error", "Vui lòng nhập tên nhóm quyền!");
    return res.redirect(req.get("Referer") || "/");
  }

  const record = new Role(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /adim/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    let find = {
    deleted: false,
    _id: req.params.id
    }

    const records = await Role.findOne(find)

    res.render("admin/pages/roles/edit", {
      pageTitle: 'Chỉnh sửa nhóm quyền',
      records: records
    });
  } catch (error) {
    req.flash("error", "Không tồn tại nhóm quyền");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
}

// [PATCH] /adim/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  if (!req.body.title || !req.body.title.trim()) {
    req.flash("error", "Tên nhóm quyền không được để trống!");
    return res.redirect(req.get("Referer") || "/");
  }

  const updatedBy = {
    account_id : res.locals.user.id,
    updatedAt : new Date()
  }
  
  req.body.updateBy = updatedBy

  try {
    await Role.updateOne({_id: id}, {
      ...req.body,
      $push : {updatedBy: updatedBy} 
    })
    req.flash("success", "Cập nhật thành công")
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
  }

  res.redirect(req.get("Referer") || "/");
}

// [DELETE] /adim/roles/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // Ràng buộc kiểm tra xem có tài khoản admin nào đang giữ role này không
  const countAccountsWithRole = await Account.countDocuments({
    role_id: id,
    deleted: false
  });

  if (countAccountsWithRole > 0) {
    req.flash("error", `Không thể xóa nhóm quyền vì đang có ${countAccountsWithRole} tài khoản sử dụng!`);
    return res.redirect(req.get("Referer") || "/");
  }

  await Role.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date()
    }
  );

  req.flash("success", "Xóa nhóm quyền thành công!");
  res.redirect(req.get("Referer") || "/");
};

// [GET] /adim/roles/permission
module.exports.permission = async (req, res) => {
  let find = {
    deleted: false
  }

  const record = await Role.find(find)

  res.render("admin/pages/roles/permission", {
    pageTitle: 'Phân quyền',
    record: record
});
}

// [PATCH] /adim/roles/permission
module.exports.permissionPatch = async (req, res) => {
  try {
    const permission = JSON.parse(req.body.permission) 
    // dữ liệu bên fe truyền sang đang là json nên phải chuyển thành một mảng để xử lí để lưu vào database

    for(const item of permission){
      await Role.updateOne({_id: item.id}, {permissions: item.permission});
    }

    req.flash("success", "Cập nhật thành công")
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
  }
  res.redirect(req.get("Referer") || "/");
}