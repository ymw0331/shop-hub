// src/services/ProductService.ts
import { ProductRepository } from "../repositories/product.repository.js";
import { CategoryRepository } from "../repositories/category.repository.js";
import { OrderRepository } from "../repositories/order.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import slugify from "slugify";
import fs from "fs";
import path from "path";
import braintree from "braintree";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_KEY);
// Braintree Gateway Configuration
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox, // Change to Production for live
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
export class ProductService {
    constructor() {
        this.productRepository = new ProductRepository();
        this.categoryRepository = new CategoryRepository();
        this.orderRepository = new OrderRepository();
    }
    // Business Logic: Create Product with Photo Upload
    async createProduct(productData, photo) {
        const { name, description, price, category, quantity, shipping } = productData;
        // Business Logic: Validate product data
        const validationError = this.validateProductData(productData);
        if (validationError) {
            throw new Error(validationError);
        }
        // Business Logic: Validate category exists
        const categoryExists = await this.categoryRepository.findById(category);
        if (!categoryExists) {
            throw new Error("Category not found");
        }
        // Business Logic: Generate unique slug
        const baseSlug = slugify(name, { lower: true });
        const slug = await this.generateUniqueSlug(baseSlug);
        // Business Logic: Handle photo upload
        let photoPath;
        let photoContentType;
        if (photo) {
            const photoValidation = this.validatePhoto(photo);
            if (photoValidation) {
                throw new Error(photoValidation);
            }
            const photoResult = await this.saveProductPhoto(photo, slug);
            photoPath = photoResult.path;
            photoContentType = photo.type;
        }
        // Business Logic: Get category for relation
        const categoryEntity = await this.categoryRepository.findById(productData.categoryId);
        if (!categoryEntity) {
            throw new Error("Category not found");
        }
        // Business Logic: Create product
        const product = await this.productRepository.createProduct({
            name: name.trim(),
            slug,
            description: description.trim(),
            price: typeof price === 'string' ? parseFloat(price) : price,
            quantity: typeof quantity === 'string' ? parseInt(quantity) : quantity,
            shipping: typeof shipping === 'string' ? shipping === "true" : Boolean(shipping),
            categoryId: productData.categoryId,
            category: categoryEntity,
            sold: 0, // Default value
            photoPath,
            photoContentType,
        });
        return product;
    }
    // Business Logic: Update Product
    async updateProduct(productId, productData, photo) {
        // Business Logic: Check if product exists
        const existingProduct = await this.productRepository.findById(productId);
        if (!existingProduct) {
            throw new Error("Product not found");
        }
        // Business Logic: Validate updated data
        if (Object.keys(productData).length > 0) {
            const validationError = this.validateProductData(productData, false);
            if (validationError) {
                throw new Error(validationError);
            }
        }
        // Business Logic: Handle slug regeneration if name changed
        let slug = existingProduct.slug;
        if (productData.name && productData.name !== existingProduct.name) {
            const baseSlug = slugify(productData.name, { lower: true });
            slug = await this.generateUniqueSlug(baseSlug, productId);
        }
        // Business Logic: Handle photo update
        let photoPath = existingProduct.photoPath;
        let photoContentType = existingProduct.photoContentType;
        if (photo) {
            const photoValidation = this.validatePhoto(photo);
            if (photoValidation) {
                throw new Error(photoValidation);
            }
            // Remove old photo
            if (existingProduct.photoPath) {
                await this.removeProductPhoto(existingProduct.photoPath);
            }
            // Save new photo
            const photoResult = await this.saveProductPhoto(photo, slug);
            photoPath = photoResult.path;
            photoContentType = photo.type;
        }
        // Business Logic: Update product
        const updateData = {
            ...productData,
            slug,
            photoPath,
            photoContentType,
        };
        return await this.productRepository.update(productId, updateData);
    }
    // Business Logic: Delete Product
    async deleteProduct(productId) {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        // Business Logic: Remove photo file
        if (product.photoPath) {
            await this.removeProductPhoto(product.photoPath);
        }
        // Business Logic: Delete product
        const deleted = await this.productRepository.delete(productId);
        if (!deleted) {
            throw new Error("Failed to delete product");
        }
        return product;
    }
    // Business Logic: Get All Products
    async getAllProducts() {
        return await this.productRepository.findAllWithCategory();
    }
    // Business Logic: Get Product by Slug
    async getProductBySlug(slug) {
        const product = await this.productRepository.findBySlug(slug);
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    }
    // Business Logic: Get Product by ID
    async getProductById(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    }
    // Business Logic: Search Products with Filters
    async searchProducts(filters, page = 1, limit = 10) {
        let products = [];
        if (filters.keyword) {
            products = await this.productRepository.searchByName(filters.keyword);
        }
        else if (filters.category) {
            products = await this.productRepository.findByCategory(filters.category);
        }
        else {
            const result = await this.productRepository.findWithPagination(page, limit);
            return {
                products: result.data,
                total: result.total,
                page: result.page,
                limit: result.limit
            };
        }
        // Business Logic: Apply price filters
        if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
            products = products.filter(product => {
                const price = parseFloat(product.price);
                if (filters.priceMin !== undefined && price < filters.priceMin)
                    return false;
                if (filters.priceMax !== undefined && price > filters.priceMax)
                    return false;
                return true;
            });
        }
        // Business Logic: Pagination
        const total = products.length;
        const startIndex = (page - 1) * limit;
        const paginatedProducts = products.slice(startIndex, startIndex + limit);
        return {
            products: paginatedProducts,
            total,
            page,
            limit
        };
    }
    // Business Logic: Get Products Count
    async getProductsCount() {
        return await this.productRepository.count();
    }
    // Business Logic: Get Related Products
    async getRelatedProducts(productId, categoryId, limit = 4) {
        const relatedProducts = await this.productRepository.findByCategory(categoryId);
        // Business Logic: Exclude the current product and limit results
        return relatedProducts
            .filter(product => product.id !== productId)
            .slice(0, limit);
    }
    // Business Logic: Get Braintree Token
    async getBraintreeToken() {
        try {
            const response = await gateway.clientToken.generate({});
            return response.clientToken;
        }
        catch (error) {
            throw new Error("Failed to generate payment token");
        }
    }
    // Business Logic: Process Payment and Create Order
    async processPayment(nonce, cart, userId) {
        try {
            // Business Logic: Calculate total amount
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            // Business Logic: Process Braintree payment
            const result = await gateway.transaction.sale({
                amount: total.toFixed(2),
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            });
            if (!result.success) {
                throw new Error(result.message || "Payment failed");
            }
            // Business Logic: Create order (repository will handle relations)
            const productIds = cart.map(item => item.id);
            // Get buyer for the order relation
            const userRepository = new UserRepository();
            const buyer = await userRepository.findById(userId);
            if (!buyer) {
                throw new Error("User not found");
            }
            const order = await this.orderRepository.createOrder({
                payment: result,
                buyer: buyer,
                buyerId: userId, // Add missing property
                status: "Processing",
            }, productIds);
            // Business Logic: Update product quantities
            for (const item of cart) {
                await this.productRepository.incrementSold(item.id, item.quantity);
            }
            // Business Logic: Send confirmation email (optional)
            // await this.sendOrderConfirmationEmail(order, userEmail);
            return {
                order,
                transaction: result.transaction,
            };
        }
        catch (error) {
            throw new Error(`Payment processing failed: ${error.message}`);
        }
    }
    // Private Business Logic: Photo Management
    async saveProductPhoto(photo, slug) {
        // Ensure uploads directory exists
        const uploadsDir = path.join(process.cwd(), "uploads", "products");
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        // Generate unique filename
        const timestamp = Date.now();
        const extension = path.extname(photo.name || ".jpg");
        const filename = `${slug}-${timestamp}${extension}`;
        const filePath = path.join(uploadsDir, filename);
        // Copy photo to uploads directory
        fs.copyFileSync(photo.path, filePath);
        return { path: `uploads/products/${filename}` };
    }
    async removeProductPhoto(photoPath) {
        try {
            const fullPath = path.join(process.cwd(), photoPath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }
        catch (error) {
            console.log("Warning: Could not remove photo file:", error);
        }
    }
    // Private Business Logic: Validation
    validateProductData(data, isCreate = true) {
        if (isCreate || data.name !== undefined) {
            if (!data.name || !data.name.trim()) {
                return "Product name is required";
            }
            if (data.name.trim().length > 160) {
                return "Product name must be less than 160 characters";
            }
        }
        if (isCreate || data.description !== undefined) {
            if (!data.description || !data.description.trim()) {
                return "Product description is required";
            }
            if (data.description.trim().length > 2000) {
                return "Product description must be less than 2000 characters";
            }
        }
        if (isCreate || data.price !== undefined) {
            const price = parseFloat(data.price);
            if (isNaN(price) || price <= 0) {
                return "Valid price is required";
            }
            if (price > 999999.99) {
                return "Price too high";
            }
        }
        if (isCreate || data.quantity !== undefined) {
            const quantity = parseInt(data.quantity);
            if (isNaN(quantity) || quantity < 0) {
                return "Valid quantity is required";
            }
        }
        if (isCreate || data.category !== undefined) {
            if (!data.category) {
                return "Category is required";
            }
        }
        return null;
    }
    validatePhoto(photo) {
        if (!photo)
            return null;
        if (photo.size > 1000000) {
            return "Image should be less than 1MB in size";
        }
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
        if (!allowedTypes.includes(photo.type)) {
            return "Only JPEG, PNG and GIF images are allowed";
        }
        return null;
    }
    async generateUniqueSlug(baseSlug, excludeId) {
        let slug = baseSlug;
        let counter = 1;
        while (true) {
            const existing = await this.productRepository.findBySlug(slug);
            if (!existing || (excludeId && existing.id === excludeId)) {
                break;
            }
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        return slug;
    }
}
