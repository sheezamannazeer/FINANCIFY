const mongoose=require('mongoose');

const connectDB=async()=>{
    try{
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI environment variable is not set");
            throw new Error("MONGO_URI is required");
        }
        
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    }
    catch(error){
        console.error("Error connecting to MongoDB:", error.message);
        // Don't exit the process, let it retry
        setTimeout(connectDB, 5000); // Retry after 5 seconds
    }
};

module.exports=connectDB;