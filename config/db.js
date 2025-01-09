require('dotenv').config();
const mongoose = require('mongoose');

function connectDB(){
          mongoose.connect(process.env.MONGO_CONNECTION_URL)
          .then(()=>{
                    console.log(`MongoDB Connected`);
          })
          .catch(()=>{
                    console.log(`Connection Failed`);
          })
}

module.exports = {
          connectDB,
}