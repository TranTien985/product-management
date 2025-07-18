const Account = require("../../models/account.model")
const systemConfig = require("../../config/system");

const md5 = require('md5');

// [GET] /adim/my-account
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: 'Trang hiển thị thông tin tài khoản'
});
}

// [GET] /adim/my-account/edit
module.exports.edit = (req, res) => {
  res.render("admin/pages/my-account/edit", {
    pageTitle: 'Trang chỉnh sửa thông tin tài khoản'
});
}

// [PATCH] /adim/my-account/editPatch
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id

  const emailExist = await Account.findOne({
    _id: { $ne: id }, // tìm những bản ghi khác id này
    email: req.body.email,
    deleted: false
  })

  if(emailExist){
    req.flash("error", `Email ${req.body.email} đã tồn tại`)
  }else{
    // nếu có mật khẩu thay đổi thì ta lấy mk mới và mã hóa nó
    //  còn ko thì xóa mk nhập vào
    if(req.body.password){
      req.body.password = md5(req.body.password);
    }else{
      delete req.body.password;
    }

    await Account.updateOne({_id:id}, req.body)
    req.flash("success", "Cập nhật tài khoản thành công")
  }

  res.redirect(req.get("Referer") || "/");
}
