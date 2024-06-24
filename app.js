const express = require("express");
const app = express();
const port = 4444;
const mongoose = require("mongoose");
const Mongo_URL = "mongodb://127.0.0.1:27017/tourism";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listing = require("./routes/listing.js"); 
const review = require("./routes/review.js");

main()
.then((res)=>console.log('Connection Successful'))
.catch((err)=>console.log(err))

async function main(){
    await mongoose.connect(Mongo_URL);
}

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "public")));


app.use("/listings" , listing);
app.use("/listings/:id/reviews" , review)

app.get("/" , (req , res)=>{
    res.send("Hii I am Root");
})

// If above routes are not matched
app.all("*" , (req , res , next)=>{
    next(new ExpressError(404 , "Page Not Found!"))
})

//Middleware for Errors
app.use((err , req , res , next)=>{
    let {status = 500 , message = "Something Went Wrong"} = err;
    res.status(status).render("error.ejs" , {message});
})

app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`);
})