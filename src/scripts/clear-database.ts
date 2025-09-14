// src/scripts/clear-database.ts
import "reflect-metadata";
import { AppDataSource } from "../database/data-source.js";
import { Logger } from "../utils/logger.js";
import { User } from "../entities/user.entity.js";
import { Category } from "../entities/category.entity.js";
import { Product } from "../entities/product.entity.js";
import { Order } from "../entities/order.entity.js";

const logger = new Logger('ClearDatabase');

async function clearDatabase() {
    try {
        logger.info('Starting database clearing process...');

        // Initialize the database connection
        if (!AppDataSource.isInitialized) {
            logger.info('Initializing database connection...');
            await AppDataSource.initialize();
        }

        // Use query runner to handle foreign key constraints properly
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            // Disable foreign key checks temporarily (PostgreSQL method)
            logger.info('Disabling foreign key constraints...');
            await queryRunner.startTransaction();

            // Clear tables using DELETE to avoid foreign key issues
            // Delete in correct order: junction tables first, then dependent tables

            // If there's a junction table for order_products, clear it first
            logger.info('Checking for order_products junction table...');
            const hasOrderProducts = await queryRunner.hasTable('order_products');
            if (hasOrderProducts) {
                logger.info('Clearing order_products junction table...');
                await queryRunner.query('DELETE FROM order_products');
            }

            // Clear Orders (references users and contains products)
            logger.info('Clearing Orders table...');
            await queryRunner.query('DELETE FROM orders');
            const orderCount = await AppDataSource.getRepository(Order).count();
            logger.info(`Orders cleared. Remaining count: ${orderCount}`);

            // Clear Products (references categories)
            logger.info('Clearing Products table...');
            await queryRunner.query('DELETE FROM products');
            const productCount = await AppDataSource.getRepository(Product).count();
            logger.info(`Products cleared. Remaining count: ${productCount}`);

            // Clear Categories (no dependencies)
            logger.info('Clearing Categories table...');
            await queryRunner.query('DELETE FROM categories');
            const categoryCount = await AppDataSource.getRepository(Category).count();
            logger.info(`Categories cleared. Remaining count: ${categoryCount}`);

            // Clear Users (no dependencies after orders are deleted)
            logger.info('Clearing Users table...');
            await queryRunner.query('DELETE FROM users');
            const userCount = await AppDataSource.getRepository(User).count();
            logger.info(`Users cleared. Remaining count: ${userCount}`);

            // Commit the transaction
            await queryRunner.commitTransaction();
            logger.info('✅ All database tables have been cleared successfully!');

        } catch (error) {
            // Rollback transaction on error
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Release the query runner
            await queryRunner.release();
        }

        // Close the database connection
        await AppDataSource.destroy();
        logger.info('Database connection closed.');

    } catch (error) {
        logger.error('Failed to clear database', error as Error);
        process.exit(1);
    }
}

// Run the script
clearDatabase()
    .then(() => {
        logger.info('Database clearing script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        logger.error('Database clearing script failed', error);
        process.exit(1);
    });