var express = require('express');
var router  = express.Router();
let withAuth = require('../middleware/middleware');
let path = require('path')
const authController = require('../controllers/authController');
// Roles
router.post('/register',authController.register);
router.post('/login',authController.login);
router.get('/checktoken',withAuth,authController.checkToken);
module.exports = router;
