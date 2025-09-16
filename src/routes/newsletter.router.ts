import { Router } from "express";
import {
    subscribeNewsletter,
    unsubscribeNewsletter,
    getNewsletterSubscribers
} from "../controllers/newsletter.controller.js";
import { requireSignin, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/newsletter/subscribe", subscribeNewsletter);
router.get("/newsletter/unsubscribe/:token", unsubscribeNewsletter);

// Admin routes
router.get("/newsletter/subscribers", requireSignin, isAdmin, getNewsletterSubscribers);

export default router;