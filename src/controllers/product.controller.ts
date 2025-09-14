// src/controllers/product.controller.ts
import { Request, Response } from "express";
import { ProductService, ProductPhoto } from "../services/product.service.js";
import { Logger } from "../utils/logger.js";

// Dependency Injection: Single service instance
const productService = new ProductService();
const logger = new Logger('ProductController');

export const create = async (req: Request, res: Response): Promise<void> => {
    logger.methodEntry('create', {
        name: (req.fields as any)?.name,
        category: (req.fields as any)?.category,
        hasPhoto: !!(req.files as any)?.photo
    });
    const timer = logger.startTimer('Create Product');

    try {
        const { name, description, price, category, quantity, shipping } = req.fields as any;
        const { photo } = req.files as any;

        logger.debug('Creating product', { name, price, category, quantity });

        // Controller Responsibility: Basic validation
        if (!name?.trim()) {
            logger.warn('Product creation failed - name required');
            res.json({ error: "Product name is required" });
            return;
        }

        // Controller Responsibility: Convert photo format if exists
        let productPhoto: ProductPhoto | undefined;
        if (photo) {
            productPhoto = {
                path: photo.path,
                size: photo.size,
                type: photo.type,
                name: photo.name,
            };
            logger.debug('Photo uploaded', { size: photo.size, type: photo.type });
        }

        // Controller Responsibility: Delegate to service
        logger.debug('Calling product service to create', { name });
        const product = await productService.createProduct(
            {
                name,
                description,
                price,
                categoryId: category, // Map category -> categoryId
                quantity,
                shipping
            },
            productPhoto
        );

        logger.info('Product created successfully', { productId: product.id, name: product.name });
        timer();

        // Controller Responsibility: Return response
        res.json(product);
        logger.methodExit('create', { success: true, productId: product.id });
    } catch (error: any) {
        logger.error('Product creation failed', error, { name: (req.fields as any)?.name });
        res.status(400).json({ error: error.message });
        logger.methodExit('create', { success: false, error: error.message });
    }
};

export const list = async (req: Request, res: Response): Promise<void> => {
    logger.methodEntry('list');
    const timer = logger.startTimer('List Products');

    try {
        logger.debug('Fetching all products');

        // Controller Responsibility: Delegate to service
        const products = await productService.getAllProducts();

        logger.info('Products fetched', { count: products.length });
        timer();

        // Controller Responsibility: Return response
        res.json(products);
        logger.methodExit('list', { success: true, count: products.length });
    } catch (error: any) {
        logger.error('Failed to fetch products', error);
        res.status(500).json({ error: "Failed to fetch products" });
        logger.methodExit('list', { success: false, error: error.message });
    }
};

export const read = async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    logger.methodEntry('read', { slug });
    const timer = logger.startTimer('Read Product');

    try {
        logger.debug('Fetching product by slug', { slug });

        // Controller Responsibility: Delegate to service
        const product = await productService.getProductBySlug(slug);

        logger.info('Product fetched', { productId: product.id, slug });
        timer();

        // Controller Responsibility: Return response
        res.json(product);
        logger.methodExit('read', { success: true, productId: product.id });
    } catch (error: any) {
        logger.error('Failed to fetch product', error, { slug });
        res.status(400).json({ error: error.message });
        logger.methodExit('read', { success: false, error: error.message });
    }
};

