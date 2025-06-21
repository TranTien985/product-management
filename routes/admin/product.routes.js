const express = require('express');
const router = express.Router();

// dùng cho việc upload ảnh từ máy lên
const multer  = require('multer');
const storageMulter = require("../../helpers/storageMulter")
const upload = multer({ storage: storageMulter() }); // đường dẫn lưu ảnh khi upload ảnh lên dự án (tạm thời)


const controller = require("../../controllers/admin/product.controller")
const validate = require("../../validates/admin/product.validate")

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);
// :status dùng để truyền data động vào url
// router này sử dụng phương thức patch 

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.create);
// router này để hiển thị trang thêm sản phẩm

router.post(
  '/create', 
  upload.single('thumbnail'), 
  validate.createPost,
  controller.createPost);
// router này thực hiện phương thức post khi muốn gửi dữ liệu sản phẩm 

module.exports = router;
