import express from "express";
import {
  signUp,
  signIn,
  signOut, // This was likely missing in your local file
  refreshToken, // This was likely missing in your local file
} from "../controllers/authController.js";

const router = express.Router();

//Methoden werden in authController.js definiert
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/refresh", refreshToken);

export default router;
