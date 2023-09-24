const mongoose = require('mongoose');
const connectDB = async() => {
    try{
        mongoose.set('strictQuery',false);
        const conn = await mongoose.connect(process.env.mongodbUrl);
        console.log(`Database connected: ${conn.connection.host}`);
    }catch(error){
        console.log(error);
    }
}

module.exports = connectDB;