const express = require('express')
const router = express.Router();

const controller = require("../../controllers/client/checkout.controller")

router.get('/', controller.index);

router.post('/guest', controller.guest);

router.get('/success/:guestId', controller.success);

module.exports = router;
