const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Mongo_URL = "mongodb://127.0.0.1:27017/tourism";

main()
.then((res)=>console.log('Connection Successful'))
.catch((err)=>console.log(err))

async function main(){
    await mongoose.connect(Mongo_URL);
}

const initDB = async () => {
     //await Listing.deleteMany({});
     //console.log("Database Empty")
   await Listing.insertMany(initData);
   console.log("Data Successfully Inserted")
    
}

initDB();
