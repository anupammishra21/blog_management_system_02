const route = require('express').Router();
const faqController = require('../../controllers/admin/faq.controller');

route.get('/' , faqController.userAuth, faqController.faqList);
route.get('/showfaqadd' , faqController.userAuth, faqController.showFaqAdd); 
route.post('/faqadd' , faqController.userAuth, faqController.faqAdd); 
route.get('/updateStatus/:id' , faqController.userAuth, faqController.updateStatus); 
route.get('/faqview/:id' , faqController.userAuth, faqController.faqView);
route.get('/faqedit/:id' , faqController.userAuth, faqController.faqEdit);
route.post('/faqupdate' , faqController.userAuth, faqController.faqUpdate);
route.get('/faqdelete/:id' , faqController.userAuth, faqController.faqDelete);

module.exports = route;