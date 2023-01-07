import express from "express";
const router = express.Router();

//Middlewares
import { requireSignin, isAdmin } from '../middlewares/auth.js';

//Controllers
import { create, update, remove, list, read, productsByCategory } from '../controllers/category.js';

router.post( "/category", requireSignin, isAdmin, create );
router.put( "/category/:categoryId", requireSignin, isAdmin, update );
router.delete( "/category/:categoryId", requireSignin, isAdmin, remove );
router.get( "/categories", list );
router.get( "/category/:slug", read );
router.get( '/products-by-category/:slug', productsByCategory );


export default router;

