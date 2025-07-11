const Role = require("../../models/roles.modal")
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
      pageTitle: 'Trang nhóm quyền',
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
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật không thành công!");
  }

  res.redirect(req.get("Referer") || "/");
}
