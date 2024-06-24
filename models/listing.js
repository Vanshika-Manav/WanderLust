const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const defaultImg =
  "https://media.cntraveler.com/photos/5841fe31e186e2555afdd5ca/master/pass/alfond-inn-cr-courtesy.jpg";
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String ,
    required : true
  },
  image: {
    type: String,
    filename: String,
    url: String,
    set: (userImg) => (userImg === "" ? defaultImg : userImg),
    default: defaultImg,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews : [
    {
      type : mongoose.Schema.Types.ObjectId , 
      ref : "Review"
    }
  ]
});

// Post Middleware for Delete review and listing
listingSchema.post("findOneAndDelete" , async (listing)=>{
  if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
