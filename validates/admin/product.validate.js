module.exports.createPost = (req, res, next) => {
  // 1. Kiểm tra tiêu đề bắt buộc
  if (!req.body.title || !req.body.title.trim()) {
    req.flash("error", "Vui lòng nhập tiêu đề sản phẩm!");
    return res.redirect(req.get("Referer") || "/");
  }

  // 2. Kiểm tra giá tiền không âm
  if (req.body.price !== undefined && req.body.price !== "") {
    const price = parseFloat(req.body.price);
    if (isNaN(price) || price < 0) {
      req.flash("error", "Giá sản phẩm phải là số lớn hơn hoặc bằng 0!");
      return res.redirect(req.get("Referer") || "/");
    }
  }

  // 3. Kiểm tra phần trăm giảm giá hợp lệ (0-100)
  if (req.body.discountPercentage !== undefined && req.body.discountPercentage !== "") {
    const discount = parseFloat(req.body.discountPercentage);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      req.flash("error", "Tỷ lệ giảm giá phải từ 0% đến 100%!");
      return res.redirect(req.get("Referer") || "/");
    }
  }

  // 4. Kiểm tra số lượng tồn kho không âm
  if (req.body.stock !== undefined && req.body.stock !== "") {
    const stock = parseInt(req.body.stock);
    if (isNaN(stock) || stock < 0) {
      req.flash("error", "Số lượng tồn kho phải là số nguyên lớn hơn hoặc bằng 0!");
      return res.redirect(req.get("Referer") || "/");
    }
  }

  next();
};