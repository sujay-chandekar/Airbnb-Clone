const mongoose = require("mongoose");
const initData = require("./Data.js");
const Listing  = require("../models/listing.js");

//connection database
main().then(()=>{
    console.log("Connection Successful ......");
}).catch((err)=>{
     console.log(err);
}
);

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

const initDB = async () => {
    try {
      await Listing.deleteMany({});
      initData.data = initData.data.map((obj)=>({...obj,owner:"67289427ceac45cb2b97b374"}));
      await Listing.insertMany(initData.data);
      console.log("Database initialized with data.");
    } catch (err) {
      console.error("Error initializing the database: ", err);
    }
}
initDB();