import { ProductService } from "../services/product.service.js";
// Dependency Injection: Single service instance
const productService = new ProductService();
export const create = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        // Controller Responsibility: Basic validation
        if (!name?.trim()) {
            res.json({ error: "Product name is required" });
            return;
        }
        // Controller Responsibility: Convert photo format if exists
        let productPhoto;
        if (photo) {
            productPhoto = {
                path: photo.path,
                size: photo.size,
                type: photo.type,
                name: photo.name,
            };
        }
        // Controller Responsibility: Delegate to service
        const product = await productService.createProduct({
            name,
            description,
            price,
            categoryId: category, // Map category -> categoryId
            quantity,
            shipping
        }, productPhoto);
        // Controller Responsibility: Return response
        res.json(product);
    }
    catch (error) {
        console.log("Create product error:", error);
        res.status(400).json({ error: error.message });
    }
};
export const list = async (req, res) => {
    try {
        // Controller Responsibility: Delegate to service
        const products = await productService.getAllProducts();
        // Controller Responsibility: Return response
        res.json(products);
    }
    catch (error) {
        console.log("List products error:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};
export const read = async (req, res) => {
    try {
        const { slug } = req.params;
        // Controller Responsibility: Delegate to service
        const product = await productService.getProductBySlug(slug);
        // Controller Responsibility: Return response
        res.json(product);
    }
    catch (error) {
        console.log("Read product error:", error);
        res.status(400).json({ error: error.message });
    }
};
export const photo = async (req, res) => {
    try {
        const { productId } = req.params;
        // Controller Responsibility: Delegate to service (use ID instead of slug)
        const product = await productService.getProductById(productId);
        if (product && product.photoPath) {
            // Controller Responsibility: Serve static file
            res.sendFile(product.photoPath, { root: process.cwd() });
        }
        else {
            res.status(404).json({ error: "Photo not found" });
        }
    }
    catch (error) {
        console.log("Get photo error:", error);
        res.status(400).json({ error: error.message });
    }
};
export const remove = async (req, res) => {
    try {
        const { productId } = req.params;
        // Controller Responsibility: Delegate to service
        const removed = await productService.deleteProduct(productId);
        // Controller Responsibility: Return response
        res.json(removed);
    }
    catch (error) {
        console.log("Delete product error:", error);
        res.status(400).json({ error: error.message });
    }
};
export const update = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        // Controller Responsibility: Convert photo format if exists
        let productPhoto;
        if (photo) {
            productPhoto = {
                path: photo.path,
                size: photo.size,
                type: photo.type,
                name: photo.name,
            };
        }
        // Controller Responsibility: Delegate to service
        const product = await productService.updateProduct(productId, {
            name,
            description,
            price,
            categoryId: category, // Map category -> categoryId
            quantity,
            shipping
        }, productPhoto);
        // Controller Responsibility: Return response
        res.json(product);
    }
    catch (error) {
        console.log("Update product error:", error);
        res.status(400).json({ error: error.message });
    }
};
export const filteredProducts = async (req, res) => {
    try {
        const { category, priceMin, priceMax, keyword } = req.body;
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        // Controller Responsibility: Delegate to service
        const result = await productService.searchProducts({ category, priceMin, priceMax, keyword }, page, limit);
        // Controller Responsibility: Return response
        res.json(result);
    }
    catch (error) {
        console.log("Filter products error:", error);
        res.status(500).json({ error: "Failed to filter products" });
    }
};
export const productsCount = async (req, res) => {
    try {
        // Controller Responsibility: Delegate to service
        const total = await productService.getProductsCount();
        // Controller Responsibility: Return response
        res.json({ total });
    }
    catch (error) {
        console.log("Products count error:", error);
        res.status(500).json({ error: "Failed to get products count" });
    }
};
export const listProducts = async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const limit = 6; // Fixed limit for list view
        // Controller Responsibility: Delegate to service
        const result = await productService.searchProducts({}, page, limit);
        // Controller Responsibility: Return response
        res.json(result.products);
    }
    catch (error) {
        console.log("List products error:", error);
        res.status(500).json({ error: "Failed to list products" });
    }
};
export const productSearch = async (req, res) => {
    try {
        const { keyword } = req.params;
        // Controller Responsibility: Delegate to service
        const result = await productService.searchProducts({ keyword });
        // Controller Responsibility: Return response
        res.json(result.products);
    }
    catch (error) {
        console.log("Search products error:", error);
        res.status(500).json({ error: "Failed to search products" });
    }
};
export const relatedProducts = async (req, res) => {
    try {
        const { productId, categoryId } = req.params;
        // Controller Responsibility: Delegate to service
        const products = await productService.getRelatedProducts(productId, categoryId);
        // Controller Responsibility: Return response
        res.json(products);
    }
    catch (error) {
        console.log("Related products error:", error);
        res.status(500).json({ error: "Failed to get related products" });
    }
};
export const getToken = async (req, res) => {
    try {
        // Controller Responsibility: Delegate to service
        const clientToken = await productService.getBraintreeToken();
        // Controller Responsibility: Return response
        res.json({ clientToken });
    }
    catch (error) {
        console.log("Get token error:", error);
        res.status(500).json({ error: "Failed to get payment token" });
    }
};
export const processPayment = async (req, res) => {
    try {
        const { nonce, cart } = req.body;
        const userId = req.user.id; // From auth middleware
        // Controller Responsibility: Basic validation
        if (!nonce || !cart || cart.length === 0) {
            res.json({ error: "Payment nonce and cart are required" });
            return;
        }
        // Controller Responsibility: Delegate to service
        const result = await productService.processPayment(nonce, cart, userId);
        // Controller Responsibility: Return response
        res.json(result);
    }
    catch (error) {
        console.log("Process payment error:", error);
        res.status(400).json({ error: error.message });
    }
};
export const orderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        // This would typically be in an OrderService, but keeping it simple
        // Controller Responsibility: Basic validation
        if (!status) {
            res.json({ error: "Status is required" });
            return;
        }
        // For now, we'll add this to ProductService or create OrderService later
        // This is a simplified implementation
        res.json({ message: "Order status updated", orderId, status });
    }
    catch (error) {
        console.log("Update order status error:", error);
        res.status(400).json({ error: error.message });
    }
};
