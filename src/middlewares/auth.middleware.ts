
// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository.js";
import { Logger } from "../utils/logger.js";

const userRepository = new UserRepository();
const logger = new Logger('AuthMiddleware');

export const requireSignin = (req: Request, res: Response, next: NextFunction) => {
    logger.methodEntry('requireSignin', { url: req.url, method: req.method });
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        logger.warn('Access denied - no token provided', { url: req.url });
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        logger.debug('Verifying JWT token', { url: req.url });
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        (req as any).user = decoded;
        logger.debug('Token verified successfully', { userId: decoded.id, url: req.url });
        next();
    } catch (error) {
        logger.warn('Invalid token provided', { url: req.url, error: (error as Error).message });
        res.status(400).json({ error: "Invalid token." });
    }
};

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const { userId } = req.params;

    logger.methodEntry('isAuth', { userId, requestUserId: user?.id, url: req.url });

    if (!user || user.id !== userId) {
        logger.warn('Authorization failed - user mismatch', {
            userId,
            requestUserId: user?.id,
            url: req.url
        });
        return res.status(403).json({ error: "Access denied" });
    }

    logger.debug('Authorization successful', { userId, url: req.url });
    next();
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    logger.methodEntry('isAdmin', { userId: (req as any).user?.id, url: req.url });

    try {
        const user = (req as any).user;
        logger.debug('Checking admin privileges', { userId: user.id });

        const foundUser = await userRepository.findById(user.id);

        if (!foundUser || foundUser.role !== 1) {
            logger.warn('Admin access denied', {
                userId: user.id,
                role: foundUser?.role,
                url: req.url
            });
            return res.status(403).json({ error: "Admin access required" });
        }

        logger.debug('Admin access granted', { userId: user.id, url: req.url });
        next();
    } catch (error) {
        logger.error('Error checking admin privileges', error as Error, {
            userId: (req as any).user?.id,
            url: req.url
        });
        res.status(500).json({ error: "Server error" });
    }
};