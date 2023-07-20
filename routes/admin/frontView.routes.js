const route = require('express').Router();
const FVController = require('../../controllers/admin/frontView.controller');

route.get('/contactView' , FVController.userAuth, FVController.contactList);
route.get('/updateStatus/:id' , FVController.userAuth, FVController.updateStatus);
route.get('/postList' , FVController.userAuth, FVController.postList);
route.get('/postView/:id' , FVController.userAuth, FVController.postView);
route.get('/postDelete/:id' , FVController.userAuth, FVController.postDelete);

module.exports = route;