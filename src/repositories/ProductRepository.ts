// src/repositories/ProductRepository.ts
import { FindOptionsWhere, Between, Like } from "typeorm";
import { BaseRepository } from "./BaseRepository.js";
import { Product } from "../entities/Product.js";
import { IProduct } from "../types/index.js";

export class ProductRepository extends BaseRepository<Product> {
    constructor() {
        super(Product);
    }

    // Product-specific queries matching your Mongoose patterns
    async findBySlug(slug: string): Promise<Product | null> {
        return this.findOne({ slug } as FindOptionsWhere<Product>);
    }

    async findByCategory(categoryId: string): Promise<Product[]> {
        return this.find({
            where: { categoryId } as FindOptionsWhere<Product>,
            relations: ["category"]
        });
    }

    // Industry Standard: Search with ILIKE for case-insensitive search
    async searchByName(searchTerm: string): Promise<Product[]> {
        return this.repository
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "category")
            .where("product.name ILIKE :searchTerm", { searchTerm: `%${searchTerm}%` })
            .getMany();
    }

    async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
        return this.find({
            where: {
                price: Between(minPrice, maxPrice)
            } as FindOptionsWhere<Product>,
            relations: ["category"]
        });
    }

    // Featured products (high sold count)
    async findFeatured(limit: number = 10): Promise<Product[]> {
        return this.repository
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "category")
            .orderBy("product.sold", "DESC")
            .limit(limit)
            .getMany();
    }

    // Always include category (matches Mongoose populate)
    async findAllWithCategory(): Promise<Product[]> {
        return this.find({
            relations: ["category"]
        });
    }

    async findByIdWithCategory(id: string): Promise<Product | null> {
        return this.repository.findOne({
            where: { id },
            relations: ["category"]
        });
    }

    // Update quantity (for inventory management)
    async updateQuantity(id: string, quantity: number): Promise<Product | null> {
        return this.update(id, { quantity } as Partial<Product>);
    }

    // Increment sold count (when order completed)
    async incrementSold(id: string, quantity: number): Promise<Product | null> {
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
    async createProduct(productData: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
        const product = this.repository.create(productData);
        return this.save(product);
    }

    // Check if slug exists
    async slugExists(slug: string): Promise<boolean> {
        const count = await this.repository.count({
            where: { slug } as FindOptionsWhere<Product>
        });
        return count > 0;
    }

    // Filter products with inventory
    async findInStock(): Promise<Product[]> {
        return this.repository
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "category")
            .where("product.quantity > 0")
            .getMany();
    }
}