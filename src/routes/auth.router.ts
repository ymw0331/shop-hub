// src/routes/auth.routes.ts
import { Router } from "express";
import { register, login, secret, updateProfile, getOrders, allOrders, authCheck, adminCheck, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { requireSignin, isAuth, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Authentication routes
router.post("/register", register);
router.post("/login", login);
router.get("/secret/:userId", requireSignin, isAuth, secret);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Profile management
router.put("/profile/:userId", requireSignin, isAuth, updateProfile);

// Order routes
router.get("/orders/:userId", requireSignin, isAuth, getOrders);
router.get("/admin/orders", requireSignin, isAdmin, allOrders);

// Route protection endpoints for frontend route guards
router.get("/auth-check", requireSignin, authCheck);
router.get("/admin-check", requireSignin, isAdmin, adminCheck);

export default router;