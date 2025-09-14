// src/repositories/ProductRepository.ts
import { Between } from "typeorm";
import { BaseRepository } from "./base.repository.js";
import { Product } from "../entities/product.entity.js";
export class ProductRepository extends BaseRepository {
    constructor() {
        super(Product);
    }
    // Product-specific queries matching your Mongoose patterns
    async findBySlug(slug) {
        return this.findOne({ slug });
    }
    async findByCategory(categoryId) {
        return this.find({
            where: { categoryId },
            relations: ["category"]
        });
    }
    // Industry Standard: Search with ILIKE for case-insensitive search
    async searchByName(searchTerm) {
        return this.repository
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "category")
            .where("product.name ILIKE :searchTerm", { searchTerm: `%${searchTerm}%` })
            .getMany();
    }
    async findByPriceRange(minPrice, maxPrice) {
        return this.find({
            where: {
                price: Between(minPrice, maxPrice)
            },
            relations: ["category"]
        });
    }
    // Featured products (high sold count)
    async findFeatured(limit = 10) {
        return this.repository
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "category")
            .orderBy("product.sold", "DESC")
            .limit(limit)
            .getMany();
    }
    // Always include category (matches Mongoose populate)
    async findAllWithCategory() {
        return this.find({
            relations: ["category"]
        });
    }
    async findByIdWithCategory(id) {
        return this.repository.findOne({
            where: { id },
            relations: ["category"]
        });
    }
    // Update quantity (for inventory management)
    async updateQuantity(id, quantity) {
        return this.update(id, { quantity });
    }
    // Increment sold count (when order completed)
    async incrementSold(id, quantity) {
        await this.repository
            .createQueryBuilder()
            .update(Product)
            .set({
            sold: () => `sold + ${quantity}`,
            quantity: () => `quantity - ${quantity}`
        })
            .where("id = :id", { id })
            .execute();
        return this.findByIdWithCategory(id);
    }
    // Create product
    async createProduct(productData) {
        const product = this.repository.create(productData);
        return this.save(product);
    }
    // Check if slug exists
    async slugExists(slug) {
        const count = await this.repository.count({
            where: { slug }
        });
        return count > 0;
    }
    // Filter products with inventory
    async findInStock() {
        return this.repository
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "category")
            .where("product.quantity > 0")
            .getMany();
    }
}
