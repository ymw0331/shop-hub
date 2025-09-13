import { BaseRepository } from "./BaseRepository.js";
import { Category } from "../entities/Category.js";
export class CategoryRepository extends BaseRepository {
    constructor() {
        super(Category);
    }
    // Category-specific queries
    async findByName(name) {
        return this.findOne({ name });
    }
    async findBySlug(slug) {
        return this.findOne({ slug });
    }
    // Industry Standard: Include product count
    async findAllWithProductCount() {
        const categories = await this.repository
            .createQueryBuilder("category")
            .leftJoin("category.products", "product")
            .addSelect("COUNT(product.id) as productCount")
            .groupBy("category.id")
            .getRawAndEntities();
        return categories.entities.map((category, index) => {
            category.productCount = parseInt(categories.raw[index].productCount) || 0;
            return category;
        });
    }
    // Create category with auto-generated slug
    async createCategory(categoryData) {
        const category = this.repository.create(categoryData);
        return this.save(category);
    }
    // Check if name or slug exists
    async nameExists(name) {
        const count = await this.repository.count({
            where: { name }
        });
        return count > 0;
    }
    async slugExists(slug) {
        const count = await this.repository.count({
            where: { slug }
        });
        return count > 0;
    }
}
