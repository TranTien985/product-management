module.exports.loginPost = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Kiểm tra Email để trống
  if (!email) {
    req.flash("error", "Vui lòng nhập email!");
    res.redirect(req.get("Referer") || "/"); 
    return; 
  }

  // Kiểm tra Mật khẩu để trống
  if (!password) {
    req.flash("error", "Vui lòng nhập mật khẩu!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  // Kiểm tra định dạng Email 
  // (Tránh trường hợp nhập "abc" mà cũng gửi lên server check)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    req.flash("error", "Email không đúng định dạng!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  // Nếu tất cả OK thì chuyển sang Controller
  next();
};