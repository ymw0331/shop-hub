// src/routes/auth.routes.ts
import { Router } from "express";
import { register, login, secret, updateProfile, getOrders, allOrders } from "../controllers/auth.controller.js";
import { requireSignin, isAuth, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Authentication routes
router.post("/register", register);
router.post("/login", login);
router.get("/secret/:userId", requireSignin, isAuth, secret);

// Profile management
router.put("/profile/:userId", requireSignin, isAuth, updateProfile);

// Order routes
router.get("/orders/:userId", requireSignin, isAuth, getOrders);
router.get("/admin/orders", requireSignin, isAdmin, allOrders);

export default router;