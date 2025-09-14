// src/services/CategoryService.ts
import { CategoryRepository } from "../repositories/category.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { CreateCategoryDto } from "../types/index.js";
import slugify from "slugify";
import { Logger } from "../utils/logger.js";

export class CategoryService {
    private categoryRepository: CategoryRepository;
    private productRepository: ProductRepository;
    private logger: Logger;

    constructor() {
        this.categoryRepository = new CategoryRepository();
        this.productRepository = new ProductRepository();
        this.logger = new Logger('CategoryService');
    }

    // Business Logic: Create Category with Auto Slug
    async createCategory(name: string): Promise<any> {
        this.logger.methodEntry('createCategory', { name });
        const timer = this.logger.startTimer('Create Category');

        // Business Logic: Validate category name
        this.logger.debug('Validating category name', { name });
        const validationError = this.validateCategoryName(name);
        if (validationError) {
            this.logger.warn('Category validation failed', { name, error: validationError });
            throw new Error(validationError);
        }

        // Business Logic: Sanitize and generate slug
        const sanitizedName = name.trim();
        const slug = slugify(sanitizedName, { lower: true });
        this.logger.debug('Generated slug for category', { sanitizedName, slug });

        // Business Logic: Check if category already exists
        this.logger.debug('Checking if category name exists', { sanitizedName });
        const existingCategory = await this.categoryRepository.findByName(sanitizedName);
        if (existingCategory) {
            this.logger.warn('Category creation failed - name already exists', { name: sanitizedName });
            throw new Error("Category already exists");
        }

        // Business Logic: Check if slug already exists
        this.logger.debug('Checking if slug exists', { slug });
        const existingSlug = await this.categoryRepository.findBySlug(slug);
        if (existingSlug) {
            this.logger.warn('Category creation failed - slug already exists', { slug });
            throw new Error("Category with similar name already exists");
        }

        // Business Logic: Create category
        this.logger.debug('Creating category', { name: sanitizedName, slug });
        const category = await this.categoryRepository.createCategory({
            name: sanitizedName,
            slug
        });

        this.logger.info('Category created successfully', { categoryId: category.id, name: category.name, slug: category.slug });
        timer();
        this.logger.methodExit('createCategory', { categoryId: category.id });

        return category;
    }

    // Business Logic: Update Category
    async updateCategory(categoryId: string, name: string): Promise<any> {
        this.logger.methodEntry('updateCategory', { categoryId, name });
        const timer = this.logger.startTimer('Update Category');

        // Business Logic: Validate
        this.logger.debug('Validating category name', { categoryId, name });
        const validationError = this.validateCategoryName(name);
        if (validationError) {
            this.logger.warn('Category update validation failed', { categoryId, name, error: validationError });
            throw new Error(validationError);
        }

        // Business Logic: Check if category exists
        this.logger.debug('Checking if category exists', { categoryId });
        const existingCategory = await this.categoryRepository.findById(categoryId);
        if (!existingCategory) {
            this.logger.error('Category not found for update', new Error('Category not found'), { categoryId });
            throw new Error("Category not found");
        }

        // Business Logic: Generate new slug
        const sanitizedName = name.trim();
        const slug = slugify(sanitizedName, { lower: true });
        this.logger.debug('Generated new slug', { categoryId, sanitizedName, slug });

        // Business Logic: Check if another category has this name (exclude current)
        this.logger.debug('Checking for name conflicts', { categoryId, sanitizedName });
        const nameConflict = await this.categoryRepository.findByName(sanitizedName);
        if (nameConflict && nameConflict.id !== categoryId) {
            this.logger.warn('Category update failed - name conflict', { categoryId, name: sanitizedName, conflictId: nameConflict.id });
            throw new Error("Category name already exists");
        }

        // Business Logic: Update category
        this.logger.debug('Updating category', { categoryId, name: sanitizedName, slug });
        const updated = await this.categoryRepository.update(categoryId, {
            name: sanitizedName,
            slug
        });

        this.logger.info('Category updated successfully', { categoryId, name: updated.name, slug: updated.slug });
        timer();
        this.logger.methodExit('updateCategory', { categoryId });

        return updated;
    }

