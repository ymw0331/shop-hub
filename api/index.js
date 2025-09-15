require("reflect-metadata");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

// We'll initialize these after the build
let AppDataSource;
let authRoutes;
let categoryRoutes;
let productRoutes;
let Logger;
let logger;

// Initialize imports
async function initializeImports() {
    if (!AppDataSource) {
        const dataSourceModule = await import("../dist/database/data-source.js");
        AppDataSource = dataSourceModule.AppDataSource;

        const authModule = await import("../dist/routes/auth.router.js");
        authRoutes = authModule.default;

        const categoryModule = await import("../dist/routes/category.router.js");
        categoryRoutes = categoryModule.default;

        const productModule = await import("../dist/routes/product.router.js");
        productRoutes = productModule.default;

        const loggerModule = await import("../dist/utils/logger.js");
        Logger = loggerModule.Logger;
        logger = new Logger('Server');

        // Log server initialization
        logger.info('Starting E-Commerce Hub Server (Vercel)', {
            nodeVersion: process.version,
            env: process.env.NODE_ENV || 'production'
        });
    }
}

// Initialize database connection on first request
let isDbInitialized = false;

async function initializeDatabase() {
    if (isDbInitialized) return;

    try {
        await initializeImports();
        logger.info('Initializing database connection...');
        await AppDataSource.initialize();
        isDbInitialized = true;
        logger.info('✅ PostgreSQL Connected via TypeORM', {
            database: process.env.POSTGRES_DB,
            host: process.env.POSTGRES_HOST
        });
    } catch (error) {
        console.error("❌ Database connection failed", error);
        throw error;
    }
}

// Configure CORS with specific options
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(morgan("dev"));
app.use(express.json());

// Middleware to ensure DB is initialized
app.use(async (req, res, next) => {
    try {
        await initializeDatabase();

        // Log middleware
        if (logger) {
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
        }

        next();
    } catch (error) {
        console.error('Initialization error:', error);
        res.status(500).json({
            error: 'Server initialization failed',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Register API routes - will be set after initialization
app.use('/api', (req, res, next) => {
    if (!authRoutes || !categoryRoutes || !productRoutes) {
        return res.status(503).json({ error: 'Server is starting up, please try again' });
    }
    next();
});

app.use('/api', (req, res, next) => authRoutes ? authRoutes(req, res, next) : next());
app.use('/api', (req, res, next) => categoryRoutes ? categoryRoutes(req, res, next) : next());
app.use('/api', (req, res, next) => productRoutes ? productRoutes(req, res, next) : next());

// Serve uploaded photos statically
const uploadsPath = path.join(path.dirname(__dirname), 'public', 'uploads');
app.use('/api/uploads', express.static(uploadsPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        database: isDbInitialized ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Export for Vercel
module.exports = app;