const Listing  = require("./models/listing.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/expressError.js");
const {} = require("./models/reviews.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedIn = (req,res,next)=>{
    req.session.redirectURL = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error","You need to Logged In first !!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectURL = (req,res,next)=>{
    if(req.session.redirectURL){
        console.log(req.session.redirectURL);
        res.locals.redirectURL = req.session.redirectURL;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if( res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this listing..");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateReviews = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error.message);
    } else{
        next();
    }
};

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error.message);
    } else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {reviewId,id}= req.params;
    let review = await Review.findById(reviewId);
    if( res.locals.currUser && !(review.author._id.equals(res.locals.currUser._id))){
        req.flash("error","You are not author of this review..");
        return res.redirect(`/listings/${id}`);
    }
    next();
};