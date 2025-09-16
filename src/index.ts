import "reflect-metadata"; // Must be first to enable typeorm decorators to work
import express from "express";
import dotenv from "dotenv"
import morgan from "morgan";
import cors from "cors";
import { AppDataSource } from "./database/data-source.js";
import path from "path";
import authRoutes from "./routes/auth.router.js";
import categoryRoutes from "./routes/category.router.js";
import productRoutes from "./routes/product.router.js";
import trendingRoutes from "./routes/trending.router.js";
import recommendationRoutes from "./routes/recommendation.router.js";
import collectionRoutes from "./routes/collection.router.js";
import newsletterRoutes from "./routes/newsletter.router.js";
import { Logger } from "./utils/logger.js";


dotenv.config();
const app = express();
const logger = new Logger('Server');

// Log server initialization
logger.info('Starting E-Commerce Hub Server', {
    nodeVersion: process.version,
    env: process.env.NODE_ENV || 'development'
});

// Industry Standard: Async database initialization
async function startServer() {
    const startTimer = logger.startTimer('Server Startup');

    try {
        logger.info('Initializing database connection...');
        // Initialize TypeORM connection
        await AppDataSource.initialize();
        logger.info('✅ PostgreSQL Connected via TypeORM', {
            database: process.env.DB_NAME,
            host: process.env.DB_HOST
        });

        // Start Express server AFTER database connects
        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            logger.info(`🚀 Node server running on port ${port}`, {
                port,
                environment: process.env.NODE_ENV || 'development'
            });
            startTimer(); // Log startup duration
        });

    } catch (error) {
        logger.error("❌ Database connection failed", error as Error);
        process.exit(1); // Exit if database fails
    }
}

// Initialize database connection for Vercel
let dbInitialized = false;
async function ensureDbConnection() {
    if (!dbInitialized) {
        try {
            await AppDataSource.initialize();
            dbInitialized = true;
            logger.info('✅ Database connected for Vercel');
        } catch (error) {
            logger.error('Database connection failed', error as Error);
            throw error;
        }
    }
}

// Database middleware for Vercel
if (process.env.VERCEL) {
    app.use(async (req, res, next) => {
        try {
            await ensureDbConnection();
            next();
        } catch (error) {
            res.status(500).json({ error: 'Database connection failed' });
        }
    });
}

// Middleware (same as before)
// Configure CORS with environment-based options
const getCorsOrigins = () => {
    const origins = [];

    // Add production URLs from environment
    if (process.env.FRONTEND_URL) {
        origins.push(process.env.FRONTEND_URL);
    }
    if (process.env.BACKEND_URL) {
        origins.push(process.env.BACKEND_URL);
    }

    // Add development URLs
    if (process.env.NODE_ENV === 'development') {
        origins.push('http://localhost:3000');
        origins.push('http://localhost:3001');
    }

    // Add any additional allowed origins from env (comma-separated)
    if (process.env.CORS_ALLOWED_ORIGINS) {
        const additionalOrigins = process.env.CORS_ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
        origins.push(...additionalOrigins);
    }

    // Legacy support
    if (process.env.CLIENT_URL) {
        origins.push(process.env.CLIENT_URL);
    }

    return origins.filter(Boolean);
};

const allowedOrigins = getCorsOrigins();

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // In production, restrict to allowed origins only
            if (process.env.NODE_ENV === 'production') {
                callback(new Error('Not allowed by CORS'));
            } else {
                // In development, allow all origins
                callback(null, true);
            }
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    exposedHeaders: ["Authorization"],
    maxAge: 86400
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

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: AppDataSource.isInitialized ? 'connected' : 'disconnected'
    });
});

// Register API routes
logger.info('Registering API routes');
app.use('/api', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', trendingRoutes);
app.use('/api', recommendationRoutes);
app.use('/api', collectionRoutes);
app.use('/api', newsletterRoutes);

// Serve uploaded photos statically under /api
app.use('/api/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
logger.info('Static file serving configured', { path: '/api/uploads' });

// For Vercel deployment, export the app without starting the server
// Only start the server if not in Vercel environment
if (!process.env.VERCEL) {
    startServer();
}

// Export the app for Vercel
export default app;

// Optional: Graceful shutdown (production best practice)
process.on('SIGTERM', async () => {
    logger.warn('🛑 SIGTERM received, shutting down gracefully');
    try {
        await AppDataSource.destroy();
        logger.info('Database connection closed');
        process.exit(0);
    } catch (error) {
        logger.error('Error during graceful shutdown', error as Error);
        process.exit(1);
    }
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', reason as Error, { promise });
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});