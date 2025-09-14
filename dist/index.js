import "reflect-metadata"; // Must be first to enable typeorm decorators to work
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { AppDataSource } from "./database/data-source.js";
import path from "path";
import authRoutes from "./routes/auth.router.js";
import categoryRoutes from "./routes/category.router.js";
import productRoutes from "./routes/product.router.js";
dotenv.config();
const app = express();
// Industry Standard: Async database initialization
async function startServer() {
    try {
        // Initialize TypeORM connection
        await AppDataSource.initialize();
        console.log("✅ PostgreSQL Connected via TypeORM");
        // Start Express server AFTER database connects
        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log(`🚀 Node server running on port ${port}`);
        });
    }
    catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1); // Exit if database fails
    }
}
// Middleware (same as before)
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
// Register API routes
app.use('/api', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
// Serve uploaded photos statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
startServer();
// Optional: Graceful shutdown (production best practice)
process.on('SIGTERM', async () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    await AppDataSource.destroy();
    process.exit(0);
});
