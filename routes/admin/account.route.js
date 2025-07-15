const express = require('express')
const router = express.Router();

const multer = require("multer");
const upload = multer();

const controller = require("../../controllers/admin/account.controller")

const validate = require("../../validates/admin/account.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.create);

router.post(
  '/create',
  upload.single("avatar"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost);

router.get('/edit/:id', controller.edit);

router.patch(
  '/edit/:id',
  upload.single("avatar"),
  uploadCloud.upload,
  validate.editPatch,
  controller.editPatch);

module.exports = router;
