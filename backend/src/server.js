import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';

dotenv.config();
//create an express 
const app = express();

//create PORT
const PORT = process.env.PORT || 5001;


//middlewares
app.use(express.json());


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`===server is running on Port ${PORT}===`);
        });
    });


