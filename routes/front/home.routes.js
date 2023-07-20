const route = require('express').Router();
const homePageController = require('../../controllers/front/home.controller');

route.get('/' , homePageController.home);
route.get('/contact' , homePageController.showContact);
route.post('/contactInsert' , homePageController.contact);

module.exports = route;