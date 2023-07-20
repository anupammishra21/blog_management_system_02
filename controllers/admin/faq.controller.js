const faqModel = require("../../models/admin/faq.model");
const userModel = require("../../models/admin/register.model");

class FaqController {
//  user Auth section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
    // update status >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async updateStatus(req, res){
        try{
            let obj = '';
            const status = await faqModel.findOne({ _id : req.params.id });           
            if(status.isStatus == 'Active') {  obj = 'Inactive';  
            } else { obj = 'Active'; }

            let updated_obj = {       
                isStatus: obj,
            } 
            
            let update_data = await faqModel.findByIdAndUpdate(req.params.id, updated_obj);
            res.redirect('/admin/faq');               
           
            
        } catch(err){
            throw err;
        }
    } 
    //  faq list >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async faqList(req, res){
        try{ 
            let allfaqs = await faqModel.find({ isDeleted: false }).sort({ createdAt: -1});            
            let loginUser = await userModel.findOne({ _id : req.user.id });
            res.render('admin/faq', {
                title: 'FAQ List',
                success:req.flash('success'),
                error:req.flash('error'),
                loginUser,allfaqs
                
            })
        } catch(err){
            throw err;
        }
    } 
    // faq add form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async showFaqAdd(req, res){
        try{
            let loginUser = await userModel.findOne({ _id : req.user.id });
            res.render('admin/addfaq', {
                title: 'Add FAQ',                
                error:req.flash('error'),
                loginUser
                
            })
        } catch(err){
            throw err;
        }
    } 
    // faq add Details >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async faqAdd(req, res){
        try{
            let is_exists_question = await faqModel.findOne({ question: req.body.question });
            if(!_.isEmpty(is_exists_question)){
                req.flash('error' , 'This Question has already been Answered.');
                return res.redirect(`showfaqadd`);
            }
            if(_.isEmpty(req.body.question)){
                req.flash('error' , 'A Question cannot be Empty.');
                return res.redirect('showfaqadd');
            }       
            if(_.isEmpty(req.body.answer)){
                req.flash('error' , 'A Question needs to have an Answer.');
                return res.redirect('showfaqadd');
            }         
            let save_data = await faqModel.create(req.body);           
            if (!_.isEmpty(save_data) && save_data._id) {
                req.flash('success' , 'FAQ added Successfully.');
                res.redirect('/admin/faq');
            } else {
                req.flash('error' , 'Something went wrong');
                res.redirect('/admin/faq');
            }
        } catch(err){
            throw err;
        }
    }

    // faq view >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async faqView(req, res){
        try {
            let loginUser = await userModel.findOne({ _id : req.user.id });
            let faqDetails = await faqModel.findOne({ _id: req.params.id });
            res.render( 'admin/viewfaq',{
                title:'FAQ View',                
                faqDetails,loginUser
            })
        } catch(err) {
            throw err;
        }
    }
    //  faq edit Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async faqEdit(req, res){
        try {
            let loginUser = await userModel.findOne({ _id : req.user.id });
            let faqDetails = await faqModel.findOne({ _id: req.params.id });
            res.render( 'admin/editfaq',{
                title:'Edit FAQ',
                error:req.flash('error'),
                faqDetails,loginUser
            })
        } catch(err) {
            throw err;
        }
    }

    //  faq update Details >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async faqUpdate(req, res){
        try { 
                  
            if(_.isEmpty(req.body.answer)){
                req.flash('error' , 'A Question needs to have an Answer.');
                return res.redirect(`faqedit/${req.body.id}`);
            }
            if(_.isEmpty(req.body.question)){
                req.flash('error' , 'Question cannot be Empty.');
                return res.redirect(`faqedit/${req.body.id}`);
            }

            let is_exists_question = await faqModel.findOne({ question: req.body.question, _id: { $ne:req.body.id } });
            if(!_.isEmpty(is_exists_question)){
                req.flash('error' , 'This Question has already been Answered.');
                return res.redirect(`faqedit/${req.body.id}`);
            } else { 
                let updated_obj = {       
                    question: req.body.question, answer:req.body.answer
                }
                let update_data = await faqModel.findByIdAndUpdate(req.body.id, updated_obj);
                if (!_.isEmpty(update_data)) {
                    req.flash('success' , 'FAQ updated Successfully.');
                    res.redirect('/admin/faq');
                } else {
                    req.flash('error' , 'Something went wrong');
                    res.redirect('/admin/faq');
                }
            }        
        } catch(err) {
            throw err;
        }
    }

    //  faq Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async faqDelete(req, res){
        try {           
            let updated_obj = {
                isDeleted: true
            }
            let deleted_data = await faqModel.findByIdAndUpdate(req.params.id, updated_obj);
            if (deleted_data) {
                req.flash('success' , 'Successfully Deleted');
                res.redirect('/admin/faq')
            }
        } catch(err) {
            throw err;
        }
    }


}

module.exports = new FaqController();