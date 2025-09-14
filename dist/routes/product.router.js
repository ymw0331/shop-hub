// src/routes/product.routes.ts
import { Router } from "express";
import { create, list, read, photo, remove, update, filteredProducts, productsCount, listProducts, productSearch, relatedProducts, getToken, processPayment, orderStatus } from "../controllers/product.controller.js";
import { requireSignin, isAuth, isAdmin } from "../middlewares/auth.middleware.js";
import formidable from "express-formidable";
const router = Router();
// Product CRUD
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, formidable(), create);
router.put("/product/:productId/:userId", requireSignin, isAuth, isAdmin, formidable(), update);
router.delete("/product/:productId/:userId", requireSignin, isAuth, isAdmin, remove);
// Public product routes
router.get("/products", list);
router.get("/product/:slug", read);
router.get("/product/photo/:productId", photo);
// Search and filtering
router.post("/products/search", filteredProducts);
router.get("/products/count", productsCount);
router.get("/products/:page", listProducts);
router.get("/products/search/:keyword", productSearch);
router.get("/products/related/:productId/:categoryId", relatedProducts);
// Payment routes
router.get("/braintree/getToken/:userId", requireSignin, isAuth, getToken);
router.post("/braintree/payment/:userId", requireSignin, isAuth, processPayment);
router.put("/order/status/:orderId/:userId", requireSignin, isAuth, isAdmin, orderStatus);
export default router;
