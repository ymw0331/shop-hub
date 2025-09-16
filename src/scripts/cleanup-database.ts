// src/scripts/cleanup-database.ts
import "reflect-metadata";
import { AppDataSource } from "../database/data-source.js";
import { Logger } from "../utils/logger.js";

const logger = new Logger('CleanupDatabase');

async function cleanupDatabase() {
    try {
        logger.info('🧹 Starting database cleanup process...');

        // Initialize the database connection
        if (!AppDataSource.isInitialized) {
            logger.info('Initializing database connection...');
            await AppDataSource.initialize();
        }

        // Get the query runner for raw SQL operations
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            logger.info('Disabling foreign key constraints...');
            await queryRunner.query('SET foreign_key_checks = 0');

            // Drop all tables in the correct order (reverse dependency order)
            const tablesToDrop = [
                'order_products_product',  // Join table
                'order',
                'product',
                'category',
                'user'
            ];

            for (const table of tablesToDrop) {
                try {
                    logger.info(`Dropping table: ${table}`);
                    await queryRunner.query(`DROP TABLE IF EXISTS \`${table}\``);
                } catch (error) {
                    logger.warn(`Could not drop table ${table}:`, error as Error);
                }
            }

            logger.info('Re-enabling foreign key constraints...');
            await queryRunner.query('SET foreign_key_checks = 1');

            logger.info('✅ All tables dropped successfully');

        } finally {
            await queryRunner.release();
        }

        // Synchronize to recreate all tables with fresh schema
        logger.info('Recreating database schema...');
        await AppDataSource.synchronize(true); // force recreate

        logger.info('=================================');
        logger.info('🎉 Database Cleanup Complete!');
        logger.info('=================================');
        logger.info('✅ All tables dropped and recreated');
        logger.info('✅ Schema synchronized');
        logger.info('✅ Ready for fresh seeding');
        logger.info('=================================');

        // Close the database connection
        await AppDataSource.destroy();
        logger.info('Database connection closed.');

    } catch (error) {
        logger.error('Failed to cleanup database', error as Error);
        process.exit(1);
    }
}

// Run the script
cleanupDatabase()
    .then(() => {
        logger.info('Database cleanup script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        logger.error('Database cleanup script failed', error);
        process.exit(1);
    });