import { Router } from "express";
import {
    getCollections,
    getCollectionBySlug,
    createCollection,
    updateCollection,
    deleteCollection
} from "../controllers/collection.controller.js";
import { requireSignin, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/collections", getCollections);
router.get("/collections/:slug", getCollectionBySlug);

// Admin routes
router.post("/collections", requireSignin, isAdmin, createCollection);
router.put("/collections/:id", requireSignin, isAdmin, updateCollection);
router.delete("/collections/:id", requireSignin, isAdmin, deleteCollection);

export default router;