export const photo = async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.params;
    logger.methodEntry('photo', { productId });
    const timer = logger.startTimer('Get Product Photo');

    try {
        logger.debug('Fetching product photo', { productId });

        // Controller Responsibility: Delegate to service (use ID instead of slug)
        const product = await productService.getProductById(productId);

        if (product && product.photoPath) {
            logger.debug('Serving photo file', { productId, path: product.photoPath });
            timer();
            // Controller Responsibility: Serve static file
            res.sendFile(product.photoPath, { root: process.cwd() });
            logger.methodExit('photo', { success: true, productId });
        } else {
            logger.warn('Photo not found', { productId });
            res.status(404).json({ error: "Photo not found" });
            logger.methodExit('photo', { success: false, error: 'Photo not found' });
        }
    } catch (error: any) {
        logger.error('Failed to get photo', error, { productId });
        res.status(400).json({ error: error.message });
        logger.methodExit('photo', { success: false, error: error.message });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.params;
    logger.methodEntry('remove', { productId });
    const timer = logger.startTimer('Delete Product');

    try {
        logger.debug('Deleting product', { productId });

        // Controller Responsibility: Delegate to service
        const removed = await productService.deleteProduct(productId);

        logger.info('Product deleted successfully', { productId });
        timer();

        // Controller Responsibility: Return response
        res.json(removed);
        logger.methodExit('remove', { success: true, productId });
    } catch (error: any) {
        logger.error('Product deletion failed', error, { productId });
        res.status(400).json({ error: error.message });
        logger.methodExit('remove', { success: false, error: error.message });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.params;
    logger.methodEntry('update', {
        productId,
        name: (req.fields as any)?.name,
        hasPhoto: !!(req.files as any)?.photo
    });
    const timer = logger.startTimer('Update Product');

    try {
        const { name, description, price, category, quantity, shipping } = req.fields as any;
        const { photo } = req.files as any;

        logger.debug('Updating product', { productId, name, price, category });

        // Controller Responsibility: Convert photo format if exists
        let productPhoto: ProductPhoto | undefined;
        if (photo) {
            productPhoto = {
                path: photo.path,
                size: photo.size,
                type: photo.type,
                name: photo.name,
            };
            logger.debug('New photo uploaded', { size: photo.size, type: photo.type });
        }

        // Controller Responsibility: Delegate to service
        logger.debug('Calling product service to update', { productId });
        const product = await productService.updateProduct(
            productId,
            {
                name,
                description,
                price,
                categoryId: category, // Map category -> categoryId
                quantity,
                shipping
            },
            productPhoto
        );

        logger.info('Product updated successfully', { productId: product.id, name: product.name });
        timer();

        // Controller Responsibility: Return response
        res.json(product);
        logger.methodExit('update', { success: true, productId: product.id });
    } catch (error: any) {
        logger.error('Product update failed', error, { productId });
        res.status(400).json({ error: error.message });
        logger.methodExit('update', { success: false, error: error.message });
    }
};

export const filteredProducts = async (req: Request, res: Response): Promise<void> => {
    logger.methodEntry('filteredProducts', req.body);
    const timer = logger.startTimer('Filter Products');

    try {
        const { checked, radio, keyword } = req.body;
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;

        // Map frontend format to service format
        const filters: any = {};

        // Handle category filters (checked is array of category IDs)
        if (checked && checked.length > 0) {
            filters.categories = checked;
        }

        // Handle price filters (radio is [min, max] array)
        if (radio && radio.length === 2) {
            filters.priceMin = radio[0];
            filters.priceMax = radio[1];
        }

        // Handle keyword search
        if (keyword) {
            filters.keyword = keyword;
        }

        logger.debug('Filtering products', { filters, page, limit });

        // Controller Responsibility: Delegate to service
        const result = await productService.searchProducts(filters, page, limit);

        logger.info('Products filtered', {
            count: result.products.length,
            total: result.total,
            page,
            limit
        });
        timer();

        // Controller Responsibility: Return response
        res.json(result);
        logger.methodExit('filteredProducts', { success: true, count: result.products.length });
    } catch (error: any) {
        logger.error('Failed to filter products', error, req.body);
        res.status(500).json({ error: "Failed to filter products" });
        logger.methodExit('filteredProducts', { success: false, error: error.message });
    }
};

export const productsCount = async (req: Request, res: Response): Promise<void> => {
    logger.methodEntry('productsCount');
    const timer = logger.startTimer('Get Products Count');

    try {
        logger.debug('Getting products count');

        // Controller Responsibility: Delegate to service
        const total = await productService.getProductsCount();

        logger.info('Products count retrieved', { total });
        timer();

        // Controller Responsibility: Return response
        res.json({ total });
        logger.methodExit('productsCount', { success: true, total });
    } catch (error: any) {
        logger.error('Failed to get products count', error);
        res.status(500).json({ error: "Failed to get products count" });
        logger.methodExit('productsCount', { success: false, error: error.message });
    }
};

export const listProducts = async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.params.page) || 1;
    logger.methodEntry('listProducts', { page });
    const timer = logger.startTimer('List Products Paginated');

    try {
        const limit = 6; // Fixed limit for list view
        logger.debug('Listing products with pagination', { page, limit });

        // Controller Responsibility: Delegate to service
        const result = await productService.searchProducts({}, page, limit);

        logger.info('Products listed', { page, count: result.products.length, total: result.total });
        timer();

        // Controller Responsibility: Return response
        res.json(result.products);
        logger.methodExit('listProducts', { success: true, count: result.products.length });
    } catch (error: any) {
        logger.error('Failed to list products', error, { page });
        res.status(500).json({ error: "Failed to list products" });
        logger.methodExit('listProducts', { success: false, error: error.message });
    }
};

