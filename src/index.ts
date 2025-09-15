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
// Configure CORS with specific options
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://shop-hub-pied-zeta.vercel.app',
    'https://shop-hub-frontend.vercel.app',
    'https://shop-hub.vercel.app',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all for development, remove in production to restrict
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

// Register API routes
logger.info('Registering API routes');
app.use('/api', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

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