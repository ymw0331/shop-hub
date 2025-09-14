import { BaseRepository } from "./base.repository.js";
import { User } from "../entities/user.entity.js";
export class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }
    // User-specific queries that mirror your current Mongoose usage
    async findByEmail(email) {
        return this.findOne({ email });
    }
    async findByRole(role) {
        return this.find({
            where: { role }
        });
    }
    async findAdmins() {
        return this.findByRole(1);
    }
    async findRegularUsers() {
        return this.findByRole(0);
    }
    // Industry Standard: Search functionality
    async searchByName(searchTerm) {
        return this.repository
            .createQueryBuilder("user")
            .where("user.name ILIKE :searchTerm", { searchTerm: `%${searchTerm}%` })
            .getMany();
    }
    // Create user with hashed password (we'll implement hashing in controllers)
    async createUser(userData) {
        const user = this.repository.create(userData);
        return this.save(user);
    }
    // Update user profile (exclude password updates)
    async updateProfile(id, profileData) {
        return this.update(id, profileData);
    }
    // Check if email exists (for registration validation)
    async emailExists(email) {
        const count = await this.repository.count({
            where: { email }
        });
        return count > 0;
    }
}
