// src/controllers/category.controller.ts
import { Request, Response } from "express";
import { CategoryService } from "../services/category.service.js";
import { Logger } from "../utils/logger.js";

// Dependency Injection: Single service instance
const categoryService = new CategoryService();
const logger = new Logger('CategoryController');

export const create = async (req: Request, res: Response): Promise<void> => {
    logger.methodEntry('create', { name: req.body.name });
    const timer = logger.startTimer('Create Category');

    try {
        const { name } = req.body;
        logger.debug('Creating category', { name });

        // Controller Responsibility: Basic validation
        if (!name) {
            logger.warn('Category creation failed - name required');
            res.json({ error: "Category name is required" });
            return;
        }

        // Controller Responsibility: Delegate to service
        logger.debug('Calling category service to create', { name });
        const category = await categoryService.createCategory(name);

        logger.info('Category created successfully', { categoryId: category.id, name: category.name });
        timer();

        // Controller Responsibility: Return response
        res.json(category);
        logger.methodExit('create', { success: true, categoryId: category.id });
    } catch (error: any) {
        logger.error('Category creation failed', error, { name: req.body.name });
        res.status(400).json({ error: error.message });
        logger.methodExit('create', { success: false, error: error.message });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = req.params;
    logger.methodEntry('update', { categoryId, name: req.body.name });
    const timer = logger.startTimer('Update Category');

    try {
        const { name } = req.body;
        logger.debug('Updating category', { categoryId, name });

        // Controller Responsibility: Basic validation
        if (!name) {
            logger.warn('Category update failed - name required', { categoryId });
            res.json({ error: "Category name is required" });
            return;
        }

        // Controller Responsibility: Delegate to service
        logger.debug('Calling category service to update', { categoryId, name });
        const category = await categoryService.updateCategory(categoryId, name);

        logger.info('Category updated successfully', { categoryId: category.id, name: category.name });
        timer();

        // Controller Responsibility: Return response
        res.json(category);
        logger.methodExit('update', { success: true, categoryId: category.id });
    } catch (error: any) {
        logger.error('Category update failed', error, { categoryId, name: req.body.name });
        res.status(400).json({ error: error.message });
        logger.methodExit('update', { success: false, error: error.message });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = req.params;
    logger.methodEntry('remove', { categoryId });
    const timer = logger.startTimer('Delete Category');

    try {
        logger.debug('Deleting category', { categoryId });

        // Controller Responsibility: Delegate to service
        const removed = await categoryService.deleteCategory(categoryId);

        logger.info('Category deleted successfully', { categoryId });
        timer();

        // Controller Responsibility: Return response
        res.json(removed);
        logger.methodExit('remove', { success: true, categoryId });
    } catch (error: any) {
        logger.error('Category deletion failed', error, { categoryId });
        res.status(400).json({ error: error.message });
        logger.methodExit('remove', { success: false, error: error.message });
    }
};

export const list = async (req: Request, res: Response): Promise<void> => {
    logger.methodEntry('list');
    const timer = logger.startTimer('List Categories');

    try {
        logger.debug('Fetching all categories');

        // Controller Responsibility: Delegate to service
        const categories = await categoryService.getAllCategories();

        logger.info('Categories fetched', { count: categories.length });
        timer();

        // Controller Responsibility: Return response
        res.json(categories);
        logger.methodExit('list', { success: true, count: categories.length });
    } catch (error: any) {
        logger.error('Failed to fetch categories', error);
        res.status(500).json({ error: "Failed to fetch categories" });
        logger.methodExit('list', { success: false, error: error.message });
    }
};

export const read = async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    logger.methodEntry('read', { slug });
    const timer = logger.startTimer('Read Category');

    try {
        logger.debug('Fetching category by slug', { slug });

        // Controller Responsibility: Delegate to service
        const category = await categoryService.getCategoryBySlug(slug);

        logger.info('Category fetched', { categoryId: category.id, slug });
        timer();

        // Controller Responsibility: Return response
        res.json(category);
        logger.methodExit('read', { success: true, categoryId: category.id });
    } catch (error: any) {
        logger.error('Failed to fetch category', error, { slug });
        res.status(400).json({ error: error.message });
        logger.methodExit('read', { success: false, error: error.message });
    }
};

export const productsByCategory = async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    logger.methodEntry('productsByCategory', { slug });
    const timer = logger.startTimer('Get Products by Category');

    try {
        logger.debug('Fetching products for category', { slug });

        // Controller Responsibility: Delegate to service
        const result = await categoryService.getCategoryWithProducts(slug);

        logger.info('Products fetched for category', {
            categoryId: result.category.id,
            slug,
            productCount: result.products.length
        });
        timer();

        // Controller Responsibility: Return response
        res.json(result);
        logger.methodExit('productsByCategory', {
            success: true,
            categoryId: result.category.id,
            productCount: result.products.length
        });
    } catch (error: any) {
        logger.error('Failed to fetch products by category', error, { slug });
        res.status(400).json({ error: error.message });
        logger.methodExit('productsByCategory', { success: false, error: error.message });
    }
};