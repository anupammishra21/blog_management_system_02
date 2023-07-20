const postModel = require("../../models/front/post.model");
const contactModel = require("../../models/front/contact.model");
const userModel = require("../../models/admin/register.model");
const fs = require('fs');

class FrontViewController{
//  user auth section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
    //  const list form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async contactList(req, res){
        try{
            let loginUser = await userModel.findOne({ _id : req.user.id });
            let contactDetails = await contactModel.find({ isDeleted : false }).sort({ createdAt: -1});
            res.render( 'admin/contactlist', {
                title:'Contact View',
                success:req.flash('success'),
                loginUser,contactDetails
            })

        }catch(err){
            throw(err);
        }
    }

    //  update status part >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async updateStatus(req, res){
        try{
            let obj = '';
            const status = await postModel.findOne({ _id : req.params.id });           
            if(status.isStatus == 'Active') {  obj = 'Inactive';  
            } else { obj = 'Active'; }

            let updated_obj = {       
                isStatus: obj,
            } 
            
            let update_data = await postModel.findByIdAndUpdate(req.params.id, updated_obj);
            res.redirect('/admin/postList');               
           
            
        } catch(err){
            throw err;
        }
    } 

    //  BlogPosting List >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async postList(req, res){
        try{
            let loginUser = await userModel.findOne({ _id : req.user.id });
            let allPost = await postModel.aggregate([
                {
                    $lookup:{
                        from:'user_registers',
                        let : {                           
                            userId : '$user_register_id'   
                        },
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $and:[
                                            { $eq : [ '$_id' , '$$userId']}
                                        ]
                                    }
                                }
                            },
                            {
                                $project:{
                                    fullname:1,
                                    email:1                                   
                                }
                            }
                        ],
                        as: 'user_details'
                    }
                },
                {
                    $unwind: '$user_details'
                },
                {
                    $lookup:{
                        from:'categories',
                        let : {                           
                            catId : '$category_id'   
                        },
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $and:[
                                            { $eq : [ '$_id' , '$$catId']}
                                        ]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:1,                                                                    
                                }
                            }
                        ],
                        as: 'cat_details'
                    }
                },
                {
                    $unwind: '$cat_details'
                },
                
        

            
                {
                    $project:{
                        heading:1,
                        post:1,
                        image:1,
                        isStatus:1,
                        'user_details.fullname':1,
                        'user_details.email':1,
                        'cat_details.name':1
                    }
                }
            ]);
            //console.log(allPost);
            res.render( 'admin/postlist', {
                title:'Blog Posts',
                success:req.flash('success'),
                loginUser,allPost
            })

        }catch(err){
            throw(err);
        }
    }
    //  post view section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async postView(req, res){
        try{
            let loginUser = await userModel.findOne({ _id : req.user.id });
            const postDetails = await postModel.findOne({ _id : req.params.id });              
            res.render( 'admin/viewpost', {
                title:'View Blog Post',
                success:req.flash('success'),
                loginUser,postDetails
            })

        }catch(err){
            throw(err);
        }
    }
    // post delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async postDelete(req,res){
        try{
            let data ={
                isDeleted:true
            }

            let deleted_data = await postModel.findByIdAndUpdate(req.params.id,data)
            if (deleted_data) {
                req.flash('success','sucessfully Deleted')
                res.redirect('/admin/postList')
                
            }

        }catch(err){
            throw err
        }
    }



}

module.exports = new FrontViewController();