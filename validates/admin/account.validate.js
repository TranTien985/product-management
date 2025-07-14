module.exports.createPost = (req, res, next) => {
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

module.exports.editPatch = (req, res, next) => {
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

  next();
}