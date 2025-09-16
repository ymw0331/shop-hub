import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Collection } from "../entities/collection.entity.js";
import { Product } from "../entities/product.entity.js";
import { Logger } from "../utils/logger.js";
import slugify from "slugify";

const logger = new Logger('CollectionController');
const collectionRepository = AppDataSource.getRepository(Collection);
const productRepository = AppDataSource.getRepository(Product);

export const getCollections = async (req: Request, res: Response) => {
    try {
        const { active = true, limit = 10 } = req.query;

        const collections = await collectionRepository
            .createQueryBuilder("collection")
            .leftJoinAndSelect("collection.products", "product")
            .leftJoinAndSelect("product.category", "category")
            .where(active ? "collection.active = :active" : "1=1", { active })
            .orderBy("collection.displayOrder", "ASC")
            .addOrderBy("collection.createdAt", "DESC")
            .limit(Number(limit))
            .getMany();

        // Add product count and preview for each collection
        const enrichedCollections = collections.map(collection => ({
            id: collection.id,
            name: collection.name,
            slug: collection.slug,
            description: collection.description,
            imageUrl: collection.imageUrl,
            theme: collection.theme,
            productCount: collection.products?.length || 0,
            products: collection.products?.slice(0, 4) || [],
            active: collection.active
        }));

        res.json(enrichedCollections);
    } catch (error) {
        logger.error('Error fetching collections', error as Error);
        res.status(500).json({ error: "Failed to fetch collections" });
    }
};

export const getCollectionBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        const collection = await collectionRepository
            .createQueryBuilder("collection")
            .leftJoinAndSelect("collection.products", "product")
            .leftJoinAndSelect("product.category", "category")
            .where("collection.slug = :slug", { slug })
            .andWhere("collection.active = :active", { active: true })
            .getOne();

        if (!collection) {
            return res.status(404).json({ error: "Collection not found" });
        }

        res.json(collection);
    } catch (error) {
        logger.error('Error fetching collection', error as Error);
        res.status(500).json({ error: "Failed to fetch collection" });
    }
};

export const createCollection = async (req: Request, res: Response) => {
    try {
        const { name, description, imageUrl, theme, productIds, active = true } = req.body;

        // Check if collection with same name exists
        const existingCollection = await collectionRepository.findOne({
            where: { slug: slugify(name, { lower: true }) }
        });

        if (existingCollection) {
            return res.status(400).json({ error: "Collection with this name already exists" });
        }

        // Get products if IDs provided
        let products: Product[] = [];
        if (productIds && productIds.length > 0) {
            products = await productRepository
                .createQueryBuilder("product")
                .where("product.id IN (:...ids)", { ids: productIds })
                .getMany();
        }

        // Get next display order
        const maxOrderResult = await collectionRepository
            .createQueryBuilder("collection")
            .select("MAX(collection.displayOrder)", "maxOrder")
            .getRawOne();

        const displayOrder = (maxOrderResult?.maxOrder || 0) + 1;

        // Create collection
        const collection = collectionRepository.create({
            name,
            slug: slugify(name, { lower: true }),
            description,
            imageUrl,
            theme,
            products,
            active,
            displayOrder
        });

        await collectionRepository.save(collection);

        res.status(201).json(collection);
    } catch (error) {
        logger.error('Error creating collection', error as Error);
        res.status(500).json({ error: "Failed to create collection" });
    }
};

export const updateCollection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, imageUrl, theme, productIds, active, displayOrder } = req.body;

        const collection = await collectionRepository.findOne({
            where: { id },
            relations: ['products']
        });

        if (!collection) {
            return res.status(404).json({ error: "Collection not found" });
        }

        // Update fields
        if (name) {
            collection.name = name;
            collection.slug = slugify(name, { lower: true });
        }
        if (description !== undefined) collection.description = description;
        if (imageUrl !== undefined) collection.imageUrl = imageUrl;
        if (theme !== undefined) collection.theme = theme;
        if (active !== undefined) collection.active = active;
        if (displayOrder !== undefined) collection.displayOrder = displayOrder;

        // Update products if provided
        if (productIds) {
            collection.products = await productRepository
                .createQueryBuilder("product")
                .where("product.id IN (:...ids)", { ids: productIds })
                .getMany();
        }

        await collectionRepository.save(collection);

        res.json(collection);
    } catch (error) {
        logger.error('Error updating collection', error as Error);
        res.status(500).json({ error: "Failed to update collection" });
    }
};

export const deleteCollection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await collectionRepository.delete(id);

        if (result.affected === 0) {
            return res.status(404).json({ error: "Collection not found" });
        }

        res.json({ success: true, message: "Collection deleted successfully" });
    } catch (error) {
        logger.error('Error deleting collection', error as Error);
        res.status(500).json({ error: "Failed to delete collection" });
    }
};