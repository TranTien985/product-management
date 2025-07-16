const Role = require("../../models/roles.model")
const systemConfig = require("../../config/system");

// [GET] /adim/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  }

  const records = await Role.find(find)
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
    req.flash("error", "Không tồn tại sản phẩm");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
}

// [PATCH] /adim/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id

  try {
    await Role.updateOne({_id: id}, req.body)
    req.flash("success", "Cập nhật thành công")
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
  }

  res.redirect(req.get("Referer") || "/");
}

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