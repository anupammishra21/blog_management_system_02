const route = require('express').Router();
const userController = require('../../controllers/admin/user.controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/admin/uploads')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const imageuploads = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('only jpg, jpeg, png are allowed'))
        }
    },    
})

route.get('/' , userController.adminlogin);
route.post('/login' , userController.login); 

route.get('/register' , userController.showRegister);
route.post('/insert' , imageuploads.single('image') , userController.register);

route.get('/forgetPassword' , userController.adminForgetPassword);
route.post('/updateForgotPassword' , userController.updateForgotPassword);

route.get('/dashboard' , userController.userAuth, userController.showDashboard);

route.get('/profile' , userController.userAuth, userController.showProfile);
route.post('/updateProfile' , imageuploads.single('image') , userController.userAuth, userController.updateProfile);

route.get('/changePassword' , userController.userAuth, userController.showChangePassword);
route.post('/updateChangePassword' , userController.userAuth, userController.updateChangePassword);

route.get('/blank' , userController.userAuth, userController.blank);

route.get('/logout' , userController.userAuth, userController.logout);

module.exports = route;