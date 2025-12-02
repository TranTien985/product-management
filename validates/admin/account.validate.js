const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 1. Validate cho trang TẠO MỚI (Create)
module.exports.createPost = (req, res, next) => {
  const { fullName, email, password } = req.body;

  // Kiểm tra để trống
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

  // Kiểm tra định dạng Email (Quan trọng)
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

  // (Tùy chọn) Kiểm tra độ dài mật khẩu
  if (password.length < 6) {
    req.flash("error", "Mật khẩu phải có ít nhất 6 ký tự!");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  next();
};

// 2. Validate cho trang CHỈNH SỬA (Edit)
module.exports.editPatch = (req, res, next) => {
  const { fullName, email } = req.body;

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

  // Kiểm tra định dạng Email
  if (!emailRegex.test(email)) {
    req.flash("error", "Email không đúng định dạng!");
    res.redirect(req.get("Referer") || "/");
    return;
  }
  
  next();
};