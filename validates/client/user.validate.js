module.exports.registerPost = (req, res, next) => {
  if(!req.body.fullName){
    req.flash("error", "vui lòng nhập họ tên")
    res.redirect(req.get("Referer") || "/");
    return;
  }

  if(!req.body.email){
    req.flash("error", "vui lòng nhập email")
    res.redirect(req.get("Referer") || "/");
    return;
  }

  if(!req.body.password){
    req.flash("error", "vui lòng nhập mật khẩu")
    res.redirect(req.get("Referer") || "/");
    return;
  }

  next();
}

module.exports.loginPost = (req, res, next) => {
  if(!req.body.email){
    req.flash("error", "vui lòng nhập email")
    res.redirect(req.get("Referer") || "/");
    return;
  }

  if(!req.body.password){
    req.flash("error", "vui lòng nhập mật khẩu")
    res.redirect(req.get("Referer") || "/");
    return;
  }

  next();
}

module.exports.forgotPassword = (req, res, next) => {
  if(!req.body.email){
    req.flash("error", "vui lòng nhập email")
    res.redirect(req.get("Referer") || "/");
    return;
  }

  next();
}

module.exports.resetPasswordPost= (req, res, next) => {
  if(!req.body.password){
    req.flash("error", "vui lòng nhập mật khẩu")
    res.redirect(req.get("Referer") || "/");
    return;
  }

  if(!req.body.confirmPassword){
    req.flash("error", "vui lòng xác nhận mật khẩu")
    res.redirect(req.get("Referer") || "/");
    return;
  }

  if(req.body.password != req.body.confirmPassword){
    req.flash("error", "mật khẩu không khớp!")
    res.redirect(req.get("Referer") || "/");
    return;
  }

  next();
}