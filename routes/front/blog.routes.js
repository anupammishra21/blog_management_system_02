const route = require('express').Router();
const blogController = require('../../controllers/front/blog.controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/front/blog-img')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const uploads = multer({
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

route.get('/post' , blogController.userAuth, blogController.showPost);
route.post('/postInsert' , uploads.single('image') , blogController.userAuth, blogController.post);
route.get('/myblogs' , blogController.userAuth, blogController.showBlog);
route.get('/viewPost/:id',blogController.userAuth,blogController.viewPost);
// route.get('/editPost/:id',blogController.userAuth,blogController.showEditPost)


module.exports = route;