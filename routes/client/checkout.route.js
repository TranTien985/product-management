const express = require('express')
const router = express.Router();

const controller = require("../../controllers/client/checkout.controller")

router.get('/', controller.index);

<<<<<<< HEAD
router.post('/guest', controller.guest);

router.get('/success/:guestId', controller.success);
=======
router.post('/order', controller.order);

router.get('/success/:orderId', controller.success);
>>>>>>> daedc8515f1a6e9d7a566ff5f73d85a1007f39dd

module.exports = router;
