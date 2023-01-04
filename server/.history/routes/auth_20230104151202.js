//Authentication related routes store here
import express from "express";
const router = express.Router();

//Controllers
import { register } from '../controllers/auth.js';

router.post( "/register", register );

export default router;