import express from "express";
const router = express.Router();

//Middlewares
import { requireSignin, isAdmin } from '../middlewares/auth.js';

//Controllers
import { create } from '../controllers/category.js';

router.post( "/category", requireSignin, isAdmin, create );
router.put( "/category", requireSignin, isAdmin, create );

export default router;

