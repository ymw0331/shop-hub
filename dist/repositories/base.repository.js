import { AppDataSource } from "../database/data-source.js";
export class BaseRepository {
    constructor(entity) {
        this.repository = AppDataSource.getRepository(entity);
    }
    // Generic CRUD operations
    async findById(id) {
        return this.repository.findOne({
            where: { id }
        });
    }
    async findOne(conditions) {
        return this.repository.findOne({ where: conditions });
    }
    async find(options) {
        return this.repository.find(options);
    }
    async findAll() {
        return this.repository.find();
    }
    async save(entity) {
        return this.repository.save(entity);
    }
    async update(id, data) {
        await this.repository.update(id, data);
        return this.findById(id);
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        return result.affected > 0;
    }
    async count(conditions) {
        return this.repository.count({ where: conditions });
    }
    // Industry Standard: Pagination
    async findWithPagination(page = 1, limit = 10, options) {
        const skip = (page - 1) * limit;
        const [entities, total] = await this.repository.findAndCount({
            ...options,
            skip,
            take: limit
        });
        return {
            data: entities,
            total,
            page,
            limit
        };
    }
}
