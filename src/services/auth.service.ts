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
import { Logger } from "../utils/logger.js";



export class AuthService {
    private userRepository: UserRepository;
    private orderRepository: OrderRepository;
    private logger: Logger;

    constructor() {
        this.userRepository = new UserRepository();
        this.orderRepository = new OrderRepository();
        this.logger = new Logger('AuthService');
    }

    // Business Logic: User Registration
    async registerUser(userData: CreateUserDto): Promise<{ user: any; token: string }> {
        this.logger.methodEntry('registerUser', { email: userData.email, name: userData.name });
        const timer = this.logger.startTimer('Register User');

        const { name, email, password } = userData;

        // Enhanced validation with detailed error messages
        this.logger.debug('Validating registration data', { email });
        const validation = validateRegistrationData(name, email, password);
        if (!validation.isValid) {
            this.logger.warn('Registration validation failed', { email, errors: validation.errors });
            throw new Error(validation.errors.join(". "));
        }

        // Sanitize input data
        const sanitizedEmail = sanitizeEmail(email);
        const sanitizedName = sanitizeName(name);
        this.logger.debug('Input sanitized', { originalEmail: email, sanitizedEmail });

        // Business Logic: Check if email exists
        this.logger.debug('Checking if email exists', { sanitizedEmail });
        const existingUser = await this.userRepository.findByEmail(sanitizedEmail);
        if (existingUser) {
            this.logger.warn('Registration failed - email already exists', { email: sanitizedEmail });
            throw new Error("Email is already registered");
        }

        // Business Logic: Hash password
        this.logger.debug('Hashing password');
        const hashedPassword = await hashPassword(password);

        // Business Logic: Create user with sanitized data
        this.logger.debug('Creating new user', { email: sanitizedEmail, name: sanitizedName });
        const user = await this.userRepository.createUser({
            name: sanitizedName,
            email: sanitizedEmail,
            password: hashedPassword,
            role: 0, // Default role: 0 = regular user, 1 = admin
        });
        this.logger.info('User created successfully', { userId: user.id, email: user.email });

        // Business Logic: Generate JWT
        const token = this.generateToken(user.id);
        this.logger.debug('JWT token generated', { userId: user.id });

        timer();
        this.logger.methodExit('registerUser', { userId: user.id });

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
        this.logger.methodEntry('loginUser', { email });
        const timer = this.logger.startTimer('User Login');

        // Enhanced validation
        this.logger.debug('Validating login data', { email });
        const validation = validateLoginData(email, password);
        if (!validation.isValid) {
            this.logger.warn('Login validation failed', { email, errors: validation.errors });
            throw new Error(validation.errors.join(". "));
        }

        // Sanitize input
        const sanitizedEmail = sanitizeEmail(email);
        this.logger.debug('Email sanitized', { originalEmail: email, sanitizedEmail });

        // Business Logic: Find user
        this.logger.debug('Finding user by email', { sanitizedEmail });
        const user = await this.userRepository.findByEmail(sanitizedEmail);
        if (!user) {
            this.logger.warn('Login failed - user not found', { email: sanitizedEmail });
            throw new Error("Invalid email or password"); // Security: Don't reveal which is wrong
        }

        // Business Logic: Verify password
        this.logger.debug('Verifying password', { userId: user.id });
        const match = await comparePassword(password, user.password);
        if (!match) {
            this.logger.warn('Login failed - invalid password', { userId: user.id, email: sanitizedEmail });
            throw new Error("Invalid email or password"); // Security: Same error message
        }

        // Business Logic: Generate JWT
        const token = this.generateToken(user.id);
        this.logger.info('User logged in successfully', { userId: user.id, email: user.email });

        timer();
        this.logger.methodExit('loginUser', { userId: user.id });

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
        this.logger.methodEntry('updateUserProfile', { userId, hasName: !!profileData.name, hasPassword: !!profileData.password, hasAddress: !!profileData.address });
        const timer = this.logger.startTimer('Update User Profile');

        const { name, password, address } = profileData;

        // Enhanced validation
        this.logger.debug('Validating profile data', { userId });
        const validation = validateProfileData(name, password, address);
        if (!validation.isValid) {
            this.logger.warn('Profile validation failed', { userId, errors: validation.errors });
            throw new Error(validation.errors.join(". "));
        }

        // Business Logic: Find current user
        this.logger.debug('Finding user for update', { userId });
        const user = await this.userRepository.findById(userId);
        if (!user) {
            this.logger.error('User not found for profile update', new Error('User not found'), { userId });
            throw new Error("User not found");
        }

        // Sanitize data
        const sanitizedName = name ? sanitizeName(name) : undefined;
        const sanitizedAddress = address ? sanitizeAddress(address) : undefined;
        this.logger.debug('Profile data sanitized', { userId, hasSanitizedName: !!sanitizedName, hasSanitizedAddress: !!sanitizedAddress });

        // Business Logic: Hash password if provided
        if (password) {
            this.logger.debug('Hashing new password', { userId });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;

        // Business Logic: Update user with sanitized data
        this.logger.debug('Updating user profile', { userId });
        const updated = await this.userRepository.update(userId, {
            name: sanitizedName || user.name,
            password: hashedPassword || user.password,
            address: sanitizedAddress || user.address,
        });

        if (!updated) {
            this.logger.error('Profile update failed', new Error('Update failed'), { userId });
            throw new Error("Update failed");
        }

        this.logger.info('User profile updated successfully', { userId });
        timer();
        this.logger.methodExit('updateUserProfile', { userId });

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
        this.logger.methodEntry('getUserOrders', { userId });
        const timer = this.logger.startTimer('Get User Orders');

        this.logger.debug('Fetching orders for user', { userId });
        const orders = await this.orderRepository.findByUser(userId);

        this.logger.info('User orders retrieved', { userId, orderCount: orders.length });
        timer();
        this.logger.methodExit('getUserOrders', { userId, count: orders.length });

        return orders;
    }

    // Business Logic: Get All Orders (Admin)
    async getAllOrders() {
        this.logger.methodEntry('getAllOrders');
        const timer = this.logger.startTimer('Get All Orders');

        this.logger.debug('Fetching all orders with relations');
        const orders = await this.orderRepository.findAllWithRelations();

        this.logger.info('All orders retrieved', { orderCount: orders.length });
        timer();
        this.logger.methodExit('getAllOrders', { count: orders.length });

        return orders;
    }

    // Private Business Logic: JWT Generation
    private generateToken(userId: string): string {
        this.logger.debug('Generating JWT token', { userId });
        return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });
    }

    // Business Logic: Validate Registration Data
    validateRegistrationData(name: string, email: string, password: string): string | null {
        this.logger.debug('Validating registration data');
        if (!name?.trim()) {
            this.logger.debug('Validation failed: Name is required');
            return "Name is required";
        }
        if (!email) {
            this.logger.debug('Validation failed: Email is required');
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