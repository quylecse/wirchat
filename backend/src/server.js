import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import authRoute from './routes/authRoute.js'

dotenv.config();
//create an express 
const app = express();

//create PORT
const PORT = process.env.PORT || 5001;


//middlewares
app.use(express.json());


//public routes aus authRoute.js
app.use('/api/auth', authRoute);

//private routes


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`===server is running on Port ${PORT}===`);
        });
    });


