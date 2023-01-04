import express from "express";
import formidable from "express-formidable";


const router = express.Router();

//Middlewares
import { requireSignin, isAdmin } from '../middlewares/auth.js';

//Controllers
import { create } from '../controllers/product.js';

router.post( "/product", requireSignin, isAdmin, formidable(), create );
router.get( "/products", requireSignin, isAdmin, formidable(), list );



export default router;

