const catModel = require("../../models/admin/category.model");
const banModel = require("../../models/admin/banner.model");
const registerModel = require('../../models/front/register.model');
const contactModel = require('../../models/front/contact.model');
const mailer = require('../../helper/mailer');
const os = require('os'); const fs = require('fs');

class HomeController{

    async userAuth(req, res, next){
        try{
            if(!_.isEmpty(req.user)){                   
                next();
            } else { 
                req.flash('error' , 'UnAuthorized UseR .. Please Login')              
                res.redirect('/login');                           
            }

        }catch(err){
            throw(err);
        }
    }

    async home(req, res){ 
        try{ 
            let loginUser = '';
            if(!_.isEmpty(req.user)) {
                loginUser = await registerModel.findOne({ _id : req.user.id });
            } //console.log( req.user);
            const catDetails = await catModel.find({ isDeleted: false, isStatus: 'Active' }).sort({ createdAt: -1});
            const banDetails = await banModel.find({ isDeleted: false, isStatus: 'Active' });
            res.render('front/home', {
                title: 'Home',
                catDetails,banDetails,loginUser
            })
        } catch(err){
            throw err;
        }
    }
    
    async showContact(req, res){
        try{
            let loginUser ='';
            if(!_.isEmpty(req.user)) {
                loginUser = await registerModel.findOne({ _id : req.user.id });
            }
            const catDetails = await catModel.find({ isDeleted: false, isStatus: 'Active' }).sort({ createdAt: -1});
            res.render('front/contact', {
                title: 'Contact Us',
                error:req.flash('error'),
                success:req.flash('success'),  
                catDetails,loginUser
            })
        } catch(err){
            throw err;
        }
    }
    
    async contact(req, res){
        try{
            let save_data = await contactModel.create(req.body);            
            if (!_.isEmpty(save_data) && save_data._id) {
                const dateTimeObject = new Date();
                await mailer.sendMail(process.env.EMAIL, req.body.email, 'Thank You for Contacting us !!!', `Hi ${req.body.name} We are reviewing Your Meassage and will be contacting you reagarding your Query.<br> Date : ${dateTimeObject.toDateString()} <br> Time : ${dateTimeObject.toTimeString()} <br> `);
                req.flash('success' , 'Send Successfully. Check your mail.');
                res.redirect('/contact');
            } else {
                req.flash('error' , 'Something went wrong!!!');
                res.redirect('/contact');
            }
        } catch(err){
            throw err;
        }
    }  

}

module.exports = new HomeController();