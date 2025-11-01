const express = require("express");
const router = express.Router();

// dùng cho việc upload ảnh từ máy lên
const multer = require("multer");
const upload = multer(); // đường dẫn lưu ảnh khi upload ảnh lên dự án (tạm thời)

const controller = require("../../controllers/admin/products-category.controller");
const validate = require("../../validates/admin/product-category.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");


router.get("/", controller.index);

<<<<<<< HEAD
router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.get("/create", controller.create);


=======
router.get("/create", controller.create);

>>>>>>> daedc8515f1a6e9d7a566ff5f73d85a1007f39dd
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

<<<<<<< HEAD
router.delete("/delete/:id", controller.deleteItem);

router.get("/edit/:id", controller.edit);


=======
router.get("/edit/:id", controller.edit);

>>>>>>> daedc8515f1a6e9d7a566ff5f73d85a1007f39dd
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

module.exports = router;
