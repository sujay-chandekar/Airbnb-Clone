const Listing = require("../models/listing.js");
const maptilersdk = "@maptiler/sdk";


//index route
module.exports.renderIndex = async(req,res)=>{
    const listings = await Listing.find({});
    res.render("index.ejs", { listings }); 
};

//new Route render form
module.exports.renderNewForm = (req,res)=>{
    res.render("new.ejs");
};

//saving new listing in DB
module.exports.createListing = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = {url,filename};
    newListing.owner = req.user._id; 
    await newListing.save();
    req.flash("success","Listing Created Successfully.");
    res.redirect("/listings");
};

//show route 
module.exports.renderShowForm = async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        }
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing that you are finding is not exits.");
        res.redirect("/listings");
        return;
    }
    res.render("show.ejs", { listing }); 
};

//Edit form Listing rendering
module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing that you are finding is not exits.");
        res.redirect('/listings');
        return;
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload","/upload/h_250,w_300");
    res.render("edit.ejs", { listing , originalImage });
};

//updating in DB
module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated.");
    res.redirect(`/listings/${id}`);
};

//Delete Listing 
module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing  = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted.");
   // console.log(deletedListing);
    res.redirect("/listings");
};