import { Router } from "express";
import { getTrendingProducts, trackProductView } from "../controllers/trending.controller.js";

const router = Router();

// Public routes
router.get("/products/trending", getTrendingProducts);
router.post("/products/view/:productId", trackProductView);

export default router;