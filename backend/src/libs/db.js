import mongoose from 'mongoose';


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log(`===connected to Database===`);
    } catch (error) {
        console.log(`===error to connecting to Database: `, error);
        process.exit(1);
    }
};