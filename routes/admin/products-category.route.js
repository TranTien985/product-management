const express = require("express");
const router = express.Router();

// dùng cho việc upload ảnh từ máy lên
const multer = require("multer");
const upload = multer(); // đường dẫn lưu ảnh khi upload ảnh lên dự án (tạm thời)

const controller = require("../../controllers/admin/products-category.controller");
const validate = require("../../validates/admin/product-category.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");


router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

module.exports = router;
