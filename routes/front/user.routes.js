const route = require('express').Router();
const frontuserController = require('../../controllers/front/frontuser.controller');
const userController = require('../../controllers/front/frontuser.controller');

route.get('/login' , userController.showLogin);
route.post('/loginInsert' , userController.login);
route.get('/register' , userController.showRegister);
route.post('/insert' , userController.register);
route.get('/forgetPassword' , userController.showForgotPassword);
route.post('/forgotInsert' , userController.forgotPassword);
route.get('/logout',userController.userAuth,frontuserController.logout)

module.exports = route;