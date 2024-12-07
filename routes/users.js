const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const {saveRedirectURL} = require("../middleware.js");
const userController = require("../controllers/users.js");

//render sign up form and signUp

router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signUp));

//render login form and logIn
router.route("/login")
    .get(userController.renderLogInForm)
    .post(
        saveRedirectURL,
        passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,}),
        wrapAsync(userController.logIn)
    );

//logout 
router.get("/logout",userController.logout);

module.exports = router;