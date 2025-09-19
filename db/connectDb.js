import mongoose from "mongoose";

const connectDb = async () => {
    try{
        const conn = await mongoose.connect("mongodb://localhost:27017/fund", {
            useNewUrlParser: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDb;
