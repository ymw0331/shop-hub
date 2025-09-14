// src/routes/category.routes.ts
import { Router } from "express";
import { create, update, remove, list, read, productsByCategory } from "../controllers/category.controller.js";
import { requireSignin, isAuth, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Category CRUD
router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, update);
router.delete("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, remove);

// Public category routes
router.get("/categories", list);
router.get("/category/:slug", read);
router.get("/products-by-category/:slug", productsByCategory);

export default router;