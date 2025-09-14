// src/routes/auth.routes.ts
import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { requireSignin, isAdmin } from "../middlewares/auth.js";
const router = express.Router();
// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
// Protected routes  
router.get('/user-auth', requireSignin, authController.secret);
router.get('/admin-auth', requireSignin, isAdmin, authController.secret);
// Profile routes
router.put('/profile/:userId', requireSignin, authController.updateProfile);
// Order routes
router.get('/orders/:userId', requireSignin, authController.getOrders);
router.get('/all-orders', requireSignin, isAdmin, authController.allOrders);
export default router;
