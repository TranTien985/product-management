const express = require('express')
const router = express.Router();

const controller = require("../../controllers/admin/product.controller")

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);
// :status dùng để truyền data động vào url
// router này sử dụng phương thức patch 

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.create);
// router này để hiển thị trang thêm sản phẩm

router.post('/create', controller.createPost);
// router này thực hiện phương thức post khi muốn gửi dữ liệu sản phẩm 

module.exports = router;
