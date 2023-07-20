const route = require('express').Router();
const catController = require('../../controllers/admin/category.controller');

route.get('/' , catController.userAuth, catController.catList);
route.get('/showcatadd' , catController.userAuth, catController.showcatAdd); 
route.post('/catadd' , catController.userAuth, catController.catAdd); 
route.get('/updateStatus/:id' , catController.userAuth, catController.updateStatus); 
route.get('/catview/:id' , catController.userAuth, catController.catView);
route.get('/catedit/:id' , catController.userAuth, catController.catEdit);
route.post('/catupdate' , catController.userAuth, catController.catUpdate);
route.get('/catdelete/:id' , catController.userAuth, catController.catDelete);

module.exports = route;