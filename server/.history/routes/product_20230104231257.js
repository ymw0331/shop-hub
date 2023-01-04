import express from "express";
const router = express.Router();

//Middlewares
import { requireSignin, isAdmin } from '../middlewares/auth.js';

//Controllers
import { create, update, remove, list, read } from '../controllers/product.js';

router.post("/product")



export default router;

