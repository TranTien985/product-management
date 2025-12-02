
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//  Đăng ký
module.exports.registerPost = (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    req.flash("error", "Vui lòng nhập họ tên!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  if (!email) {
    req.flash("error", "Vui lòng nhập email!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  // Validate định dạng email
  if (!emailRegex.test(email)) {
    req.flash("error", "Email không đúng định dạng!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  if (!password) {
    req.flash("error", "Vui lòng nhập mật khẩu!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  // Validate độ dài mật khẩu (Ví dụ tối thiểu 6 ký tự)
  if (password.length < 6) {
    req.flash("error", "Mật khẩu phải có ít nhất 6 ký tự!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  next();
};

//  Đăng nhập
module.exports.loginPost = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    req.flash("error", "Vui lòng nhập email!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  if (!emailRegex.test(email)) {
    req.flash("error", "Email không đúng định dạng!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  if (!password) {
    req.flash("error", "Vui lòng nhập mật khẩu!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  next();
};

//  Quên mật khẩu
module.exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    req.flash("error", "Vui lòng nhập email!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  if (!emailRegex.test(email)) {
    req.flash("error", "Email không đúng định dạng!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  next();
};

//  Đặt lại mật khẩu (Reset Password)
module.exports.resetPasswordPost = (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (!password) {
    req.flash("error", "Vui lòng nhập mật khẩu mới!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  // Kiểm tra độ dài mật khẩu mới
  if (password.length < 6) {
    req.flash("error", "Mật khẩu phải có ít nhất 6 ký tự!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  if (!confirmPassword) {
    req.flash("error", "Vui lòng xác nhận mật khẩu!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  // So sánh 2 mật khẩu
  if (password !== confirmPassword) {
    req.flash("error", "Mật khẩu xác nhận không khớp!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  next();
};