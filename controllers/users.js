const User = require("../models/user.js");


//render Sign up form
module.exports.renderSignUpForm = (req,res)=>{
    res.render("../users/signup.ejs");
};

//Sign up the user post route
module.exports.signUp = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User({username,email});
        let registedUser = await User.register(newUser,password);
        registedUser.save();
        //console.log(registedUser);
        req.login(registedUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome To WanderLust !");
            res.redirect("/listings");
        });
    }
    catch(e){
        req.flash("error",e.message);   
        res.redirect("/signup");
    }
};

//render the Login form
module.exports.renderLogInForm = (req,res)=>{
    res.render("../users/login.ejs");
};

//post log in route
module.exports.logIn = async(req,res)=>{
    req.flash("success","Welcome Back To WanderLust!!");
    res.locals.redirectURL = res.locals.redirectURL || "/listings";
    res.redirect(res.locals.redirectURL);
};

//logOut
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are now Logged Out!");
        res.redirect("/listings");
    });
};