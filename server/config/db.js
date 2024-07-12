const mongoose = require("mongoose");

const connectDb = async (uri) => {
   try {
      await mongoose.connect(uri)
      console.log('database connected')
   } catch (error) {
      console.log(`Failed connect: ${error}`)
      process.exit();
   }
}

module.exports = connectDb;
