const catModel = require("../../models/admin/category.model");
const banModel = require("../../models/admin/banner.model");
const registerModel = require('../../models/front/register.model');
const postModel = require('../../models/front/post.model');
const mailer = require('../../helper/mailer');
const os = require('os'); const fs = require('fs');
const mongoose = require('mongoose');

class BlogController{
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<< auth part >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< post Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async showPost(req, res, next){
        try{
            
            let loginUser = await registerModel.findOne({ _id : req.user.id });           
            const catDetails = await catModel.find({ isDeleted: false, isStatus: 'Active' }).sort({ createdAt: -1});
            const banDetails = await banModel.find({ isDeleted: false, isStatus: 'Active' });
            res.render('front/post', {
                title: 'Blog Post',
                error:req.flash('error'),
                success:req.flash('success'),
                catDetails,banDetails,loginUser                      
            })
        }catch(err){
            throw(err);
        }
    }
    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< post details >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async post(req, res){ 
        try{ 

            let is_exist_heading = await catModel.findOne({heading:req.body.heading})

            if (!_.isEmpty(is_exist_heading)) {
                req.flash('error','This heading is already exists')
                return res.redirect('/post')
                
            }

            // if (!_.isEmpty(req.file)) {
            //     req.body.image = req.file.filename
                
            // }
            // else{
            //     req.flash('error','Image must be Added')
            //     return res.redirect('/post')
            // }

            let save_data = await postModel.create(req.body)

            if (!_.isEmpty(save_data) && save_data._id) {
                req.flash('success','Blog Added Sucessfully, Wait for Admin Approval')
                res.redirect('/post')
                
            } else{
                req.flash('error','Something went wrong')
                res.redirect('/post')
            }
            
        
           
        } catch(err){
            throw err;
        }
    } 
    //  <<<<<<<<<<<<<<<<<<<<<< show Blog >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    async showBlog(req, res){
        try{
            let loginUser = await registerModel.findOne({ _id : req.user.id });           
            const catDetails = await catModel.find({ isDeleted: false, isStatus: 'Active' }).sort({ createdAt: -1});
            const banDetails = await banModel.find({ isDeleted: false, isStatus: 'Active' });
           const postDetails = await postModel.aggregate([                
                {                   
                    $lookup:{
                        from: 'categories',
                        let : {                           
                            catId : '$category_id'   
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: [ '$_id', '$$catId' ] }                                            
                                        ]
                                    }
                                }
                            },
                            {
                                $project:{
                                    _id:1,
                                    name:1,                                   
                                }
                            }
                        ],
                        as: 'category_details'                                   
                    } 
                },
                {
                    $unwind: '$category_details'
                },
                {
                   $match: { 'user_register_id' : new mongoose.Types.ObjectId(req.user.id) }                  
                }
                ,{
                    $project: {
                        heading:1,
                        post:1,
                        image:1,
                        isStatus:1,   
                        user_register_id:1,
                        createdAt:1,
                        'category_details.name':1,
                        'category_details._id':1                                                                                       
                    }
                }                
            ])  

            //console.log(postDetails); console.log(req.user);
            res.render('front/myblog', {
                title: 'Blog Posts',
                error:req.flash('error'),
                success:req.flash('success'),
                catDetails,banDetails,loginUser,postDetails                      
            })
        }catch(err){
            throw(err);
        }
    }
//  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< View Post >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    async viewPost(req,res){
        try{
            let loginUser = await registerModel.findOne({_id: req.user.id});
            const catDetails = await catModel.find({ isDeleted: false, isStatus: 'Active' }).sort({ createdAt: -1});
            const postDetails = await postModel.findOne({_id: req.params.id})

            res.render('front/viewPost',{
                title:"Blog post",
                catDetails, loginUser,postDetails
            })



        }
        catch(err){
            throw err
        }
    }

}

module.exports = new BlogController();