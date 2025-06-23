const express = require("express");
const router = express.Router();

// dùng cho việc upload ảnh từ máy lên
const multer = require("multer");
const upload = multer(); // đường dẫn lưu ảnh khi upload ảnh lên dự án (tạm thời)

const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);
// :status dùng để truyền data động vào url
// router này sử dụng phương thức patch

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);
// router này để hiển thị trang thêm sản phẩm

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);
// router này thực hiện phương thức post khi muốn gửi dữ liệu sản phẩm

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);

module.exports = router;
