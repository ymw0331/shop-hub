// src/routes/product.routes.ts
import express from "express";
import * as productController from "../controllers/product.controller.js";
import { requireSignin, isAdmin } from "../middlewares/auth.js";
import formidable from "express-formidable";
const router = express.Router();
// Public product routes
router.get('/products', productController.list);
router.get('/products/count', productController.productsCount);
router.get('/products/:page', productController.listProducts);
router.get('/product/:slug', productController.read);
router.get('/product/photo/:productId', productController.photo);
// Product search and filtering
router.post('/products/search', productController.filteredProducts);
router.get('/products/search/:keyword', productController.productSearch);
router.get('/related-products/:productId/:categoryId', productController.relatedProducts);
// Admin product management (with file upload middleware)
router.post('/product', requireSignin, isAdmin, formidable(), productController.create);
router.put('/product/:productId', requireSignin, isAdmin, formidable(), productController.update);
router.delete('/product/:productId', requireSignin, isAdmin, productController.remove);
// Payment routes
router.get('/braintree/token', productController.getToken);
router.post('/braintree/payment', requireSignin, productController.processPayment);
// Order management
router.put('/order-status/:orderId', requireSignin, isAdmin, productController.orderStatus);
export default router;
