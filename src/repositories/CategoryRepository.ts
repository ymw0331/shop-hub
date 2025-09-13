// src/repositories/CategoryRepository.ts
import { FindOptionsWhere } from "typeorm";
import { BaseRepository } from "./BaseRepository.js";
import { Category } from "../entities/Category.js";
import { ICategory } from "../types/index.js";

export class CategoryRepository extends BaseRepository<Category> {
    constructor() {
        super(Category);
    }

    // Category-specific queries
    async findByName(name: string): Promise<Category | null> {
        return this.findOne({ name } as FindOptionsWhere<Category>);
    }

    async findBySlug(slug: string): Promise<Category | null> {
        return this.findOne({ slug } as FindOptionsWhere<Category>);
    }

    // Industry Standard: Include product count
    async findAllWithProductCount(): Promise<(Category & { productCount: number })[]> {
        const categories = await this.repository
            .createQueryBuilder("category")
            .leftJoin("category.products", "product")
            .addSelect("COUNT(product.id) as productCount")
            .groupBy("category.id")
            .getRawAndEntities();

        return categories.entities.map((category, index) => {
            (category as any).productCount = parseInt(categories.raw[index].productCount) || 0;
            return category as Category & { productCount: number };
        });
    }

    // Create category with auto-generated slug
    async createCategory(categoryData: Omit<ICategory, 'id'>): Promise<Category> {
        const category = this.repository.create(categoryData);
        return this.save(category);
    }

    // Check if name or slug exists
    async nameExists(name: string): Promise<boolean> {
        const count = await this.repository.count({
            where: { name } as FindOptionsWhere<Category>
        });
        return count > 0;
    }

    async slugExists(slug: string): Promise<boolean> {
        const count = await this.repository.count({
            where: { slug } as FindOptionsWhere<Category>
        });
        return count > 0;
    }
}