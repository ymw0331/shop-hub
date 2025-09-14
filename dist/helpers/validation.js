// src/helpers/validation.ts
// Email validation with comprehensive regex
export const isValidEmail = (email) => {
    if (!email || typeof email !== 'string')
        return false;
    // Industry standard email regex (RFC 5322 compliant)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email.trim()) && email.length <= 254; // RFC limit
};
// Enhanced password validation
export const isValidPassword = (password) => {
    if (!password || typeof password !== 'string')
        return false;
    // At least 6 characters (following your current business rule)
    return password.length >= 6 && password.length <= 128; // Max length for security
};
// Strong password validation (optional upgrade)
export const isStrongPassword = (password) => {
    if (!password || typeof password !== 'string')
        return false;
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,128}$/;
    return strongPasswordRegex.test(password);
};
// Name validation with sanitization
export const isValidName = (name) => {
    if (!name || typeof name !== 'string')
        return false;
    const trimmedName = name.trim();
    // Must be between 2-50 characters, letters and common symbols only
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'\-\.]{2,50}$/;
    return nameRegex.test(trimmedName);
};
export const validateRegistrationData = (name, email, password) => {
    const errors = [];
    // Name validation
    if (!name || !name.trim()) {
        errors.push("Name is required");
    }
    else if (!isValidName(name)) {
        errors.push("Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes");
    }
    // Email validation
    if (!email) {
        errors.push("Email is required");
    }
    else if (!isValidEmail(email)) {
        errors.push("Please provide a valid email address");
    }
    // Password validation
    if (!password) {
        errors.push("Password is required");
    }
    else if (!isValidPassword(password)) {
        errors.push("Password must be at least 6 characters long");
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
export const validateLoginData = (email, password) => {
    const errors = [];
    // Email validation
    if (!email) {
        errors.push("Email is required");
    }
    else if (!isValidEmail(email)) {
        errors.push("Please provide a valid email address");
    }
    // Password validation (less strict for login)
    if (!password) {
        errors.push("Password is required");
    }
    else if (password.length < 6) {
        errors.push("Password must be at least 6 characters long");
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
// Profile update validation
export const validateProfileData = (name, password, address) => {
    const errors = [];
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
export const sanitizeName = (name) => {
    return name?.trim().replace(/\s+/g, ' ') || '';
};
export const sanitizeEmail = (email) => {
    return email?.trim().toLowerCase() || '';
};
export const sanitizeAddress = (address) => {
    return address?.trim().replace(/\s+/g, ' ') || '';
};
