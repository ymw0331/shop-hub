// Vercel serverless function handler - SIMPLIFIED
const express = require("express");
const { DataSource } = require("typeorm");

// Create Express app
const app = express();

// CORS Headers - Allow everything for now
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

// Body parsing
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
    ssl: process.env.POSTGRES_HOST?.includes('neon.tech') ? {
        rejectUnauthorized: false
    } : false,
    entities: [],
    synchronize: false,
    logging: false
});

// Initialize database
let isDbInitialized = false;
async function initializeDatabase() {
    if (isDbInitialized) return true;

    try {
        await AppDataSource.initialize();
        isDbInitialized = true;
        console.log("Database connected");
        return true;
    } catch (error) {
        console.error("Database connection failed:", error);
        return false;
    }
}

// Simple test endpoint
app.get("/api/test", (req, res) => {
    res.json({
        message: "API is working",
        cors: "enabled",
        timestamp: new Date().toISOString()
    });
});

// Categories endpoint
app.get("/api/categories", async (req, res) => {
    try {
        const connected = await initializeDatabase();
        if (!connected) {
            return res.status(500).json({ error: "Database connection failed" });
        }

        const categories = await AppDataSource.query("SELECT * FROM categories ORDER BY name");
        res.json(categories || []);
    } catch (error) {
        console.error("Categories error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Products endpoint
app.get("/api/products", async (req, res) => {
    try {
        const connected = await initializeDatabase();
        if (!connected) {
            return res.status(500).json({ error: "Database connection failed" });
        }

        const products = await AppDataSource.query(`
            SELECT p.*, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.id DESC
        `);
        res.json(products || []);
    } catch (error) {
        console.error("Products error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        const connected = await initializeDatabase();
        if (!connected) {
            return res.status(500).json({ error: "Database connection failed" });
        }

        const users = await AppDataSource.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // For now, return user without password check
        // You'll need to add bcrypt comparison here
        const user = users[0];

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: "dummy-token" // Add real JWT here
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Register endpoint
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        const connected = await initializeDatabase();
        if (!connected) {
            return res.status(500).json({ error: "Database connection failed" });
        }

        // Check if user exists
        const existing = await AppDataSource.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Create user with UUID
        const id = require('crypto').randomUUID();
        const result = await AppDataSource.query(
            `INSERT INTO users (id, name, email, password, address, role)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [id, name, email, password, address || '', 0]
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
        console.error("Register error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        database: isDbInitialized ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        message: "ShopHub API",
        endpoints: ["/api/health", "/api/products", "/api/categories", "/api/login", "/api/register"]
    });
});

// Catch all
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        path: req.path
    });
});

// Export for Vercel
module.exports = app;