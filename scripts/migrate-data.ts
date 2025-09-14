#!/usr/bin/env tsx
/**
 * MongoDB to PostgreSQL Data Migration Script
 * 
 * This script migrates existing data from MongoDB collections to PostgreSQL tables
 * while maintaining relationships and converting data formats appropriately.
 */

import "reflect-metadata";
import mongoose from "mongoose";
import { AppDataSource } from "../src/database/data-source.js";
import { User } from "../src/entities/user.entity.js";
import { Category } from "../src/entities/category.entity.js";
import { Product } from "../src/entities/product.entity.js";
import { Order } from "../src/entities/order.entity.js";
import { OrderStatus } from "../src/types/index.js";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// MongoDB connection string - update with your MongoDB details
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/test";

// MongoDB Schemas (simplified for reading data)
const mongoUserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    address: String,
    role: Number
}, { timestamps: true });

const mongoCategorySchema = new mongoose.Schema({
    name: String,
    slug: String
});

const mongoProductSchema = new mongoose.Schema({
    name: String,
    slug: String,
    description: {},
    price: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    quantity: Number,
    sold: Number,
    photo: {
        data: Buffer,
        contentType: String
    },
    shipping: Boolean
}, { timestamps: true });

const mongoOrderSchema = new mongoose.Schema({
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    payment: {},
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: String
}, { timestamps: true });

// MongoDB Models
const MongoUser = mongoose.model("User", mongoUserSchema);
const MongoCategory = mongoose.model("Category", mongoCategorySchema);
const MongoProduct = mongoose.model("Product", mongoProductSchema);
const MongoOrder = mongoose.model("Order", mongoOrderSchema);

// ID mapping to maintain relationships
const idMappings = {
    users: new Map<string, string>(),
    categories: new Map<string, string>(),
    products: new Map<string, string>(),
    orders: new Map<string, string>()
};

// Upload directory for photos
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "products");

/**
 * Ensure upload directory exists
 */
async function ensureUploadDir() {
    try {
        await fs.access(UPLOAD_DIR);
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        console.log(`📁 Created upload directory: ${UPLOAD_DIR}`);
    }
}

/**
 * Save photo buffer to filesystem and return file path
 */
