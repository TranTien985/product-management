# 🛒 Product Management (E-Commerce Platform)

Hệ thống website quản lý sản phẩm và bán hàng thương mại điện tử trực tuyến, xây dựng theo mô hình kiến trúc **MVC (Model - View - Controller)** với **Node.js**, **ExpressJS** và cơ sở dữ liệu **MongoDB**.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

* **Backend**: Node.js (v18+), ExpressJS 5
* **Database**: MongoDB & Mongoose ORM
* **Template Engine**: Pug (Jade)
* **Cloud & Media**: Cloudinary, Multer, Streamifier
* **Xác thực & Bảo mật**: Cookie, Express-Session, Express-Flash, MD5 hashing
* **Email Service**: Nodemailer (Gửi OTP đặt lại mật khẩu)
* **Trình soạn thảo**: TinyMCE

---

## 📁 Cấu Trúc Dự Án (Project Structure)

```text
product-management/
├── config/             # Cấu hình Database, biến hệ thống (prefixAdmin)
├── controllers/        # Xử lý logic nghiệp vụ
│   ├── admin/          # Quản trị viên (Product, Category, Order, Role, Account...)
│   └── client/         # Khách hàng (Home, Product, Cart, Checkout, User...)
├── helpers/            # Tiện ích bổ trợ (Pagination, Search, Tree, SendMail, Stock...)
├── middlewares/        # Middleware phân quyền, xác thực token, giỏ hàng, upload ảnh
├── models/             # Schema Mongoose (Product, Order, Cart, User, Account, Role...)
├── public/             # Tài nguyên tĩnh (CSS, JS, Images, Icons)
├── routes/             # Định tuyến API & Page (Admin & Client)
├── validates/          # Kiểm tra dữ liệu đầu vào (Input Validation)
├── views/              # Giao diện Pug (Admin & Client)
├── index.js            # Điểm khởi chạy ứng dụng (Entry point)
└── package.json        # Danh sách thư viện và scripts
```

---

## 🌟 Tính Năng Trọng Tâm (Core Features)

### 1. Phía Khách Hàng (Client Portal)
* **Trang chủ & Danh mục**:
  * Hiển thị sản phẩm nổi bật, sản phẩm mới nhất, bán chạy và theo danh mục.
  * Bộ lọc đa năng (theo danh mục con đệ quy, khoảng giá, rating sao, sắp xếp linh hoạt).
* **Chi tiết sản phẩm & Đánh giá**:
  * Hiển thị đầy đủ thông số, ảnh, trạng thái tồn kho thực tế.
  * Hệ thống review, chấm điểm sao, upload ảnh và thống kê tỷ lệ phần trăm rating.
* **Giỏ hàng & Thanh toán (Cart & Checkout)**:
  * Quản lý giỏ hàng qua cookie/tài khoản.
  * Kiểm tra tồn kho realtime khi thêm/cập nhật số lượng.
  * Đặt hàng tự động tính phí ship (miễn phí đơn từ 500k), sinh mã đơn ngẫu nhiên và trừ kho tự động.
* **Tài khoản người dùng (User Authentication)**:
  * Đăng ký, đăng nhập (hỗ trợ ghi nhớ đăng nhập).
  * Quên mật khẩu qua mã OTP xác minh gửi về Email (thời hạn 3 phút, chống Replay Attack).
  * Xem lịch sử đơn hàng và theo dõi tiến trình giao hàng qua mã vận đơn.

### 2. Phía Quản Trị (Admin Dashboard)
* **Quản lý Sản phẩm**: CRUD sản phẩm, chuyển đổi trạng thái đơn lẻ/hàng loạt, sắp xếp vị trí, phân trang, lọc nâng cao, xóa mềm.
* **Quản lý Danh mục (Cây đa cấp)**: Xây dựng cây danh mục cha - con vô hạn cấp, chống tạo vòng lặp đệ quy cha-con.
* **Quản lý Đơn hàng & Kho hàng**:
  * Xem chi tiết hóa đơn, thông tin người nhận, danh sách sản phẩm mua.
  * Cập nhật trạng thái đơn hàng (`Pending` ➔ `Confirmed` ➔ `Shipping` ➔ `Delivered` ➔ `Cancelled`).
  * Tự động hoàn trả hàng tồn kho khi đơn bị hủy (`Cancelled`).
* **Phân quyền & Nhóm quyền (RBAC Matrix)**:
  * Bảng ma trận phân quyền chi tiết (Xem, Thêm, Sửa, Xóa) cho từng module.
  * Quản lý tài khoản Admin, phân quyền động theo Role.
* **Quản lý Khác**: Quản lý tin tức, duyệt/xóa đánh giá khách hàng, thông tin cấu hình website chung.

---

## 🔒 Các Ràng Buộc Hệ Thống Đã Chuẩn Hóa

1. **Ràng buộc Tồn kho (Inventory Consistency)**: Chặn thêm hoặc đặt hàng vượt quá số lượng trong kho; tự động trừ `stock` và tăng `quantity_sold` khi chốt đơn; tự động hoàn kho khi hủy đơn.
2. **Ràng buộc Dữ liệu Schema**: Mọi trường số quan trọng (`price`, `stock`, `quantity`) đều có điều kiện không âm (`min: 0`); tỷ lệ giảm giá ràng buộc `0 - 100%`.
3. **Chống Vòng Lặp Vô Hạn Cây Danh Mục**: Ngăn chặn tuyệt đối việc chọn chính danh mục đó hoặc danh mục con của nó làm danh mục cha.
4. **Ràng buộc Toàn vẹn Dữ liệu (Cascading Check)**: Không cho phép xóa danh mục khi còn sản phẩm/danh mục con trực thuộc; không cho phép xóa nhóm quyền khi đang có tài khoản sử dụng.
5. **Bảo mật & Phòng chống Crash**:
   * Escape toàn bộ ký tự đặc biệt trong từ khóa tìm kiếm để chống lỗi Regex Injection.
   * Xóa mã OTP ngay sau khi đổi mật khẩu để chống dùng lại.
   * Chặn tài khoản admin tự xóa hoặc tự khóa chính mình; bảo vệ tài khoản admin cuối cùng.

---

## ⚙️ Cài Đặt & Khởi Chạy (Getting Started)

### 1. Yêu cầu môi trường
* Node.js v18 trở lên
* CSDL MongoDB (MongoDB Atlas hoặc Local MongoDB)

### 2. Cài đặt thư viện
```bash
cd product-management
npm install
```

### 3. Cấu hình biến môi trường (`.env`)
Tạo file `.env` tại thư mục gốc `product-management/` với nội dung mẫu:

```env
PORT=3000
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/product-management
CLOUD_NAME=your_cloudinary_name
CLOUD_KEY=your_cloudinary_key
CLOUD_SECRET=your_cloudinary_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
```

### 4. Khởi chạy dự án
```bash
# Chạy môi trường phát triển với Nodemon
npm start
```
Ứng dụng sẽ khả dụng tại:
* **Client**: `http://localhost:3000`
* **Admin**: `http://localhost:3000/admin/auth/login`
