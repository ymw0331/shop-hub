// Vercel serverless function handler
require("reflect-metadata");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const { DataSource } = require("typeorm");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// CRITICAL: Handle OPTIONS requests FIRST before anything else
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    res.sendStatus(200);
});

// Configure CORS properly
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://shop-hub-pied-zeta.vercel.app',
    process.env.CLIENT_URL
].filter(Boolean);

// Handle OPTIONS preflight BEFORE other middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;

    // Set CORS headers for all requests
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Max-Age', '86400');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// Also use cors middleware as backup
app.use(cors({
    origin: true, // Allow all origins temporarily to fix the issue
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    exposedHeaders: ["Authorization"],
    optionsSuccessStatus: 200
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create TypeORM DataSource
const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT || 5432),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: process.env.POSTGRES_SSL === 'true' || process.env.POSTGRES_HOST?.includes('neon.tech') ? {
        rejectUnauthorized: false
    } : false,
    entities: [],
    synchronize: false,
    logging: false
});

// Initialize database connection
let isDbInitialized = false;
async function initializeDatabase() {
    if (isDbInitialized) return;

    try {
        await AppDataSource.initialize();
        isDbInitialized = true;
        console.log("✅ Database connected");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        throw error;
    }
}

// Database middleware
app.use(async (req, res, next) => {
    try {
        await initializeDatabase();
        next();
    } catch (error) {
        res.status(500).json({
            error: 'Database connection failed',
            message: error.message
        });
    }
});

// JWT Helper
const requireSignIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

// Admin middleware
const isAdmin = async (req, res, next) => {
    try {
        const user = await AppDataSource.query(
            "SELECT * FROM users WHERE id = $1",
            [req.user.id]
        );
        if (user[0]?.role !== 1) {
            return res.status(403).json({ error: "Unauthorized access" });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: "Error checking admin status" });
    }
};

// Auth Routes
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Check if user exists
        const existing = await AppDataSource.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with UUID
        const id = require('crypto').randomUUID();
        const result = await AppDataSource.query(
            `INSERT INTO users (id, name, email, password, address, role)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [id, name, email, hashedPassword, address, 0]
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: result[0].id,
                name: result[0].name,
                email: result[0].email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const users = await AppDataSource.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = users[0];

        // Check password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Category Routes
app.get("/api/categories", async (req, res) => {
    try {
        const categories = await AppDataSource.query("SELECT * FROM categories ORDER BY name");
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/category", requireSignIn, isAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        const slug = name.toLowerCase().replace(/ /g, "-");
        const id = require('crypto').randomUUID();

        const result = await AppDataSource.query(
            `INSERT INTO categories (id, name, slug) VALUES ($1, $2, $3) RETURNING *`,
            [id, name, slug]
        );

        res.status(201).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Product Routes
app.get("/api/products", async (req, res) => {
    try {
        const products = await AppDataSource.query(`
            SELECT p.*, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.id DESC
        `);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/product/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const products = await AppDataSource.query(
            `SELECT p.*, c.name as category_name
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE p.slug = $1`,
            [slug]
        );

        if (products.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(products[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/product", requireSignIn, isAdmin, async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.body;
        const slug = name.toLowerCase().replace(/ /g, "-");
        const id = require('crypto').randomUUID();

        const result = await AppDataSource.query(
            `INSERT INTO products (id, name, slug, description, price, category_id, quantity, shipping)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [id, name, slug, description, price, category, quantity, shipping]
        );

        res.status(201).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Order Routes
app.get("/api/orders", requireSignIn, async (req, res) => {
    try {
        const orders = await AppDataSource.query(
            `SELECT * FROM orders WHERE buyer_id = $1 ORDER BY id DESC`,
            [req.user.id]
        );
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        database: isDbInitialized ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "production"
    });
});

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        message: "ShopHub API is running",
        endpoints: {
            health: "/api/health",
            products: "/api/products",
            categories: "/api/categories",
            auth: {
                register: "/api/register",
                login: "/api/login"
            }
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        path: req.path,
        method: req.method
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        error: "Internal Server Error",
        message: err.message
    });
});

// Export for Vercel
module.exports = app;