import express from "express";
const router = express.Router();

//Middlewares
import { requireSignin, isAdmin } from '../middlewares/auth.js';

//Controllers
import { create } from '../controllers/product.js';

router.post( "/product", requireSignin, isAdmin, create );



export default router;

