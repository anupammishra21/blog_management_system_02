const banModel = require("../../models/admin/banner.model");
const userModel = require("../../models/admin/register.model");
const fs = require('fs');

class BanController {
//  auth section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    async userAuth(req, res, next){
        try{
            if(!_.isEmpty(req.user)){                   
                next();
            } else { 
                req.flash('error' , 'UnAuthorized UseR .. Please Login')              
                res.redirect('/admin');                           
            }

        }catch(err){
            throw(err);
        }
    }
    //  update status >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async updateStatus(req, res){
        try{
            let obj = '';
            const status = await banModel.findOne({ _id : req.params.id });           
            if(status.isStatus == 'Active') {  obj = 'Inactive';  
            } else { obj = 'Active'; }

            let updated_obj = {       
                isStatus: obj,
            } 
            
            let update_data = await banModel.findByIdAndUpdate(req.params.id, updated_obj);
            res.redirect('/admin/banner');               
           
            
        } catch(err){
            throw err;
        }
    } 
    //  ban list >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async banList(req, res){
        try{
            let loginUser = await userModel.findOne({ _id : req.user.id }); 
            let allbans = await banModel.find({ isDeleted: false }).sort({ createdAt: -1});               
            res.render('admin/ban', {
                title: 'Banner List',
                success:req.flash('success'),
                error:req.flash('error'),
                loginUser,allbans
                
            })
        } catch(err){
            throw err;
        }
    } 

    // banner form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async showbanAdd(req, res){
        try{
            let loginUser = await userModel.findOne({ _id : req.user.id });
            res.render('admin/addban', {
                title: 'Add Banner',                
                error:req.flash('error'),
                loginUser
                
            })
        } catch(err){
            throw err;
        }
    } 
    //  add banner Details >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async banAdd(req, res){
        try{
            if(_.isEmpty(req.body.heading)){
                req.flash('error' , 'Banner Heading is Empty.');
                return res.redirect('showbanadd');
            } 

            let is_exists_banner = await banModel.findOne({ heading: req.body.heading });    
            if(!_.isEmpty(is_exists_banner)){
                req.flash('error' , 'Banner Heading already Exists');
                return res.redirect('showbanadd');
            }
            
            if (!_.isEmpty(req.file)) {
                req.body.image = req.file.filename;
            } else {
                req.flash('error' , 'Image must be Added');
                res.redirect('showbanadd');
            }
            //console.log(req.body);
            let save_data = await banModel.create(req.body);           
            if (!_.isEmpty(save_data) && save_data._id) {
                req.flash('success' , 'Banner added Successfully.');
                res.redirect('/admin/banner');
            } else {
                req.flash('error' , 'Something went wrong');
                res.redirect('/admin/banner');
            }
        } catch(err){
            throw err;
        }
    }
    //  banner view >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async banView(req, res){
        try {
            let loginUser = await userModel.findOne({ _id : req.user.id });
            let banDetails = await banModel.findOne({ _id: req.params.id });
            res.render( 'admin/viewban',{
                title:'Banner View',                
                banDetails,loginUser
            })
        } catch(err) {
            throw err;
        }
    }

    async banEdit(req, res){
        try {
            let loginUser = await userModel.findOne({ _id : req.user.id });
            let banDetails = await banModel.findOne({ _id: req.params.id });
            res.render( 'admin/editban',{
                title:'Edit Banner',
                error:req.flash('error'),
                banDetails,loginUser
            })
        } catch(err) {
            throw err;
        }
    }
    async banUpdate(req, res){
        try {
            if(_.isEmpty(req.body.heading)){
                req.flash('error' , 'Give a heading for this banner');
                return res.redirect(`banedit/${req.body.id}`);
            }

            let current_image = await banModel.findOne({ _id: req.body.id });
            let is_exists_banner = await banModel.findOne({ heading: req.body.heading, _id: {$ne: req.body.id}});
            if(!_.isEmpty(is_exists_banner)){
                req.flash('error' , 'Banner Heading already exists');
                return res.redirect(`banedit/${req.body.id}`);
            }       
           
            let updated_obj = {       
                heading: req.body.heading,
                description: req.body.description
            }

            if (!_.isEmpty(req.file)) { //console.log(req.file);                                            
                fs.unlinkSync(`./public/admin/banner-img/${current_image.image}`);
                updated_obj.image = req.file.filename; 
            } else {         
            }

            let update_data = await banModel.findByIdAndUpdate(req.body.id, updated_obj);
            if (!_.isEmpty(update_data)) {
                req.flash('success' , 'Banner updated Successfully.');
                res.redirect('/admin/banner');
            } else {
                req.flash('error' , 'Something went wrong');
                res.redirect('/admin/banner');
            }        
        } catch(err) {
            throw err;
        }
    }

    async banDelete(req, res){
        try {
            let current_image = await banModel.findOne({ _id: req.params.id });          
            let updated_obj = {
                isDeleted: true
            }
            fs.unlinkSync(`./public/admin/banner-img/${current_image.image}`);
            let deleted_data = await banModel.findByIdAndUpdate(req.params.id, updated_obj);
            if (deleted_data) {
                req.flash('success' , 'Successfully Deleted');
                res.redirect('/admin/banner')
            }
        } catch(err) {
            throw err;
        }
    }
}

module.exports = new BanController();