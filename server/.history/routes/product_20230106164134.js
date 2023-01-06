import express from "express";
import formidable from "express-formidable";


const router = express.Router();

//Middlewares
import { requireSignin, isAdmin } from '../middlewares/auth.js';

//Controllers
import { create, list, read, photo, remove, update, filteredProducts, productsCount, listProducts, productSearch } from '../controllers/product.js';

router.post( "/product", requireSignin, isAdmin, formidable(), create );
router.get( "/products", list );
router.get( "/product/:slug", read );
router.get( "/product/photo/:productId", photo );
router.delete( "/product/:productId", requireSignin, isAdmin, remove );
router.put( "/product/:productId", requireSignin, isAdmin, formidable(), update );
router.post( '/filtered-products', filteredProducts );
router.get( '/products-count', productsCount );
router.get( '/list-products/:page', listProducts );
router.get( '/products/search/:keyword', productSearch );



export default router;