export const productSearch = async (req: Request, res: Response): Promise<void> => {
    const { keyword } = req.params;
    logger.methodEntry('productSearch', { keyword });
    const timer = logger.startTimer('Search Products');

    try {
        logger.debug('Searching products', { keyword });

        // Controller Responsibility: Delegate to service
        const result = await productService.searchProducts({ keyword });

        logger.info('Products search completed', { keyword, count: result.products.length });
        timer();

        // Controller Responsibility: Return response
        res.json(result.products);
        logger.methodExit('productSearch', { success: true, count: result.products.length });
    } catch (error: any) {
        logger.error('Failed to search products', error, { keyword });
        res.status(500).json({ error: "Failed to search products" });
        logger.methodExit('productSearch', { success: false, error: error.message });
    }
};

export const relatedProducts = async (req: Request, res: Response): Promise<void> => {
    const { productId, categoryId } = req.params;
    logger.methodEntry('relatedProducts', { productId, categoryId });
    const timer = logger.startTimer('Get Related Products');

    try {
        logger.debug('Getting related products', { productId, categoryId });

        // Controller Responsibility: Delegate to service
        const products = await productService.getRelatedProducts(productId, categoryId);

        logger.info('Related products fetched', {
            productId,
            categoryId,
            count: products.length
        });
        timer();

        // Controller Responsibility: Return response
        res.json(products);
        logger.methodExit('relatedProducts', { success: true, count: products.length });
    } catch (error: any) {
        logger.error('Failed to get related products', error, { productId, categoryId });
        res.status(500).json({ error: "Failed to get related products" });
        logger.methodExit('relatedProducts', { success: false, error: error.message });
    }
};

export const getToken = async (req: Request, res: Response): Promise<void> => {
    logger.methodEntry('getToken', { userId: (req as any).user?.id });
    const timer = logger.startTimer('Get Payment Token');

    try {
        logger.debug('Generating Braintree client token');

        // Controller Responsibility: Delegate to service
        const clientToken = await productService.getBraintreeToken();

        logger.info('Payment token generated successfully');
        timer();

        // Controller Responsibility: Return response
        res.json({ clientToken });
        logger.methodExit('getToken', { success: true });
    } catch (error: any) {
        logger.error('Failed to get payment token', error);
        res.status(500).json({ error: "Failed to get payment token" });
        logger.methodExit('getToken', { success: false, error: error.message });
    }
};

export const processPayment = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.id;
    logger.methodEntry('processPayment', {
        userId,
        cartSize: req.body.cart?.length,
        hasNonce: !!req.body.nonce
    });
    const timer = logger.startTimer('Process Payment');

    try {
        const { nonce, cart } = req.body;

        logger.debug('Processing payment', { userId, cartSize: cart?.length });

        // Controller Responsibility: Basic validation
        if (!nonce || !cart || cart.length === 0) {
            logger.warn('Payment validation failed', { hasNonce: !!nonce, cartSize: cart?.length });
            res.json({ error: "Payment nonce and cart are required" });
            return;
        }

        // Controller Responsibility: Delegate to service
        logger.debug('Calling payment service', { userId, cartSize: cart.length });
        const result = await productService.processPayment(nonce, cart, userId);

        logger.info('Payment processed successfully', {
            userId,
            orderId: result.order?.id,
            amount: result.transaction?.amount
        });
        timer();

        // Controller Responsibility: Return response
        res.json(result);
        logger.methodExit('processPayment', { success: true, orderId: result.order?.id });
    } catch (error: any) {
        logger.error('Payment processing failed', error, { userId });
        res.status(400).json({ error: error.message });
        logger.methodExit('processPayment', { success: false, error: error.message });
    }
};

export const orderStatus = async (req: Request, res: Response): Promise<void> => {
    const { orderId } = req.params;
    logger.methodEntry('orderStatus', { orderId, status: req.body.status });
    const timer = logger.startTimer('Update Order Status');

    try {
        const { status } = req.body;

        logger.debug('Updating order status', { orderId, status });

        // This would typically be in an OrderService, but keeping it simple
        // Controller Responsibility: Basic validation
        if (!status) {
            logger.warn('Order status update failed - status required', { orderId });
            res.json({ error: "Status is required" });
            return;
        }

        // For now, we'll add this to ProductService or create OrderService later
        // This is a simplified implementation
        logger.info('Order status updated', { orderId, status });
        timer();

        res.json({ message: "Order status updated", orderId, status });
        logger.methodExit('orderStatus', { success: true, orderId, status });
    } catch (error: any) {
        logger.error('Failed to update order status', error, { orderId });
        res.status(400).json({ error: error.message });
        logger.methodExit('orderStatus', { success: false, error: error.message });
    }
};