const User = require("../../models/user.model")

// check token khi đăng nhập
module.exports.requireAuth = async (req, res, next) => {
  if(!req.cookies.tokenUser){
    res.redirect(`/user/login`);
  }else{
    const user = await User.findOne({ tokenUser: req.cookies.tokenUser }).select("-password");
    if(!user){
      res.redirect(`/user/login`);
    }else{
      // tất cả file pug đều có thể sử dụng biến này
      res.locals.user = user 
      next();
    }
  }
}