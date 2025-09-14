// src/services/CategoryService.ts
import { CategoryRepository } from "../repositories/category.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import slugify from "slugify";
export class CategoryService {
    constructor() {
        this.categoryRepository = new CategoryRepository();
        this.productRepository = new ProductRepository();
    }
    // Business Logic: Create Category with Auto Slug
    async createCategory(name) {
        // Business Logic: Validate category name
        const validationError = this.validateCategoryName(name);
        if (validationError) {
            throw new Error(validationError);
        }
        // Business Logic: Sanitize and generate slug
        const sanitizedName = name.trim();
        const slug = slugify(sanitizedName, { lower: true });
        // Business Logic: Check if category already exists
        const existingCategory = await this.categoryRepository.findByName(sanitizedName);
        if (existingCategory) {
            throw new Error("Category already exists");
        }
        // Business Logic: Check if slug already exists
        const existingSlug = await this.categoryRepository.findBySlug(slug);
        if (existingSlug) {
            throw new Error("Category with similar name already exists");
        }
        // Business Logic: Create category
        return await this.categoryRepository.createCategory({
            name: sanitizedName,
            slug
        });
    }
    // Business Logic: Update Category
    async updateCategory(categoryId, name) {
        // Business Logic: Validate
        const validationError = this.validateCategoryName(name);
        if (validationError) {
            throw new Error(validationError);
        }
        // Business Logic: Check if category exists
        const existingCategory = await this.categoryRepository.findById(categoryId);
        if (!existingCategory) {
            throw new Error("Category not found");
        }
        // Business Logic: Generate new slug
        const sanitizedName = name.trim();
        const slug = slugify(sanitizedName, { lower: true });
        // Business Logic: Check if another category has this name (exclude current)
        const nameConflict = await this.categoryRepository.findByName(sanitizedName);
        if (nameConflict && nameConflict.id !== categoryId) {
            throw new Error("Category name already exists");
        }
        // Business Logic: Update category
        return await this.categoryRepository.update(categoryId, {
            name: sanitizedName,
            slug
        });
    }
    // Business Logic: Delete Category with Dependency Check
    async deleteCategory(categoryId) {
        // Business Logic: Check if category exists
        const category = await this.categoryRepository.findById(categoryId);
        if (!category) {
            throw new Error("Category not found");
        }
        // Business Logic: Check if category has products
        const products = await this.productRepository.findByCategory(categoryId);
        if (products.length > 0) {
            throw new Error(`Cannot delete category. It has ${products.length} products associated with it.`);
        }
        // Business Logic: Delete category
        const deleted = await this.categoryRepository.delete(categoryId);
        if (!deleted) {
            throw new Error("Failed to delete category");
        }
        return category;
    }
    // Business Logic: Get All Categories
    async getAllCategories() {
        return await this.categoryRepository.findAll();
    }
    // Business Logic: Get Category by Slug
    async getCategoryBySlug(slug) {
        const category = await this.categoryRepository.findBySlug(slug);
        if (!category) {
            throw new Error("Category not found");
        }
        return category;
    }
    // Business Logic: Get Category with Products
    async getCategoryWithProducts(slug) {
        // Business Logic: Get category
        const category = await this.categoryRepository.findBySlug(slug);
        if (!category) {
            throw new Error("Category not found");
        }
        // Business Logic: Get products in category
        const products = await this.productRepository.findByCategory(category.id);
        return {
            category,
            products
        };
    }
    // Business Logic: Get Categories with Product Count
    async getCategoriesWithCount() {
        return await this.categoryRepository.findAllWithProductCount();
    }
    // Private Business Logic: Validation
    validateCategoryName(name) {
        if (!name || !name.trim()) {
            return "Category name is required";
        }
        const trimmedName = name.trim();
        if (trimmedName.length < 2) {
            return "Category name must be at least 2 characters";
        }
        if (trimmedName.length > 32) {
            return "Category name must be less than 32 characters";
        }
        // Allow letters, numbers, spaces, and common symbols
        const nameRegex = /^[a-zA-ZÀ-ÿ0-9\s&\-'.()]+$/;
        if (!nameRegex.test(trimmedName)) {
            return "Category name contains invalid characters";
        }
        return null;
    }
}
