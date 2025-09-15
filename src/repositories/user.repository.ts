// src/repositories/UserRepository.ts
import { FindOptionsWhere } from "typeorm";
import { BaseRepository } from "./base.repository.js";
import { User } from "../entities/user.entity.js";
import { IUser } from "../types/index.js";

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(User);
    }

    // User-specific queries that mirror your current Mongoose usage
    async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ email } as FindOptionsWhere<User>);
    }

    async findByRole(role: number): Promise<User[]> {
        return this.find({ 
            where: { role } as FindOptionsWhere<User> 
        });
    }

    async findAdmins(): Promise<User[]> {
        return this.findByRole(1);
    }

    async findRegularUsers(): Promise<User[]> {
        return this.findByRole(0);
    }

    // Industry Standard: Search functionality
    async searchByName(searchTerm: string): Promise<User[]> {
        return this.repository
            .createQueryBuilder("user")
            .where("user.name ILIKE :searchTerm", { searchTerm: `%${searchTerm}%` })
            .getMany();
    }

    // Create user with hashed password (we'll implement hashing in controllers)
    async createUser(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        const user = this.repository.create(userData);
        return this.save(user);
    }

    // Update user profile (exclude password updates)
    async updateProfile(id: string, profileData: Partial<Pick<IUser, 'name' | 'address'>>): Promise<User | null> {
        return this.update(id, profileData);
    }

    // Check if email exists (for registration validation)

    // Password reset token methods
    async findByResetToken(token: string): Promise<User | null> {
        return this.repository
            .createQueryBuilder("user")
            .where("user.resetPasswordToken = :token", { token })
            .andWhere("user.resetPasswordExpires > :now", { now: new Date() })
            .getOne();
    }

    async setResetToken(userId: string, token: string, expires: Date): Promise<User | null> {
        return this.update(userId, {
            resetPasswordToken: token,
            resetPasswordExpires: expires
        } as Partial<User>);
    }

    async clearResetToken(userId: string): Promise<User | null> {
        return this.update(userId, {
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined
        } as Partial<User>);
    }

    async updatePassword(userId: string, hashedPassword: string): Promise<User | null> {
        const user = await this.update(userId, { password: hashedPassword } as Partial<User>);
        if (user) {
            await this.clearResetToken(userId);
        }
        return user;
    }
    async emailExists(email: string): Promise<boolean> {
        const count = await this.repository.count({ 
            where: { email } as FindOptionsWhere<User> 
        });
        return count > 0;
    }
}