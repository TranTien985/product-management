const express = require('express')
const router = express.Router();

const controller = require("../../controllers/admin/product.controller")

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);
// :status dùng để truyền data động vào url
// router này sử dụng phương thức patch 

module.exports = router;
