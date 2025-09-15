// src/scripts/populate-product-images.ts
import "reflect-metadata";
import { AppDataSource } from "../database/data-source.js";
import { Product } from "../entities/product.entity.js";
import { Logger } from "../utils/logger.js";
import fs from "fs";
import path from "path";
import slugify from "slugify";

const logger = new Logger('PopulateProductImages');

async function populateProductImages() {
    try {
        logger.info('Starting product image population process...');

        // Initialize database connection
        if (!AppDataSource.isInitialized) {
            logger.info('Initializing database connection...');
            await AppDataSource.initialize();
        }

        const productRepository = AppDataSource.getRepository(Product);

        // Get all products from database
        const products = await productRepository.find();
        logger.info(`Found ${products.length} products in database`);

        // Check if images directory exists
        const imagesDir = path.join(process.cwd(), 'public', 'uploads', 'products');
        if (!fs.existsSync(imagesDir)) {
            logger.error('Images directory does not exist', new Error('Directory not found'));
            logger.info('Creating images directory...');
            fs.mkdirSync(imagesDir, { recursive: true });
        }

        // Get all image files
        const imageFiles = fs.readdirSync(imagesDir).filter(file => {
            return file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.webp');
        });
        logger.info(`Found ${imageFiles.length} image files in ${imagesDir}`);

        let updatedCount = 0;
        let notFoundCount = 0;
        const notFoundProducts: string[] = [];

        // Process each product
        for (const product of products) {
            // Generate possible image filenames based on product name
            const productSlug = slugify(product.name, { lower: true, strict: true });

            // Try to find matching image file
            let matchedImage = null;

            // Try exact slug match first
            matchedImage = imageFiles.find(img => img.toLowerCase().includes(productSlug));

            // If no exact match, try partial matches
            if (!matchedImage) {
                const nameParts = product.name.toLowerCase().split(' ');
                matchedImage = imageFiles.find(img => {
                    const imgLower = img.toLowerCase();
                    return nameParts.length >= 2 &&
                           nameParts.slice(0, 2).every(part => imgLower.includes(part));
                });
            }

            if (matchedImage) {
                // Update product with image path
                const photoPath = `/uploads/products/${matchedImage}`;
                const contentType = matchedImage.endsWith('.png') ? 'image/png' :
                                   matchedImage.endsWith('.webp') ? 'image/webp' : 'image/jpeg';

                await productRepository.update(product.id, {
                    photoPath: photoPath,
                    photoContentType: contentType
                });

                logger.info(`✅ Updated product "${product.name}" with image: ${matchedImage}`);
                updatedCount++;
            } else {
                notFoundProducts.push(product.name);
                notFoundCount++;
                logger.warn(`⚠️ No image found for product: ${product.name} (tried: ${productSlug})`);
            }
        }

        // Summary
        logger.info('='.repeat(50));
        logger.info('📊 Image Population Summary:');
        logger.info(`✅ Successfully updated: ${updatedCount} products`);
        logger.info(`⚠️ No image found for: ${notFoundCount} products`);

        if (notFoundProducts.length > 0 && notFoundProducts.length <= 20) {
            logger.info('Products without images:');
            notFoundProducts.forEach(name => logger.info(`  - ${name}`));
        } else if (notFoundProducts.length > 20) {
            logger.info(`Products without images (showing first 20 of ${notFoundProducts.length}):`);
            notFoundProducts.slice(0, 20).forEach(name => logger.info(`  - ${name}`));
        }

        // Generate placeholder images for products without images (optional)
        if (notFoundCount > 0) {
            logger.info('');
            logger.info('💡 Tip: You can generate placeholder images for missing products');
            logger.info('   or download them from image services like Unsplash or Lorem Picsum');
        }

        logger.info('='.repeat(50));
        logger.info('✨ Product image population completed!');

    } catch (error) {
        logger.error('Failed to populate product images', error as Error);
        process.exit(1);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

// Execute the script
populateProductImages().catch(error => {
    logger.error('Unhandled error in populate-product-images', error);
    process.exit(1);
});