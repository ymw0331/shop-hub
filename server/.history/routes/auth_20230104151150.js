//Authentication related routes store here
import express from "express";
const router = express.Router();

//Controllers
import { users } from '../controllers/auth.js';

router.post( "/users", users );

export default router;