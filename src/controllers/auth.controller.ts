// src/controllers/auth.ts
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { Logger } from "../utils/logger.js";

// Dependency Injection: Single service instance
const authService = new AuthService();
const logger = new Logger('AuthController');

export const register = async (req: Request, res: Response): Promise<void> => {
    logger.methodEntry('register', { email: req.body.email, name: req.body.name });
    const timer = logger.startTimer('User Registration');

    try {
        const { name, email, password } = req.body;
        logger.debug('Registration attempt', { email, name });

        // Controller Responsibility: Input validation only
        const validationError = authService.validateRegistrationData(name, email, password);
        if (validationError) {
            logger.warn('Registration validation failed', { email, error: validationError });
            res.json({ error: validationError });
            return;
        }

        // Controller Responsibility: Delegate to service
        logger.debug('Calling registration service', { email });
        const result = await authService.registerUser({ name, email, password });

        logger.info('User registered successfully', { userId: result.user.id, email });
        timer();

        // Controller Responsibility: Return response
        res.json(result);
        logger.methodExit('register', { success: true });
    } catch (error: any) {
        // Controller Responsibility: Error handling
        logger.error('Registration failed', error, { email: req.body.email });
        res.status(400).json({ error: error.message });
        logger.methodExit('register', { success: false, error: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    logger.methodEntry('login', { email: req.body.email });
    const timer = logger.startTimer('User Login');

    try {
        const { email, password } = req.body;
        logger.debug('Login attempt', { email });

        // Controller Responsibility: Input validation only
        const validationError = authService.validateLoginData(email, password);
        if (validationError) {
            logger.warn('Login validation failed', { email, error: validationError });
            res.json({ error: validationError });
            return;
        }

        // Controller Responsibility: Delegate to service
        logger.debug('Calling login service', { email });
        const result = await authService.loginUser(email, password);

        logger.info('User logged in successfully', { userId: result.user.id, email });
        timer();

        // Controller Responsibility: Return response
        res.json(result);
        logger.methodExit('login', { success: true });
    } catch (error: any) {
        // Controller Responsibility: Error handling
        logger.error('Login failed', error, { email: req.body.email });
        res.status(400).json({ error: error.message });
        logger.methodExit('login', { success: false, error: error.message });
    }
};

export const secret = async (req: Request, res: Response): Promise<void> => {
    logger.methodEntry('secret', { userId: (req as any).user?.id });
    // Controller Responsibility: Simple response
    res.json({ currentUser: (req as any).user });
    logger.debug('Secret endpoint accessed', { userId: (req as any).user?.id });
    logger.methodExit('secret', { success: true });
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.id;
    logger.methodEntry('updateProfile', { userId, updates: { name: req.body.name, address: req.body.address } });
    const timer = logger.startTimer('Profile Update');

    try {
        const { name, password, address } = req.body;
        logger.debug('Profile update request', { userId, hasPassword: !!password, hasName: !!name, hasAddress: !!address });

        // Controller Responsibility: Basic validation
        if (password && password.length < 6) {
            logger.warn('Profile update validation failed', { userId, error: 'Password too short' });
            res.json({ error: 'Password is required and should be min 6 characters' });
            return;
        }

        // Controller Responsibility: Delegate to service
        logger.debug('Calling profile update service', { userId });
        const result = await authService.updateUserProfile(userId, { name, password, address });

        logger.info('Profile updated successfully', { userId });
        timer();

        // Controller Responsibility: Return response
        res.json(result);
        logger.methodExit('updateProfile', { success: true });
    } catch (error: any) {
        // Controller Responsibility: Error handling
        logger.error('Profile update failed', error, { userId });
        res.status(400).json({ error: error.message });
        logger.methodExit('updateProfile', { success: false, error: error.message });
    }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.id;
    logger.methodEntry('getOrders', { userId });
    const timer = logger.startTimer('Fetch User Orders');

    try {
        // Controller Responsibility: Delegate to service
        logger.debug('Fetching user orders', { userId });
        const orders = await authService.getUserOrders(userId);

        logger.info('User orders fetched', { userId, orderCount: orders.length });
        timer();

        // Controller Responsibility: Return response
        res.json(orders);
        logger.methodExit('getOrders', { success: true, count: orders.length });
    } catch (error: any) {
        // Controller Responsibility: Error handling
        logger.error('Failed to fetch user orders', error, { userId });
        res.status(500).json({ error: "Failed to fetch orders" });
        logger.methodExit('getOrders', { success: false, error: error.message });
    }
};

export const allOrders = async (req: Request, res: Response): Promise<void> => {
    logger.methodEntry('allOrders', { adminId: (req as any).user?.id });
    const timer = logger.startTimer('Fetch All Orders');

    try {
        // Controller Responsibility: Delegate to service
        logger.debug('Fetching all orders for admin');
        const orders = await authService.getAllOrders();

        logger.info('All orders fetched', { orderCount: orders.length });
        timer();

        // Controller Responsibility: Return response
        res.json(orders);
        logger.methodExit('allOrders', { success: true, count: orders.length });
    } catch (error: any) {
        // Controller Responsibility: Error handling
        logger.error('Failed to fetch all orders', error);
        res.status(500).json({ error: "Failed to fetch all orders" });
        logger.methodExit('allOrders', { success: false, error: error.message });
    }
};

// Route protection endpoints for frontend route guards
export const authCheck = async (req: Request, res: Response): Promise<void> => {
    logger.methodEntry('authCheck', { userId: (req as any).user?.id });

    try {
        // If we reach here, the user passed requireSignin middleware
        logger.debug('Auth check passed', { userId: (req as any).user?.id });
        res.json({ ok: true });
        logger.methodExit('authCheck', { success: true });
    } catch (error: any) {
        logger.error('Auth check failed', error, { userId: (req as any).user?.id });
        res.status(500).json({ ok: false, error: "Auth check failed" });
        logger.methodExit('authCheck', { success: false, error: error.message });
    }
};

export const adminCheck = async (req: Request, res: Response): Promise<void> => {
    logger.methodEntry('adminCheck', { userId: (req as any).user?.id });

    try {
        // If we reach here, the user passed requireSignin + isAdmin middleware
        logger.debug('Admin check passed', { userId: (req as any).user?.id });
        res.json({ ok: true });
        logger.methodExit('adminCheck', { success: true });
    } catch (error: any) {
        logger.error('Admin check failed', error, { userId: (req as any).user?.id });
        res.status(500).json({ ok: false, error: "Admin check failed" });
        logger.methodExit('adminCheck', { success: false, error: error.message });
    }
};