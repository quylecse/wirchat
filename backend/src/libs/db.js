import mongoose from 'mongoose';

//create a connection to MongoDB via mongoose
export const connectDB = async () => {
    try {
        //try to connect to the created database link on env
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log(`===connected to Database===`);
    } catch (error) {
        // on error, throw message out and disconnect
        console.log(`===error to connecting to Database: `, error);
        process.exit(1);
    }
};