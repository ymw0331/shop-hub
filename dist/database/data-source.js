// src/database/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
// Industry standard: Environment validation
const requiredEnvVars = [
    "POSTGRES_HOST",
    "POSTGRES_PORT",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_DB",
];
requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
});
export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT || 5432),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    // Industry Standards:
    synchronize: process.env.NODE_ENV === "development", // Never use in production
    logging: process.env.NODE_ENV === "development",
    // Entity and Migration paths
    entities: ["dist/entities/**/*.js"], // Compiled JS for production
    migrations: ["dist/migrations/**/*.js"],
    subscribers: ["dist/subscribers/**/*.js"],
    // Development paths (when using ts-node)
    ...(process.env.NODE_ENV === "development" && {
        entities: ["src/entities/**/*.ts"],
        migrations: ["src/migrations/**/*.ts"],
        subscribers: ["src/subscribers/**/*.ts"],
    }),
    // Connection pool settings (Industry standard for scalability)
    extra: {
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
    },
    // SSL for production
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});
