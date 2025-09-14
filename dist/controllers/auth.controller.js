import { AuthService } from "../services/auth.service.js";
// Dependency Injection: Single service instance
const authService = new AuthService();
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Controller Responsibility: Input validation only
        const validationError = authService.validateRegistrationData(name, email, password);
        if (validationError) {
            res.json({ error: validationError });
            return;
        }
        // Controller Responsibility: Delegate to service
        const result = await authService.registerUser({ name, email, password });
        // Controller Responsibility: Return response
        res.json(result);
    }
    catch (error) {
        // Controller Responsibility: Error handling
        console.log("Register error:", error);
        res.status(400).json({ error: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Controller Responsibility: Input validation only
        const validationError = authService.validateLoginData(email, password);
        if (validationError) {
            res.json({ error: validationError });
            return;
        }
        // Controller Responsibility: Delegate to service
        const result = await authService.loginUser(email, password);
        // Controller Responsibility: Return response
        res.json(result);
    }
    catch (error) {
        // Controller Responsibility: Error handling
        console.log("Login error:", error);
        res.status(400).json({ error: error.message });
    }
};
export const secret = async (req, res) => {
    // Controller Responsibility: Simple response
    res.json({ currentUser: req.user });
};
export const updateProfile = async (req, res) => {
    try {
        const { name, password, address } = req.body;
        const userId = req.user.id;
        // Controller Responsibility: Basic validation
        if (password && password.length < 6) {
            res.json({ error: 'Password is required and should be min 6 characters' });
            return;
        }
        // Controller Responsibility: Delegate to service
        const result = await authService.updateUserProfile(userId, { name, password, address });
        // Controller Responsibility: Return response
        res.json(result);
    }
    catch (error) {
        // Controller Responsibility: Error handling
        console.log("Update profile error:", error);
        res.status(400).json({ error: error.message });
    }
};
export const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        // Controller Responsibility: Delegate to service
        const orders = await authService.getUserOrders(userId);
        // Controller Responsibility: Return response
        res.json(orders);
    }
    catch (error) {
        // Controller Responsibility: Error handling
        console.log("Get orders error:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};
export const allOrders = async (req, res) => {
    try {
        // Controller Responsibility: Delegate to service
        const orders = await authService.getAllOrders();
        // Controller Responsibility: Return response
        res.json(orders);
    }
    catch (error) {
        // Controller Responsibility: Error handling
        console.log("Get all orders error:", error);
        res.status(500).json({ error: "Failed to fetch all orders" });
    }
};
