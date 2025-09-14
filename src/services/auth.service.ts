// src/services/AuthService.ts
import { UserRepository } from "../repositories/user.repository.js";
import { OrderRepository } from "../repositories/order.repository.js";
import { hashPassword, comparePassword } from "../helpers/auth.helper.js";
import {
    validateRegistrationData,
    validateLoginData,
    validateProfileData,
    sanitizeName,
    sanitizeEmail,
    sanitizeAddress
} from "../helpers/validation.js";
import { CreateUserDto } from "../types/index.js";
import jwt from "jsonwebtoken";



export class AuthService {
    private userRepository: UserRepository;
    private orderRepository: OrderRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.orderRepository = new OrderRepository();
    }

    // Business Logic: User Registration
    async registerUser(userData: CreateUserDto): Promise<{ user: any; token: string }> {
        const { name, email, password } = userData;

        // Enhanced validation with detailed error messages
        const validation = validateRegistrationData(name, email, password);
        if (!validation.isValid) {
            throw new Error(validation.errors.join(". "));
        }

        // Sanitize input data
        const sanitizedEmail = sanitizeEmail(email);
        const sanitizedName = sanitizeName(name);

        // Business Logic: Check if email exists
        const existingUser = await this.userRepository.findByEmail(sanitizedEmail);
        if (existingUser) {
            throw new Error("Email is already registered");
        }

        // Business Logic: Hash password
        const hashedPassword = await hashPassword(password);

        // Business Logic: Create user with sanitized data
        const user = await this.userRepository.createUser({
            name: sanitizedName,
            email: sanitizedEmail,
            password: hashedPassword,
            role: 0, // Default role: 0 = regular user, 1 = admin
        });

        // Business Logic: Generate JWT
        const token = this.generateToken(user.id);

        return {
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
            },
            token,
        };
    }

    // Enhanced Business Logic: User Login
    async loginUser(email: string, password: string): Promise<{ user: any; token: string }> {
        // Enhanced validation
        const validation = validateLoginData(email, password);
        if (!validation.isValid) {
            throw new Error(validation.errors.join(". "));
        }

        // Sanitize input
        const sanitizedEmail = sanitizeEmail(email);

        // Business Logic: Find user
        const user = await this.userRepository.findByEmail(sanitizedEmail);
        if (!user) {
            throw new Error("Invalid email or password"); // Security: Don't reveal which is wrong
        }

        // Business Logic: Verify password
        const match = await comparePassword(password, user.password);
        if (!match) {
            throw new Error("Invalid email or password"); // Security: Same error message
        }

        // Business Logic: Generate JWT
        const token = this.generateToken(user.id);

        return {
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
            },
            token,
        };
    }

    // Enhanced Business Logic: Update User Profile
    async updateUserProfile(
        userId: string,
        profileData: { name?: string; password?: string; address?: string }
    ): Promise<any> {
        const { name, password, address } = profileData;

        // Enhanced validation
        const validation = validateProfileData(name, password, address);
        if (!validation.isValid) {
            throw new Error(validation.errors.join(". "));
        }

        // Business Logic: Find current user
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Sanitize data
        const sanitizedName = name ? sanitizeName(name) : undefined;
        const sanitizedAddress = address ? sanitizeAddress(address) : undefined;

        // Business Logic: Hash password if provided
        const hashedPassword = password ? await hashPassword(password) : undefined;

        // Business Logic: Update user with sanitized data
        const updated = await this.userRepository.update(userId, {
            name: sanitizedName || user.name,
            password: hashedPassword || user.password,
            address: sanitizedAddress || user.address,
        });

        if (!updated) {
            throw new Error("Update failed");
        }

        // Business Logic: Remove password from response
        return {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            address: updated.address,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        };
    }

    // Business Logic: Get User Orders
    async getUserOrders(userId: string) {
        return await this.orderRepository.findByUser(userId);
    }

    // Business Logic: Get All Orders (Admin)
    async getAllOrders() {
        return await this.orderRepository.findAllWithRelations();
    }

    // Private Business Logic: JWT Generation
    private generateToken(userId: string): string {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });
    }

    // Business Logic: Validate Registration Data
    validateRegistrationData(name: string, email: string, password: string): string | null {
        if (!name?.trim()) {
            return "Name is required";
        }
        if (!email) {
            return "Email is required";
        }
        if (!password || password.length < 6) {
            return "Password must be at least 6 characters long";
        }
        return null;
    }

    // Business Logic: Validate Login Data
    validateLoginData(email: string, password: string): string | null {
        if (!email) {
            return "Email is required";
        }
        if (!password || password.length < 6) {
            return "Password must be at least 6 characters long";
        }
        return null;
    }
}