async function savePhotoToFile(photoData: Buffer, contentType: string, productName: string): Promise<{ photoPath: string; photoContentType: string }> {
    const extension = contentType.split("/")[1] || "jpg";
    const filename = `${crypto.createHash("md5").update(productName + Date.now()).digest("hex")}.${extension}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    
    await fs.writeFile(filePath, photoData);
    
    return {
        photoPath: path.join("uploads", "products", filename),
        photoContentType: contentType
    };
}

/**
 * Convert MongoDB ObjectId to UUID v4
 */
function generateUUID(): string {
    return crypto.randomUUID();
}

/**
 * Map MongoDB status to PostgreSQL OrderStatus enum
 */
function mapOrderStatus(mongoStatus: string): OrderStatus {
    switch (mongoStatus) {
        case "Not processed":
            return OrderStatus.NOT_PROCESSED;
        case "Processing":
            return OrderStatus.PROCESSING;
        case "Shipped":
            return OrderStatus.SHIPPED;
        case "Delivered":
            return OrderStatus.DELIVERED;
        case "Cancelled":
            return OrderStatus.CANCELLED;
        default:
            return OrderStatus.NOT_PROCESSED;
    }
}

/**
 * Migrate Users from MongoDB to PostgreSQL
 */
async function migrateUsers() {
    console.log("\n🔄 Migrating Users...");
    
    const mongoUsers = await MongoUser.find({});
    const userRepository = AppDataSource.getRepository(User);
    
    console.log(`📊 Found ${mongoUsers.length} users in MongoDB`);
    
    for (const mongoUser of mongoUsers) {
        const uuid = generateUUID();
        idMappings.users.set(mongoUser._id.toString(), uuid);
        
        const postgresUser = userRepository.create({
            id: uuid,
            name: mongoUser.name,
            email: mongoUser.email,
            password: mongoUser.password, // Already hashed from MongoDB
            address: mongoUser.address || null,
            role: mongoUser.role || 0,
            createdAt: mongoUser.createdAt || new Date(),
            updatedAt: mongoUser.updatedAt || new Date()
        });
        
        await userRepository.save(postgresUser);
        console.log(`✅ Migrated user: ${mongoUser.name} (${mongoUser.email})`);
    }
    
    console.log(`🎉 Successfully migrated ${mongoUsers.length} users`);
}

/**
 * Migrate Categories from MongoDB to PostgreSQL
 */
async function migrateCategories() {
    console.log("\n🔄 Migrating Categories...");
    
    const mongoCategories = await MongoCategory.find({});
    const categoryRepository = AppDataSource.getRepository(Category);
    
    console.log(`📊 Found ${mongoCategories.length} categories in MongoDB`);
    
    for (const mongoCategory of mongoCategories) {
        const uuid = generateUUID();
        idMappings.categories.set(mongoCategory._id.toString(), uuid);
        
        const postgresCategory = categoryRepository.create({
            id: uuid,
            name: mongoCategory.name,
            slug: mongoCategory.slug
        });
        
        await categoryRepository.save(postgresCategory);
        console.log(`✅ Migrated category: ${mongoCategory.name}`);
    }
    
    console.log(`🎉 Successfully migrated ${mongoCategories.length} categories`);
}

/**
 * Migrate Products from MongoDB to PostgreSQL
 */
async function migrateProducts() {
    console.log("\n🔄 Migrating Products...");
    
    const mongoProducts = await MongoProduct.find({}).populate('category');
    const productRepository = AppDataSource.getRepository(Product);
    const categoryRepository = AppDataSource.getRepository(Category);
    
    console.log(`📊 Found ${mongoProducts.length} products in MongoDB`);
    
    for (const mongoProduct of mongoProducts) {
        const uuid = generateUUID();
        idMappings.products.set(mongoProduct._id.toString(), uuid);
        
        // Handle photo if exists
        let photoPath: string | undefined;
        let photoContentType: string | undefined;
        
        if (mongoProduct.photo && mongoProduct.photo.data) {
            console.log(`📸 Processing photo for product: ${mongoProduct.name}`);
            const photoResult = await savePhotoToFile(
                mongoProduct.photo.data,
                mongoProduct.photo.contentType || "image/jpeg",
                mongoProduct.name
            );
            photoPath = photoResult.photoPath;
            photoContentType = photoResult.photoContentType;
        }
        
        // Find corresponding PostgreSQL category
        const categoryId = idMappings.categories.get(mongoProduct.category._id.toString());
        if (!categoryId) {
            console.warn(`⚠️  Category not found for product ${mongoProduct.name}, skipping...`);
            continue;
        }
        
        const category = await categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
            console.warn(`⚠️  PostgreSQL category not found for product ${mongoProduct.name}, skipping...`);
            continue;
        }
        
        const postgresProduct = productRepository.create({
            id: uuid,
            name: mongoProduct.name,
            slug: mongoProduct.slug,
            description: typeof mongoProduct.description === 'string' 
                ? mongoProduct.description 
                : JSON.stringify(mongoProduct.description),
            price: mongoProduct.price,
            quantity: mongoProduct.quantity || 0,
            sold: mongoProduct.sold || 0,
            photoPath,
            photoContentType,
            shipping: mongoProduct.shipping || false,
            category,
            categoryId,
            createdAt: mongoProduct.createdAt || new Date(),
            updatedAt: mongoProduct.updatedAt || new Date()
        });
        
        await productRepository.save(postgresProduct);
        console.log(`✅ Migrated product: ${mongoProduct.name} ${photoPath ? '(with photo)' : ''}`);
    }
    
    console.log(`🎉 Successfully migrated ${mongoProducts.length} products`);
}

/**
 * Migrate Orders from MongoDB to PostgreSQL
 */
async function migrateOrders() {
    console.log("\n🔄 Migrating Orders...");
    
    const mongoOrders = await MongoOrder.find({})
        .populate('buyer')
        .populate('products');
    
    const orderRepository = AppDataSource.getRepository(Order);
    const userRepository = AppDataSource.getRepository(User);
    const productRepository = AppDataSource.getRepository(Product);
    
    console.log(`📊 Found ${mongoOrders.length} orders in MongoDB`);
    
    for (const mongoOrder of mongoOrders) {
        const uuid = generateUUID();
        idMappings.orders.set(mongoOrder._id.toString(), uuid);
        
        // Check if buyer exists (some orders might have null buyer)
        if (!mongoOrder.buyer || !mongoOrder.buyer._id) {
            console.warn(`⚠️  Order ${mongoOrder._id} has no buyer, skipping...`);
            continue;
        }
        
        // Find corresponding PostgreSQL buyer
        const buyerId = idMappings.users.get(mongoOrder.buyer._id.toString());
        if (!buyerId) {
            console.warn(`⚠️  Buyer not found for order ${mongoOrder._id}, skipping...`);
            continue;
        }
        
        const buyer = await userRepository.findOne({ where: { id: buyerId } });
        if (!buyer) {
            console.warn(`⚠️  PostgreSQL buyer not found for order ${mongoOrder._id}, skipping...`);
            continue;
        }
        
        // Find corresponding PostgreSQL products
        const products = [];
        for (const mongoProduct of mongoOrder.products) {
            const productId = idMappings.products.get(mongoProduct._id.toString());
            if (productId) {
                const product = await productRepository.findOne({ where: { id: productId } });
                if (product) {
                    products.push(product);
                }
            }
        }
        
        const postgresOrder = orderRepository.create({
            id: uuid,
            products,
            payment: mongoOrder.payment,
            buyer,
            buyerId,
            status: mapOrderStatus(mongoOrder.status),
            createdAt: mongoOrder.createdAt || new Date(),
            updatedAt: mongoOrder.updatedAt || new Date()
        });
        
        await orderRepository.save(postgresOrder);
        console.log(`✅ Migrated order: ${mongoOrder._id} (${products.length} products)`);
    }
    
    console.log(`🎉 Successfully migrated ${mongoOrders.length} orders`);
}

/**
 * Main migration function
 */
async function runMigration() {
    try {
        console.log("🚀 Starting MongoDB to PostgreSQL Data Migration");
        console.log("=" .repeat(60));
        
        // Initialize connections
        console.log("📊 Connecting to databases...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");
        
        await AppDataSource.initialize();
        console.log("✅ Connected to PostgreSQL");
        
        // Ensure upload directory exists
        await ensureUploadDir();
        
        // Run migrations in order (due to foreign key dependencies)
        await migrateUsers();
        await migrateCategories();
        await migrateProducts();
        await migrateOrders();
        
        console.log("\n" + "=" .repeat(60));
        console.log("🎉 DATA MIGRATION COMPLETED SUCCESSFULLY!");
        console.log("\n📊 Migration Summary:");
        console.log(`👥 Users: ${idMappings.users.size}`);
        console.log(`🏷️  Categories: ${idMappings.categories.size}`);
        console.log(`📦 Products: ${idMappings.products.size}`);
        console.log(`📋 Orders: ${idMappings.orders.size}`);
        
        // Save ID mappings for reference (optional)
        const mappingsFile = path.join(process.cwd(), "migration-mappings.json");
        await fs.writeFile(mappingsFile, JSON.stringify({
            users: Object.fromEntries(idMappings.users),
            categories: Object.fromEntries(idMappings.categories),
            products: Object.fromEntries(idMappings.products),
            orders: Object.fromEntries(idMappings.orders)
        }, null, 2));
        
        console.log(`💾 ID mappings saved to: ${mappingsFile}`);
        
    } catch (error) {
        console.error("❌ Migration failed:", error);
        throw error;
    } finally {
        // Close connections
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log("🔐 Disconnected from MongoDB");
        }
        
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log("🔐 Disconnected from PostgreSQL");
        }
    }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runMigration()
        .then(() => {
            console.log("✅ Migration script completed successfully");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 Migration script failed:", error);
            process.exit(1);
        });
}

export { runMigration };
