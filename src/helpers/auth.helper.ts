// src/helpers/auth.ts
import bcrypt from "bcrypt";
import { Logger } from "../utils/logger.js";

const logger = new Logger('AuthHelper');

export const hashPassword = async (password: string): Promise<string> => {
    logger.debug('Starting password hashing');
    try {
        const salt = await bcrypt.genSalt(12);
        logger.debug('Salt generated for password hashing');
        const hash = await bcrypt.hash(password, salt);
        logger.debug('Password hashed successfully');
        return hash;
    } catch (error) {
        logger.error('Password hashing failed', error as Error);
        throw new Error(`Password hashing failed: ${error}`);
    }
};

export const comparePassword = async (password: string, hashed: string): Promise<boolean> => {
    logger.debug('Starting password comparison');
    try {
        const match = await bcrypt.compare(password, hashed);
        logger.debug('Password comparison complete', { match });
        return match;
    } catch (error) {
        logger.error('Password comparison failed', error as Error);
        throw new Error(`Password comparison failed: ${error}`);
    }
};