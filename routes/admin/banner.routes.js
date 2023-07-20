const route = require('express').Router();
const banController = require('../../controllers/admin/banner.controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/admin/banner-img')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const Buploads = multer({
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

route.get('/' , banController.userAuth, banController.banList);
route.get('/showbanadd' , banController.userAuth, banController.showbanAdd); 
route.post('/banadd' , Buploads.single('image') , banController.userAuth, banController.banAdd); 
route.get('/updateStatus/:id' , banController.userAuth, banController.updateStatus); 
route.get('/banview/:id' , Buploads.single('image') , banController.userAuth, banController.banView);
route.get('/banedit/:id' , banController.userAuth, banController.banEdit);
route.post('/banupdate' , Buploads.single('image') , banController.userAuth, banController.banUpdate);
route.get('/bandelete/:id' , banController.userAuth, banController.banDelete);

module.exports = route;