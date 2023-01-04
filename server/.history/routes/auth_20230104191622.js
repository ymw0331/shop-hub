import express from "express";

const router = express.Router();

// middlewares
import { requireSignin, isAdmin } from "../middlewares/auth.js";
// controllers
import { register, login, secret } from "../controllers/auth.js";

router.post( "/register", register );
router.post( "/login", login );
// testing
router.get( "/secret", requireSignin, isAdmin, secret );

export default router;
