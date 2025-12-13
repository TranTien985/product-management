const express = require('express')
const router = express.Router();

const controller = require("../../controllers/admin/reviews.controller")


router.get('/', controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.delete("/delete/:id", controller.deleteItem);

router.patch("/change-multi", controller.changeMulti);

module.exports = router;
