//Authentication related routes store here
import express from "express";
const router = express.Router();

//Controllers
import { register, login } from '../controllers/auth.js';

router.post( "/register", register );
router.post( "/login", login );

//Testing
router.get("/secret")

export default router;