const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/user.controller');


router.get('/', controller.index);
router.get('/detail/:id', controller.detail);
router.patch('/:id', controller.update);
router.get('/profile', controller.profile);
router.get('/auth/loginGoogle', controller.loginGoogle);
router.get('/auth/callback', controller.callback);
module.exports = router;