const Listing  = require("../models/listing.js");
const Review  = require("../models/reviews.js");

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); 
    listing.reviews.push(newReview);
    newReview.author = req.user._id;
    await listing.save();
    await newReview.save();
    req.flash("success","Review Created.");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destoryReview = async(req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted.");
    res.redirect(`/listings/${id}`);
};