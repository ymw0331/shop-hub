// src/helpers/auth.ts
import bcrypt from "bcrypt";
export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
    catch (error) {
        throw new Error(`Password hashing failed: ${error}`);
    }
};
export const comparePassword = async (password, hashed) => {
    try {
        return await bcrypt.compare(password, hashed);
    }
    catch (error) {
        throw new Error(`Password comparison failed: ${error}`);
    }
};
