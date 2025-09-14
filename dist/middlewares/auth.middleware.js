import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository.js";
const userRepository = new UserRepository();
export const requireSignin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
};
export const isAuth = (req, res, next) => {
    const user = req.user;
    const { userId } = req.params;
    if (!user || user.id !== userId) {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
};
export const isAdmin = async (req, res, next) => {
    try {
        const user = req.user;
        const foundUser = await userRepository.findById(user.id);
        if (!foundUser || foundUser.role !== 1) {
            return res.status(403).json({ error: "Admin access required" });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
