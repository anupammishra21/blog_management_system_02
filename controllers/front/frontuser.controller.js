const roleModel = require("../../models/admin/role.model");
const registerModel = require("../../models/front/register.model");
const bcrypt = require('bcryptjs');
const frontJwt = require('jsonwebtoken');
const mailer = require('../../helper/mailer');
const os = require('os'); const fs = require('fs');

class UserController{
    // <<<<<<<<<<<<<<<<<< user auth part >>>>>>>>>>>>>>>>>>>>>>>>>
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
    // <<<<<<<<<<<<<<<<<<<<<< show Login form >>>>>>>>>>>>>>>>>>>>>>>>>>>

    async showLogin(req, res){
        try{            
            res.render('front/login2', {
                title: 'LogIn',
                error:req.flash('error'),
                success:req.flash('success')                      
            })
        } catch(err){
            throw err;
        }
    }
//  <<<<<<<<<<<<<<<<<<<<<<<<< login part >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    async login(req, res){
        try{            
            let email_exists = await registerModel.findOne({ email: req.body.email});
            //console.log(email_exists);
            if(_.isEmpty(email_exists)){
                req.flash('error','There is no Account with this email');
                res.redirect('/login');

            } else {         
            const hash_password = email_exists.password;
            if(bcrypt.compareSync(req.body.password, hash_password)){
                let token = frontJwt.sign({
                    id: email_exists._id,
                }, 'xyz', { expiresIn: '2d'});               
                res.cookie('front_user_token', token);
                res.redirect('/');         
            } else {
                req.flash('error','Bad credentials');
                res.redirect('/login');
            } }
        } catch(err){
            throw err;
        }
    }
    // <<<<<<<<<<<<<<<<<<<< show register Form >>>>>>>>>>>>>>>>>>>>>>>>>>

    async showRegister(req, res){
        try{            
            res.render('front/register2', {
                title: 'Register',
                error:req.flash('error'),
                success:req.flash('success')               
            })
        } catch(err){
            throw err;
        }
    }

    //  register Details >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async register(req, res){
        try{ 
            let adminRoleID =  await roleModel.findOne({ role_display_name : { $ne: "Admin"} });           
            let is_email_exist =  await registerModel.findOne({ email : req.body.email});
            if(!_.isEmpty(is_email_exist)){
                req.flash('error' , 'This email already Exists!');
                return res.redirect('/register');
            } 
            
            if(req.body.password !== req.body.confirmPassword){
                req.flash('error' , 'Password is not Matching!');
                return res.redirect('/register'); 
            }
          
            req.body.fullname = `${req.body.fname} ${req.body.lname}`;
            req.body.role_id = adminRoleID._id;
            req.body.password = bcrypt.hashSync(req.body.password , bcrypt.genSaltSync(10));
            
            //console.log(req.body , "body");

            let save_data = await registerModel.create(req.body);
            //console.log(save_data , "save");
            if (!_.isEmpty(save_data) && save_data._id) {
                req.flash('success' , 'Registeration Successfully.');
                res.redirect('/login');
            } else {
                req.flash('error' , 'Something went wrong!!!');
                res.redirect('/login');
            }
        } catch(err){
            throw err;
        }
    }
    //  show ForgetPassword Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async showForgotPassword(req, res){
        try{            
            res.render('front/forgetPassword', {
                title: 'Forgot Password',
                error:req.flash('error'),
                success:req.flash('success')                
            })
        } catch(err){
            throw err;
        }
    }

    //  forget Password Details >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async forgotPassword(req, res){
        try{            
            let is_email_exists = await registerModel.findOne({ email: req.body.email });
            if(_.isEmpty(is_email_exists)){
                req.flash('error','There is No Account with this email');
                return res.redirect('/forgetPassword');
            }    
        
            let newPassword = `U-${Math.round(Math.random() * 10000)}`;
            let encrptPassword = bcrypt.hashSync(newPassword , bcrypt.genSaltSync(10));                
            let updated_obj = {       
                password: encrptPassword,
            }
            
            let update_data = await registerModel.findByIdAndUpdate(is_email_exists._id, updated_obj);
            if (!_.isEmpty(update_data)) {
                const dateTimeObject = new Date();
                await mailer.sendMail(process.env.EMAIL, is_email_exists.email, 'Password Changed Successfully!!!', `Hi ${is_email_exists.fullname} Your password changed successfully.<br> UserName: ${is_email_exists.email} <br> New Password : ${newPassword} <br> Date : ${dateTimeObject.toDateString()} <br> Time : ${dateTimeObject.toTimeString()} <br> Operating System : ${os.type()} <br> Platform Name : ${os.platform()} `);
                req.flash('success','New Password sent to mail, check your e-mail');
                res.redirect('/forgetPassword')                
            } else {
                req.flash('error','There was some error. Please try again');
                res.redirect('/forgetPassword')  
            }  
        } catch(err){
            throw err;
        }
    }

    //<<<<<<<<<<<<<<<<<<<<<<<< logout section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async logout(req,res){
        try{
            res.clearCookie('front_user_token')
            return res.redirect('/')

        }catch(err){
            throw err

        }

    }
    
}

module.exports = new UserController();