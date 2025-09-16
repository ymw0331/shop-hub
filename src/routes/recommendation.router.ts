import { Router } from "express";
import { getPersonalizedRecommendations, updateUserPreferences } from "../controllers/recommendation.controller.js";
import { requireSignin } from "../middlewares/auth.middleware.js";

const router = Router();

// Public route (works for both authenticated and non-authenticated users)
router.get("/products/recommended", getPersonalizedRecommendations);

// Protected routes
router.post("/user/preferences", requireSignin, updateUserPreferences);

export default router;