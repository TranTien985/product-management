const express = require('express')
const router = express.Router();

const controller = require("../../controllers/client/policy.controller")

router.get('/shippingPolicy', controller.shippingPolicy);

router.get('/returnPolicy', controller.returnPolicy);

router.get('/warrantyPolicy', controller.warrantyPolicy);

module.exports = router;
