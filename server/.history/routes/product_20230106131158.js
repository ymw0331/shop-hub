import express from "express";
import formidable from "express-formidable";


const router = express.Router();

//Middlewares
import { requireSignin, isAdmin } from '../middlewares/auth.js';

//Controllers
import { create, list, read, photo, remove, update, filteredProducts } from '../controllers/product.js';

router.post( "/product", requireSignin, isAdmin, formidable(), create );
router.get( "/products", list );
router.get( "/product/:slug", read );
router.get( "/product/photo/:productId", photo );
router.delete( "/product/:productId", requireSignin, isAdmin, remove );
router.put( "/product/:productId", requireSignin, isAdmin, formidable(), update );
router.get( '/filtered-products', filteredProducts );


export default router;

