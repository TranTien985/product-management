
module.exports.order = (req, res, next) => {
  const { fullName, phone, email, province, district, ward, address } = req.body;
  const errors = []; // Mảng để chứa các lỗi

  // 1. Kiểm tra Họ và Tên
  if (!fullName) {
    errors.push("Họ và tên không được để trống");
  } else if (fullName.length < 2) {
    errors.push("Họ và tên phải có ít nhất 2 ký tự");
  }

  // 2. Kiểm tra Số điện thoại (dùng Regex cơ bản của VN)
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b$/;
  if (!phone) {
    errors.push("Số điện thoại không được để trống");
  } else if (!phoneRegex.test(phone)) {
    errors.push("Số điện thoại không hợp lệ");
  }

  // 3. Kiểm tra Email (dùng Regex cơ bản)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) { // Chỉ kiểm tra nếu người dùng có nhập
    errors.push("Email không hợp lệ");
  }

  // 4. Kiểm tra Tỉnh/Thành phố
  if (!province) {
    errors.push("Vui lòng chọn Tỉnh/Thành phố");
  }

  // 5. Kiểm tra Quận/Huyện
  if (!district) {
    errors.push("Vui lòng chọn Quận/Huyện");
  }

  // 6. Kiểm tra Xã/Phường
  if (!ward) {
    errors.push("Vui lòng chọn Xã/Phường");
  }

  // 7. Kiểm tra Địa chỉ nhà
  if (!address) {
    errors.push("Địa chỉ nhà, tên đường không được để trống");
  } else if (address.length < 5) {
    errors.push("Địa chỉ nhà phải có ít nhất 5 ký tự");
  }

  // 8. Xử lý kết quả
  if (errors.length > 0) {
    req.flash("error", errors);
    res.redirect("/checkout");
    return;
  }

  next();
};