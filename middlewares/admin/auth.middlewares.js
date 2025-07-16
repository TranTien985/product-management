const systemConfig = require("../../config/system");
const Account = require("../../models/account.model")
const Role = require("../../models/roles.model")

// check token khi đăng nhập
module.exports.requireAuth = async (req, res, next) => {
  if(!req.cookies.token){
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }else{
    const user = await Account.findOne({ token: req.cookies.token }).select("-password");
    if(!user){
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }else{
      const role = await Role.findOne({
        _id: user.role_id
      }).select("title permissions");
      // tất cả file pug đều có thể sử dụng biến này
      res.locals.user = user 
      res.locals.role = role 
      next();
    }
  }
}