const registerModel = require('../../models/admin/register.model');
const roleModel = require('../../models/admin/role.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailer = require('../../helper/mailer');
const os = require('os'); const fs = require('fs'); 

class UserController{
    // >>>>>>>>>>>>>>> auth Section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async userAuth(req, res, next){
        try{
            if(!_.isEmpty(req.user)){                   
                next();
            } else { 
                req.flash('error' , 'UnAuthorized User... Please Login....')              
                res.redirect('/admin');                           
            }

        }catch(err){
            throw(err);
        }
    }

    // <<<<<<<<<<<<<<<<<< admin login Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async adminlogin(req, res){
        try{
            res.render('admin/adminLogin', {
                title: 'adminlogin',
                success:req.flash('success'),
                error:req.flash('error')
                
            })
        } catch(err){
            throw err;
        }
    }

    // <<<<<<<<<<<<<<<<<<<<<<<<<< admin login Details >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async login(req, res){
        try{
            let email_exists = await registerModel.findOne({ email: req.body.email});
            //console.log(email_exists);
            if(_.isEmpty(email_exists)){
                req.flash('error','There is no Account with this email');
                res.redirect('/admin');

            } else {         
            const hash_password = email_exists.password;
            if(bcrypt.compareSync(req.body.password, hash_password)){
                let token = jwt.sign({
                    id: email_exists._id,
                }, 'abcdefg', { expiresIn: '2d'});              
                res.cookie('user_token', token);
                res.redirect('/admin/dashboard');         
            } else {
                req.flash('error','Bad credentials');
                res.redirect('/admin');
            } }
        } catch(err){
            throw err;
        }
    }

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< show Register Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async showRegister(req, res){
        try{ 
            res.render('admin/adminRegister', {
                title: 'adminregister',
                error:req.flash('error')
            })
        } catch(err){
            throw err;
        }
    }

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Register Details >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async register(req, res){
        try{
            let adminRoleID =  await roleModel.findOne({ role_display_name : "Admin"});
            let is_email_exist =  await registerModel.findOne({ email : req.body.email});
            if(!_.isEmpty(is_email_exist)){
                req.flash('error' , 'This email already Exists');
                return res.redirect('/admin/register');
            } 
            
            if(req.body.password !== req.body.confirmPassword){
                req.flash('error' , 'Password is not Matching');
                return res.redirect('/admin/register'); 
            }

            if (!_.isEmpty(req.file)) {
                req.body.image = req.file.filename;
            } else {
                req.flash('error' , 'Image must be Added');
                res.redirect('/admin/register');
            }
            req.body.fullname = `${req.body.fname} ${req.body.lname}`;
            req.body.role_id = adminRoleID._id;
            req.body.password = bcrypt.hashSync(req.body.password , bcrypt.genSaltSync(10));
            
            //console.log(req.body , "body");

            let save_data = await registerModel.create(req.body);
            console.log(save_data , "save");
            if (!_.isEmpty(save_data) && save_data._id) {
                req.flash('success' , 'Registeration Successfull');
                res.redirect('/admin');
            } else {
                req.flash('error' , 'Something went wrong');
                res.redirect('/admin');
            }
        } catch(err){
            throw err;
        }
    }

    //  <<<<<<<<<<<<<<<<<<<<<<< admin forgrt password form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async adminForgetPassword(req, res){
        try{
            res.render('admin/adminForgetPassword', {
                title: 'adminforgetpassword',
                error:req.flash('error')
            })
        } catch(err){
            throw err;
        }
    } 

    // <<<<<<<<<<<<<<<<<<<<<<<<<< update Forget Password >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async updateForgotPassword(req, res){
        try{
            let is_email_exists = await registerModel.findOne({ email: req.body.email });
            if(_.isEmpty(is_email_exists)){
                req.flash('error','There is No Account with this email');
                return res.redirect('/admin/forgotPassword');
            }    
        
            let newPassword = `A-${Math.round(Math.random() * 10000)}`;
            let encrptPassword = bcrypt.hashSync(newPassword , bcrypt.genSaltSync(10));                
            let updated_obj = {       
                password: encrptPassword,
            }
            
            let update_data = await registerModel.findByIdAndUpdate(is_email_exists._id, updated_obj);
            if (!_.isEmpty(update_data)) {
                const dateTimeObject = new Date();
                await mailer.sendMail(process.env.EMAIL, is_email_exists.email, 'Password Changed Successfully!!!', `Hi ${is_email_exists.fullname} Your password changed successfully.<br> UserName: ${is_email_exists.email} <br> New Password : ${newPassword} <br> Date : ${dateTimeObject.toDateString()} <br> Time : ${dateTimeObject.toTimeString()} <br> Operating System : ${os.type()} <br> Platform Name : ${os.platform()} `);
                req.flash('success','Password succesfully updated, Check your Mail');
                res.redirect('/admin')                
            } else {
                req.flash('error','There was some error. Please try again');
                res.redirect('/admin/forgetPassword')  
            }  
        } catch(err){
            throw err;
        }
    } 

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< show  Dashboard >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async showDashboard(req, res){
        try{
            
            let loginUser = await registerModel.findOne({ _id : req.user.id });
            console.log(loginUser,req.user.id);
            res.render('admin/dashboard', {
                title: 'Dashboard',
                error:req.flash('error'),
                success:req.flash('success'),
                loginUser

            })
        } catch(err){
            throw err;
        }
    }

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< show Profile Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async showProfile(req, res){
        try{
            let loginUser = await registerModel.findOne({ _id : req.user.id });
            res.render('admin/profile', {
                title: 'Profile',
                error:req.flash('error'),
                loginUser
            })
        } catch(err){
            throw err;
        }
    }  

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Update Profile >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async updateProfile(req, res){
        try{
            const is_email_exists = await registerModel.findOne({ email: req.body.email });
            req.body.fullname = `${req.body.fname} ${req.body.lname}`;
            const updated_obj = {
                fname: req.body.fname,
                lname: req.body.lname,
                fullname: req.body.fullname
            }

            if (!_.isEmpty(req.file)) { //console.log(req.file);     
                updated_obj.image = req.file.filename;                          
                fs.unlinkSync(`./public/admin/uploads/${is_email_exists.image}`);
            } else {         
            }

            //console.log(updated_obj);            
            let update_data = await registerModel.findByIdAndUpdate(req.body.userid, updated_obj);
            if (!_.isEmpty(update_data)) {
                req.flash('success','Profile details succesfully updated');
                res.redirect('/admin/dashboard')                
            } else {
                req.flash('error','There was some error. Please try again');
                res.redirect('/admin/profile')  
            }
           
        } catch(err){
            throw err;
        }
    } 

    // <<<<<<<<<<<<<<<<<<<<<<<<<<< show change password form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


    async showChangePassword(req, res){
        try{
            let loginUser = await registerModel.findOne({ _id : req.user.id });
            res.render('admin/changePassword', {
                title: 'Change Password',
                error:req.flash('error'),
                loginUser
            })
        } catch(err){
            throw err;
        }
    } 

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< update Changed form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async updateChangePassword(req, res){
        try{
            let loginUser = await registerModel.findOne({ _id : req.user.id }); 
                    
            if(bcrypt.compareSync(req.body.oldPassword, loginUser.password)){
                if(req.body.password != req.body.confirmPassword){
                    req.flash('error','Password not Matching');
                    return res.redirect('/admin/changePassword');
                }
                if(req.body.password == req.body.oldPassword){
                    req.flash('error','New Password cannot be same as Old Password');
                    return res.redirect('/admin/changePassword');
                }                
                req.body.password = bcrypt.hashSync(req.body.password , bcrypt.genSaltSync(10));                
                    let updated_obj = {       
                        password: req.body.password,
                    }
                    //console.log(loginUser.password ,"OLD");
                    //console.log(req.body.password, "NEW");
                let update_data = await registerModel.findByIdAndUpdate(req.user.id, updated_obj);
                if (!_.isEmpty(update_data)) {
                    req.flash('success','Password succesfully updated');
                    res.redirect('/admin/dashboard')                
                } else {
                    req.flash('error','There was some error. Please try again');
                    res.redirect('/admin/changePassword')  
                }
            }
        } catch(err){
            throw err;
        }
    } 
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< show Blank Page >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async blank(req, res){
        try{
            let loginUser = await registerModel.findOne({ _id : req.user.id });
            res.render('admin/blank', {
                title: 'Blank Page',
                loginUser
            })
        } catch(err){
            throw err;
        }
    }

//     <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< log Out >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    async logout(req, res) {
        try {
            res.clearCookie('user_token');
            res.redirect('/admin')
            console.log("hit-logout");
        } catch (err) {
            throw err;
        }
    }
    
}

module.exports = new UserController();