import express from "express";
const router = express.Router();

//Middlewares
import { requireSignin, isAdmin } from '../middlewares/auth.js';

//Controllers
import { create, update, remove, list } from '../controllers/category.js';

router.post( "/category", requireSignin, isAdmin, create );
router.put( "/category", requireSignin, isAdmin, update );
router.delete( "/category:categoryId", requireSignin, isAdmin, remove );
router.get( "/categories", list );
router.delete( "/category:categoryId", read );

export default router;

