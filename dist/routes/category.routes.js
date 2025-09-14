// src/routes/category.routes.ts
import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import { requireSignin, isAdmin } from "../middlewares/auth.js";
const router = express.Router();
// Public routes
router.get('/categories', categoryController.list);
router.get('/category/:slug', categoryController.read);
router.get('/products-by-category/:slug', categoryController.productsByCategory);
// Admin routes (protected)
router.post('/category', requireSignin, isAdmin, categoryController.create);
router.put('/category/:categoryId', requireSignin, isAdmin, categoryController.update);
router.delete('/category/:categoryId', requireSignin, isAdmin, categoryController.remove);
export default router;
