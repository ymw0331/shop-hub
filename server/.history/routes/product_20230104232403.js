import express from "express";
import formidable from "express-formidable";


const router = express.Router();

//Middlewares
import { requireSignin, isAdmin } from '../middlewares/auth.js';

//Controllers
import { create } from '../controllers/product.js';

router.post( "/product", requireSignin, isAdmin, create );



export default router;

