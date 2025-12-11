const express = require('express')
const router = express.Router();

const controller = require("../../controllers/client/products.controller")
const multer = require("multer");
const upload = multer(); // đường dẫn lưu ảnh khi upload ảnh lên dự án (tạm thời)

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");

router.get('/', controller.index);

router.get('/:slugCategory', controller.category);

router.get('/detail/:slugProduct', controller.detail);

router.post(
  "/review/:productId", 
  upload.single("images"),
  uploadCloud.upload, // Middleware xử lý ảnh
  controller.review
);

module.exports = router;
