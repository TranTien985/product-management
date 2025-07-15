const Account = require("../../models/account.model")
const md5 = require('md5');
const systemConfig = require("../../config/system");

// [GET] /adim/auth/login
module.exports.login = (req, res) => {
  res.render("admin/pages/auth/login", {
    pageTitle: 'Trang đăng nhập'
  });
}

// [POST] /adim/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email 
  const password = req.body.password

  const user = await Account.findOne({
    email: email,
    deleted: false 
  });

  if(!user){
    req.flash("error", "email không tồn tại ")
    res.redirect(req.get("Referer") || "/");
    return;
  }

  if(md5(password) != user.password){
    req.flash("error", "mật khẩu không chính xác ")
    res.redirect(req.get("Referer") || "/");
    return;
  }

  if(user.status == "inactive"){
    req.flash("error", "tài khoản đã bị khóa ")
    res.redirect(req.get("Referer") || "/");
    return;
  }
  
  // khi ta đăng nhập sẽ phải gửi cái token từ db sang cho fe để lưu vào cookie bên phía máy client
  res.cookie("token", user.token);

  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

// [GET] /adim/auth/logout
module.exports.logout = (req, res) => {
  // xóa token trong cookie
  res.clearCookie("token");

  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}
