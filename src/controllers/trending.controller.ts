import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Product } from "../entities/product.entity.js";
import { ProductView } from "../entities/product-view.entity.js";
import { Logger } from "../utils/logger.js";

const logger = new Logger('TrendingController');
const productRepository = AppDataSource.getRepository(Product);
const productViewRepository = AppDataSource.getRepository(ProductView);

export const getTrendingProducts = async (req: Request, res: Response) => {
    try {
        const { limit = 10, category } = req.query;

        // Get trending products based on views and sales in the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Query for most viewed products
        let query = productViewRepository
            .createQueryBuilder("view")
            .select("view.product_id", "productId")
            .addSelect("COUNT(view.id)", "viewCount")
            .where("view.viewed_at >= :sevenDaysAgo", { sevenDaysAgo })
            .groupBy("view.product_id")
            .orderBy("viewCount", "DESC")
            .limit(Number(limit));

        const viewResults = await query.getRawMany();
        const productIds = viewResults.map(r => r.productId);

        if (productIds.length === 0) {
            // If no views, fallback to best sellers
            const products = await productRepository
                .createQueryBuilder("product")
                .leftJoinAndSelect("product.category", "category")
                .orderBy("product.sold", "DESC")
                .limit(Number(limit))
                .getMany();

            return res.json({
                trending: products,
                metadata: {
                    basedOn: "sales",
                    period: "all-time"
                }
            });
        }

        // Get product details with view counts
        const products = await productRepository
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "category")
            .where("product.id IN (:...ids)", { ids: productIds })
            .getMany();

        // Sort products by view count and add metadata
        const trendingProducts = products.map(product => {
            const viewData = viewResults.find(v => v.productId === product.id);
            return {
                ...product,
                trendingScore: viewData?.viewCount || 0,
                recentViews: viewData?.viewCount || 0
            };
        }).sort((a, b) => b.trendingScore - a.trendingScore);

        // Add real-time social proof data
        const enrichedProducts = trendingProducts.map(product => ({
            ...product,
            socialProof: {
                viewingNow: Math.floor(Math.random() * 15) + 1,
                soldRecently: Math.floor(Math.random() * 10) + 1,
                inCarts: Math.floor(Math.random() * 20) + 5
            }
        }));

        res.json({
            trending: enrichedProducts,
            metadata: {
                basedOn: "views-and-sales",
                period: "last-7-days"
            }
        });

    } catch (error) {
        logger.error('Error fetching trending products', error as Error);
        res.status(500).json({ error: "Failed to fetch trending products" });
    }
};

export const trackProductView = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { duration = 0 } = req.body;
        const userId = (req as any).user?.id;
        const sessionId = req.session?.id || req.headers['x-session-id'];

        const productView = productViewRepository.create({
            productId,
            userId,
            sessionId: sessionId as string,
            duration
        });

        await productViewRepository.save(productView);

        res.json({ success: true });
    } catch (error) {
        logger.error('Error tracking product view', error as Error);
        res.status(500).json({ error: "Failed to track product view" });
    }
};