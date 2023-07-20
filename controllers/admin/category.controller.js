const catModel = require("../../models/admin/category.model");
const userModel = require("../../models/admin/register.model");

class CatController {
    //  user auth >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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

    //  update Status >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async updateStatus(req, res){
        try{
            let obj = '';
            const status = await catModel.findOne({ _id : req.params.id });           
            if(status.isStatus == 'Active') {  obj = 'Inactive';  
            } else { obj = 'Active'; }

            let updated_obj = {       
                isStatus: obj,
            } 
            
            await catModel.findByIdAndUpdate(req.params.id, updated_obj);
            res.redirect('/admin/category');               
           
            
        } catch(err){
            throw err;
        }
    } 
    //  category list >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async catList(req, res){
        try{ 
            let allcats = await catModel.find({ isDeleted: false }).sort({ createdAt: -1});            
            let loginUser = await userModel.findOne({ _id : req.user.id });
            res.render('admin/cat', {
                title: 'Category List',
                success:req.flash('success'),
                error:req.flash('error'),
                loginUser,allcats
                
            })
        } catch(err){
            throw err;
        }
    } 
    // category add form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async showcatAdd(req, res){
        try{
            let loginUser = await userModel.findOne({ _id : req.user.id });
            res.render('admin/addcat', {
                title: 'Add Category',                
                error:req.flash('error'),
                loginUser
                
            })
        } catch(err){
            throw err;
        }
    } 

    //  category add details >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async catAdd(req, res){
        try{            
            let is_exists_category = await catModel.findOne({ name: req.body.name });    
            if(!_.isEmpty(is_exists_category)){
                req.flash('error' , 'Category Name already Exists');
                return res.redirect('showcatadd');
            }
            if(_.isEmpty(req.body.name)){ console.log("blank");
                req.flash('error' , 'Category Name cannot be empty.');
                return res.redirect('showcatadd');
            }         
            let save_data = await catModel.create(req.body);           
            if (!_.isEmpty(save_data) && save_data._id) {
                req.flash('success' , 'Category added Successfully.');
                res.redirect('/admin/category');
            } else {
                req.flash('error' , 'Something went wrong');
                res.redirect('/admin/category');
            }
        } catch(err){
            throw err;
        }
    }

    //  category views part >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async catView(req, res){
        try {
            let loginUser = await userModel.findOne({ _id : req.user.id });
            let catDetails = await catModel.findOne({ _id: req.params.id });
            res.render( 'admin/viewcat',{
                title:'Category View',                
                catDetails,loginUser
            })
        } catch(err) {
            throw err;
        }
    }

    //  category edit form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async catEdit(req, res){
        try {
            let loginUser = await userModel.findOne({ _id : req.user.id });
            let catDetails = await catModel.findOne({ _id: req.params.id });
            res.render( 'admin/editcat',{
                title:'Edit Category',
                error:req.flash('error'),
                catDetails,loginUser
            })
        } catch(err) {
            throw err;
        }
    }

    // category update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async catUpdate(req, res){
        try {            
            if(_.isEmpty(req.body.name)){ 
                req.flash('error' , 'Category cannot be empty.');
                return res.redirect(`catedit/${req.body.id}`);
            } 
            const is_exists_category = await catModel.findOne({ name: req.body.name , _id:{ $ne : req.body.id }  });
                if(!_.isEmpty(is_exists_category)){ 
                    req.flash('error' , 'Category already exists.');
                    return res.redirect(`catedit/${req.body.id}`);                
                } else {
                    const updated_obj = {       
                        name: req.body.name
                    }
                
                    let update_data = await catModel.findByIdAndUpdate(req.body.id, updated_obj);
                    if (!_.isEmpty(update_data)) {
                        req.flash('success' , 'Category updated Successfully.');
                        res.redirect('/admin/category');
                    } else {
                        req.flash('error' , 'Something went wrong');
                        res.redirect('/admin/category');
                    }        
                }     
            
        } catch(err) {
            throw err;
        }
    }
    //  category Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async catDelete(req, res){
        try {           
            let updated_obj = {
                isDeleted: true
            }
            let deleted_data = await catModel.findByIdAndUpdate(req.params.id, updated_obj);
            if (deleted_data) {
                req.flash('success' , 'Successfully Deleted');
                res.redirect('/admin/category')
            }
        } catch(err) {
            throw err;
        }
    }
}

module.exports = new CatController();

