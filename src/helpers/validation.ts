// src/helpers/validation.ts
import { Logger } from "../utils/logger.js";

const logger = new Logger('ValidationHelper');

// Email validation with comprehensive regex
export const isValidEmail = (email: string): boolean => {
    logger.debug('Validating email format');
    if (!email || typeof email !== 'string') return false;
    
    // Industry standard email regex (RFC 5322 compliant)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    return emailRegex.test(email.trim()) && email.length <= 254; // RFC limit
};

// Enhanced password validation
export const isValidPassword = (password: string): boolean => {
    if (!password || typeof password !== 'string') return false;
    
    // At least 6 characters (following your current business rule)
    return password.length >= 6 && password.length <= 128; // Max length for security
};

// Strong password validation (optional upgrade)
export const isStrongPassword = (password: string): boolean => {
    if (!password || typeof password !== 'string') return false;
    
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,128}$/;
    return strongPasswordRegex.test(password);
};

// Name validation with sanitization
export const isValidName = (name: string): boolean => {
    if (!name || typeof name !== 'string') return false;
    
    const trimmedName = name.trim();
    
    // Must be between 2-50 characters, letters and common symbols only
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'\-\.]{2,50}$/;
    
    return nameRegex.test(trimmedName);
};

// Comprehensive validation with detailed error messages
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export const validateRegistrationData = (
    name: string,
    email: string,
    password: string
): ValidationResult => {
    logger.methodEntry('validateRegistrationData', { hasName: !!name, hasEmail: !!email, hasPassword: !!password });
    const errors: string[] = [];

    // Name validation
    if (!name || !name.trim()) {
        logger.debug('Validation failed: Name is required');
        errors.push("Name is required");
    } else if (!isValidName(name)) {
        logger.debug('Validation failed: Invalid name format', { name });
        errors.push("Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes");
    }

    // Email validation
    if (!email) {
        logger.debug('Validation failed: Email is required');
        errors.push("Email is required");
    } else if (!isValidEmail(email)) {
        logger.debug('Validation failed: Invalid email format', { email });
        errors.push("Please provide a valid email address");
    }

    // Password validation
    if (!password) {
        logger.debug('Validation failed: Password is required');
        errors.push("Password is required");
    } else if (!isValidPassword(password)) {
        logger.debug('Validation failed: Password too short');
        errors.push("Password must be at least 6 characters long");
    }

    const result = {
        isValid: errors.length === 0,
        errors
    };

    logger.methodExit('validateRegistrationData', { isValid: result.isValid, errorCount: errors.length });
    return result;
};

export const validateLoginData = (email: string, password: string): ValidationResult => {
    logger.methodEntry('validateLoginData', { hasEmail: !!email, hasPassword: !!password });
    const errors: string[] = [];

    // Email validation
    if (!email) {
        logger.debug('Validation failed: Email is required');
        errors.push("Email is required");
    } else if (!isValidEmail(email)) {
        logger.debug('Validation failed: Invalid email format', { email });
        errors.push("Please provide a valid email address");
    }

    // Password validation (less strict for login)
    if (!password) {
        logger.debug('Validation failed: Password is required');
        errors.push("Password is required");
    } else if (password.length < 6) {
        logger.debug('Validation failed: Password too short');
        errors.push("Password must be at least 6 characters long");
    }

    const result = {
        isValid: errors.length === 0,
        errors
    };

    logger.methodExit('validateLoginData', { isValid: result.isValid, errorCount: errors.length });
    return result;
};

// Profile update validation
export const validateProfileData = (
    name?: string, 
    password?: string, 
    address?: string
): ValidationResult => {
    const errors: string[] = [];

    // Name validation (if provided)
    if (name !== undefined && name !== null && !isValidName(name)) {
        errors.push("Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes");
    }

    // Password validation (if provided)
    if (password !== undefined && password !== null && !isValidPassword(password)) {
        errors.push("Password must be at least 6 characters long");
    }

    // Address validation (if provided)
    if (address !== undefined && address !== null && typeof address === 'string' && address.trim().length > 500) {
        errors.push("Address must be less than 500 characters");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Sanitization helpers
export const sanitizeName = (name: string): string => {
    logger.debug('Sanitizing name', { original: name });
    const sanitized = name?.trim().replace(/\s+/g, ' ') || '';
    logger.debug('Name sanitized', { sanitized });
    return sanitized;
};

export const sanitizeEmail = (email: string): string => {
    logger.debug('Sanitizing email', { original: email });
    const sanitized = email?.trim().toLowerCase() || '';
    logger.debug('Email sanitized', { sanitized });
    return sanitized;
};

export const sanitizeAddress = (address: string): string => {
    logger.debug('Sanitizing address');
    const sanitized = address?.trim().replace(/\s+/g, ' ') || '';
    logger.debug('Address sanitized', { length: sanitized.length });
    return sanitized;
};