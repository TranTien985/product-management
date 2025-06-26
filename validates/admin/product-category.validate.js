module.exports.createPost = (req, res, next) => {
  // nếu không nhập tiêu đề thì sẽ hiện thông báo lỗi
  if(!req.body.title){
    req.flash("error", "vui lòng nhập tiêu đề")
    res.redirect(req.get("Referer") || "/");
    return;
  }

  next(); // nếu thỏa mãn thì sẽ sang bước kế tiếp
}