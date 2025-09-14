// src/controllers/category.controller.ts
import { Request, Response } from "express";
import { CategoryService } from "../services/category.service.js";

// Dependency Injection: Single service instance
const categoryService = new CategoryService();

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;

        // Controller Responsibility: Basic validation
        if (!name) {
            res.json({ error: "Category name is required" });
            return;
        }

        // Controller Responsibility: Delegate to service
        const category = await categoryService.createCategory(name);

        // Controller Responsibility: Return response
        res.json(category);
    } catch (error: any) {
        console.log("Create category error:", error);
        res.status(400).json({ error: error.message });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        const { categoryId } = req.params;

        // Controller Responsibility: Basic validation
        if (!name) {
            res.json({ error: "Category name is required" });
            return;
        }

        // Controller Responsibility: Delegate to service
        const category = await categoryService.updateCategory(categoryId, name);

        // Controller Responsibility: Return response
        res.json(category);
    } catch (error: any) {
        console.log("Update category error:", error);
        res.status(400).json({ error: error.message });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId } = req.params;

        // Controller Responsibility: Delegate to service
        const removed = await categoryService.deleteCategory(categoryId);

        // Controller Responsibility: Return response
        res.json(removed);
    } catch (error: any) {
        console.log("Delete category error:", error);
        res.status(400).json({ error: error.message });
    }
};

export const list = async (req: Request, res: Response): Promise<void> => {
    try {
        // Controller Responsibility: Delegate to service
        const categories = await categoryService.getAllCategories();

        // Controller Responsibility: Return response
        res.json(categories);
    } catch (error: any) {
        console.log("List categories error:", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};

export const read = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;

        // Controller Responsibility: Delegate to service
        const category = await categoryService.getCategoryBySlug(slug);

        // Controller Responsibility: Return response
        res.json(category);
    } catch (error: any) {
        console.log("Read category error:", error);
        res.status(400).json({ error: error.message });
    }
};

export const productsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;

        // Controller Responsibility: Delegate to service
        const result = await categoryService.getCategoryWithProducts(slug);

        // Controller Responsibility: Return response
        res.json(result);
    } catch (error: any) {
        console.log("Products by category error:", error);
        res.status(400).json({ error: error.message });
    }
};