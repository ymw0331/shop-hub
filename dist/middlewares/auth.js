// src/middlewares/auth.ts
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository.js";
const userRepository = new UserRepository();
export const requireSignin = (req, res, next) => {
    try {
        // Get authorization header
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ error: "No token provided" });
            return;
        }
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.log("Auth middleware error:", err);
        res.status(401).json({ error: "Invalid token" });
    }
};
export const isAdmin = async (req, res, next) => {
    try {
        // Get user from database using new repository
        const user = await userRepository.findById(req.user?.id);
        if (!user) {
            res.status(401).json({ error: "User not found" });
            return;
        }
        if (user.role !== 1) {
            res.status(401).json({ error: "Admin access required" });
            return;
        }
        next();
    }
    catch (err) {
        console.log("Admin middleware error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
