const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
_=require('underscore');
const flash = require('connect-flash');
const expressSession = require('express-session');
const cookieparser = require('cookie-parser');

app.set('view engine','ejs');
app.set('views','views');

app.use(expressSession({
    secret: "MYS3CR3TK3Y",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(cookieparser()); 
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({
    extended:true
}))
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< auth path Section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const adminjwt = require('./middleware/admin/auth');
app.use(adminjwt.authJwt);

const frontjwt = require('./middleware/front/auth');
app.use(frontjwt.authJwt);

//<<<<<<<<<<<<<<<<<<<<<<<<<<<< user Routes >>>>>>>>>>>>>>>>>>>>>>>>>
const homePageRouter = require('./routes/front/home.routes');
app.use(homePageRouter);

// *login registration>>>>>>>>>>>
const frontUserRouter = require('./routes/front/user.routes');
app.use(frontUserRouter);

const blogSectionRouter = require('./routes/front/blog.routes');
app.use(blogSectionRouter);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<< Admin routes >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 
const userRouter = require('./routes/admin/user.routes'); 
app.use('/admin', userRouter);

const faqRouter = require('./routes/admin/faq.routes'); 
app.use('/admin/faq', faqRouter);

const categoryRouter = require('./routes/admin/category.routes'); 
app.use('/admin/category', categoryRouter);

const bannerRouter = require('./routes/admin/banner.routes'); 
app.use('/admin/banner', bannerRouter);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// >>>>>>>>>>>>>>>>>>>>> Front View Router >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const frontViewRouter = require('./routes/admin/frontView.routes'); 
app.use('/admin', frontViewRouter);

require(path.join(__dirname, '/config/database'))();

app.listen(process.env.PORT,() =>{
    console.log(`server running @ http://127.0.0.1:${process.env.PORT}`);
})