import express from "express";
const router = express.Router();

//Middlewares
import { requireSignin, isAdmin } from '../middlewares/auth.js';

//Controllers
import { create } from '../controllers/category.js';

router.post( "/category", requireSignin, isAdmin, create );
router.put( "/category", requireSignin, isAdmin, update );
router.delete( "/category:categoryId", requireSignin, isAdmin, remove );
router.get( "/category", requireSignin, isAdmin, update );

export default router;

