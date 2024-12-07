const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Listing  = require("../models/listing.js");
const {reviewSchema} = require("../schema.js");
const Review  = require("../models/reviews.js");
const {validateReviews,isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//Create review Route
router.post("/",isLoggedIn,validateReviews,wrapAsync(reviewController.createReview));

//Review Route Delete
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destoryReview));

module.exports = router;