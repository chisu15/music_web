const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/album.controller');


router.get('/', controller.index);
router.get("/:id", controller.detail)
router.post('/', controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.delete);
module.exports = router;