const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

// Joi Error Handler Middleware for Listing
const validateListing = (req , res , next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404 , errMsg)
    }else{
        next();
    }
}

// Index Route
router.get('/' , wrapAsync(async (req , res)=>{
    let result = await Listing.find({});
    res.render("listings/index.ejs" , {result})
}))

// New Route
router.get("/new" , wrapAsync((req , res)=>{
    res.render("listings/new.ejs");
}))

// Create Route
router.post("/" , validateListing , wrapAsync(async (req , res)=>{
    let result = new Listing(req.body.listing);
    await result.save();
    res.redirect("/listings");
}))

// Show Route
router.get("/:id" , wrapAsync(async (req , res)=>{
    let {id} = req.params;
    let result = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs" , {result});
}))

// Edit Route
router.get("/:id/edit" , wrapAsync(async (req , res)=>{
    let {id} = req.params;
    let result = await Listing.findById(id);
    res.render("listings/edit.ejs" , {result});
}))

// Update Route
router.put("/:id" , validateListing , wrapAsync(async (req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

// Delete Route
router.delete("/:id" , wrapAsync(async (req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings')
}))

module.exports = router;