const systemConfig = require("../../config/system");
const Account = require("../../models/account.model")
const Role = require("../../models/roles.model")

// check token khi đăng nhập
module.exports.requireAuth = async (req, res, next) => {
  if(!req.cookies.token){
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }else{
    const user = await Account.findOne({
      token: req.cookies.token,
      deleted: false,
      status: "active"
    }).select("-password");
    if(!user){
      res.clearCookie("token");
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }else{
      let role = null;
      if (user.role_id) {
        role = await Role.findOne({
          _id: user.role_id,
          deleted: false
        }).select("title permissions");
      }
      // tất cả file pug đều có thể sử dụng biến này
      res.locals.user = user;
      res.locals.role = role || { title: "", permissions: [] };
      next();
    }
  }
}