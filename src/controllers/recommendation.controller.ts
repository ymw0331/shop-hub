import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Product } from "../entities/product.entity.js";
import { UserPreference } from "../entities/user-preference.entity.js";
import { ProductView } from "../entities/product-view.entity.js";
import { Order } from "../entities/order.entity.js";
import { Logger } from "../utils/logger.js";

const logger = new Logger('RecommendationController');
const productRepository = AppDataSource.getRepository(Product);
const userPreferenceRepository = AppDataSource.getRepository(UserPreference);
const productViewRepository = AppDataSource.getRepository(ProductView);
const orderRepository = AppDataSource.getRepository(Order);

export const getPersonalizedRecommendations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const { limit = 8 } = req.query;

        if (!userId) {
            // For non-authenticated users, return popular products
            const popularProducts = await productRepository
                .createQueryBuilder("product")
                .leftJoinAndSelect("product.category", "category")
                .orderBy("product.sold", "DESC")
                .limit(Number(limit))
                .getMany();

            return res.json({
                recommendations: popularProducts,
                type: "popular"
            });
        }

        // Get user preferences
        let userPreference = await userPreferenceRepository.findOne({
            where: { userId }
        });

        // Get user's view history
        const recentViews = await productViewRepository
            .createQueryBuilder("view")
            .leftJoinAndSelect("view.product", "product")
            .leftJoinAndSelect("product.category", "category")
            .where("view.user_id = :userId", { userId })
            .orderBy("view.viewed_at", "DESC")
            .limit(20)
            .getMany();

        // Get user's purchase history
        const orders = await orderRepository
            .createQueryBuilder("order")
            .leftJoinAndSelect("order.products", "product")
            .leftJoinAndSelect("product.category", "category")
            .where("order.buyer_id = :userId", { userId })
            .getMany();

        const purchasedProducts = orders.flatMap(order => order.products || []);

        // Extract categories from history
        const viewedCategories = recentViews.map(v => v.product?.category?.id).filter(Boolean);
        const purchasedCategories = purchasedProducts.map(p => p.category?.id).filter(Boolean);
        const allCategories = [...new Set([...viewedCategories, ...purchasedCategories])];

        // Build recommendation query
        let recommendationQuery = productRepository
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "category");

        if (allCategories.length > 0) {
            // Recommend products from similar categories
            recommendationQuery = recommendationQuery
                .where("product.categoryId IN (:...categories)", { categories: allCategories });
        }

        // Exclude already viewed products
        const viewedProductIds = recentViews.map(v => v.product?.id).filter(Boolean);
        if (viewedProductIds.length > 0) {
            recommendationQuery = recommendationQuery
                .andWhere("product.id NOT IN (:...viewed)", { viewed: viewedProductIds });
        }

        // Get recommendations
        const recommendations = await recommendationQuery
            .orderBy("product.sold", "DESC")
            .addOrderBy("product.createdAt", "DESC")
            .limit(Number(limit))
            .getMany();

        // Update user preferences if not exists
        if (!userPreference && allCategories.length > 0) {
            userPreference = userPreferenceRepository.create({
                userId,
                categories: allCategories as string[],
                viewHistory: recentViews.slice(0, 10).map(v => ({
                    productId: v.product.id,
                    viewedAt: v.viewedAt
                }))
            });
            await userPreferenceRepository.save(userPreference);
        }

        res.json({
            recommendations,
            type: "personalized",
            basedOn: {
                viewHistory: viewedProductIds.length,
                purchaseHistory: purchasedProducts.length,
                categories: allCategories.length
            }
        });

    } catch (error) {
        logger.error('Error fetching personalized recommendations', error as Error);
        res.status(500).json({ error: "Failed to fetch recommendations" });
    }
};

export const updateUserPreferences = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const { categories, brands, priceRange } = req.body;

        if (!userId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        let userPreference = await userPreferenceRepository.findOne({
            where: { userId }
        });

        if (!userPreference) {
            userPreference = userPreferenceRepository.create({
                userId,
                categories,
                brands,
                priceRange
            });
        } else {
            userPreference.categories = categories || userPreference.categories;
            userPreference.brands = brands || userPreference.brands;
            userPreference.priceRange = priceRange || userPreference.priceRange;
        }

        await userPreferenceRepository.save(userPreference);

        res.json({ success: true, preferences: userPreference });
    } catch (error) {
        logger.error('Error updating user preferences', error as Error);
        res.status(500).json({ error: "Failed to update preferences" });
    }
};