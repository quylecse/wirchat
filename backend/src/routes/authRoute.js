import express from 'express';
import { signUp, signIn } from '../controllers/authController.js';

const router = express.Router();

router.post("/signup", signUp); //signUp wird in authController.js definiert
router.post("/signin", signIn); //signUp wird in authController.js definiert

export default router;