    // Business Logic: Delete Category with Dependency Check
    async deleteCategory(categoryId: string): Promise<any> {
        this.logger.methodEntry('deleteCategory', { categoryId });
        const timer = this.logger.startTimer('Delete Category');

        // Business Logic: Check if category exists
        this.logger.debug('Checking if category exists', { categoryId });
        const category = await this.categoryRepository.findById(categoryId);
        if (!category) {
            this.logger.error('Category not found for deletion', new Error('Category not found'), { categoryId });
            throw new Error("Category not found");
        }

        // Business Logic: Check if category has products
        this.logger.debug('Checking for associated products', { categoryId });
        const products = await this.productRepository.findByCategory(categoryId);
        if (products.length > 0) {
            this.logger.warn('Cannot delete category with products', { categoryId, productCount: products.length });
            throw new Error(`Cannot delete category. It has ${products.length} products associated with it.`);
        }

        // Business Logic: Delete category
        this.logger.debug('Deleting category', { categoryId });
        const deleted = await this.categoryRepository.delete(categoryId);
        if (!deleted) {
            this.logger.error('Failed to delete category', new Error('Delete failed'), { categoryId });
            throw new Error("Failed to delete category");
        }

        this.logger.info('Category deleted successfully', { categoryId, name: category.name });
        timer();
        this.logger.methodExit('deleteCategory', { categoryId });

        return category;
    }

    // Business Logic: Get All Categories
    async getAllCategories(): Promise<any[]> {
        this.logger.methodEntry('getAllCategories');
        const timer = this.logger.startTimer('Get All Categories');

        this.logger.debug('Fetching all categories');
        const categories = await this.categoryRepository.findAll();

        this.logger.info('Categories retrieved', { count: categories.length });
        timer();
        this.logger.methodExit('getAllCategories', { count: categories.length });

        return categories;
    }

    // Business Logic: Get Category by Slug
    async getCategoryBySlug(slug: string): Promise<any> {
        this.logger.methodEntry('getCategoryBySlug', { slug });
        const timer = this.logger.startTimer('Get Category by Slug');

        this.logger.debug('Fetching category by slug', { slug });
        const category = await this.categoryRepository.findBySlug(slug);
        if (!category) {
            this.logger.warn('Category not found by slug', { slug });
            throw new Error("Category not found");
        }

        this.logger.info('Category retrieved by slug', { categoryId: category.id, slug });
        timer();
        this.logger.methodExit('getCategoryBySlug', { categoryId: category.id });

        return category;
    }

    // Business Logic: Get Category with Products
    async getCategoryWithProducts(slug: string): Promise<{ category: any; products: any[] }> {
        this.logger.methodEntry('getCategoryWithProducts', { slug });
        const timer = this.logger.startTimer('Get Category with Products');

        // Business Logic: Get category
        this.logger.debug('Fetching category by slug', { slug });
        const category = await this.categoryRepository.findBySlug(slug);
        if (!category) {
            this.logger.warn('Category not found for products query', { slug });
            throw new Error("Category not found");
        }

        // Business Logic: Get products in category
        this.logger.debug('Fetching products for category', { categoryId: category.id });
        const products = await this.productRepository.findByCategory(category.id);

        this.logger.info('Category with products retrieved', {
            categoryId: category.id,
            slug,
            productCount: products.length
        });
        timer();
        this.logger.methodExit('getCategoryWithProducts', {
            categoryId: category.id,
            productCount: products.length
        });

        return {
            category,
            products
        };
    }

    // Business Logic: Get Categories with Product Count
    async getCategoriesWithCount(): Promise<any[]> {
        this.logger.methodEntry('getCategoriesWithCount');
        const timer = this.logger.startTimer('Get Categories with Count');

        this.logger.debug('Fetching categories with product count');
        const categories = await this.categoryRepository.findAllWithProductCount();

        this.logger.info('Categories with count retrieved', { categoryCount: categories.length });
        timer();
        this.logger.methodExit('getCategoriesWithCount', { count: categories.length });

        return categories;
    }

    // Private Business Logic: Validation
    private validateCategoryName(name: string): string | null {
        this.logger.debug('Validating category name', { name });

        if (!name || !name.trim()) {
            this.logger.debug('Validation failed: Name is required');
            return "Category name is required";
        }

        const trimmedName = name.trim();
        if (trimmedName.length < 2) {
            this.logger.debug('Validation failed: Name too short', { length: trimmedName.length });
            return "Category name must be at least 2 characters";
        }

        if (trimmedName.length > 32) {
            this.logger.debug('Validation failed: Name too long', { length: trimmedName.length });
            return "Category name must be less than 32 characters";
        }

        // Allow letters, numbers, spaces, and common symbols
        const nameRegex = /^[a-zA-ZÀ-ÿ0-9\s&\-'.()]+$/;
        if (!nameRegex.test(trimmedName)) {
            this.logger.debug('Validation failed: Invalid characters', { name: trimmedName });
            return "Category name contains invalid characters";
        }

        this.logger.debug('Category name validation passed', { name: trimmedName });
        return null;
    }
}