import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { AppDataSource } from "../dist/database/data-source.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from "../dist/routes/auth.router.js";
import categoryRoutes from "../dist/routes/category.router.js";
import productRoutes from "../dist/routes/product.router.js";
import { Logger } from "../dist/utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();
const logger = new Logger('Server');

// Log server initialization
logger.info('Starting E-Commerce Hub Server (Vercel)', {
    nodeVersion: process.version,
    env: process.env.NODE_ENV || 'production'
});

// Initialize database connection on first request
let isDbInitialized = false;

async function initializeDatabase() {
    if (isDbInitialized) return;

    try {
        logger.info('Initializing database connection...');
        await AppDataSource.initialize();
        isDbInitialized = true;
        logger.info('✅ PostgreSQL Connected via TypeORM', {
            database: process.env.POSTGRES_DB,
            host: process.env.POSTGRES_HOST
        });
    } catch (error) {
        logger.error("❌ Database connection failed", error);
        throw error;
    }
}

// Middleware to ensure DB is initialized
app.use(async (req, res, next) => {
    try {
        await initializeDatabase();
        next();
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Configure CORS with specific options
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(morgan("dev"));
app.use(express.json());

// Log middleware
app.use((req, res, next) => {
    logger.request(req.method, req.url, req.body, req.query);
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.response(res.statusCode, {
            method: req.method,
            url: req.url,
            duration: `${duration}ms`
        });
    });

    next();
});

// Register API routes
logger.info('Registering API routes');
app.use('/api', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

// Serve uploaded photos statically
const uploadsPath = path.join(dirname(__dirname), 'public', 'uploads');
app.use('/api/uploads', express.static(uploadsPath));
logger.info('Static file serving configured', { path: '/api/uploads' });

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        database: isDbInitialized ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Export for Vercel
export default app;