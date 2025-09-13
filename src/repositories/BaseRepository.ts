// src/repositories/BaseRepository.ts
import { Repository, FindOptionsWhere, FindManyOptions, DeepPartial } from "typeorm";
import { AppDataSource } from "../database/data-source.js";

export abstract class BaseRepository<T extends { id: string }> {
    protected repository: Repository<T>;

    constructor(entity: any) {
        this.repository = AppDataSource.getRepository(entity);
    }

    // Generic CRUD operations
    async findById(id: string): Promise<T | null> {
        return this.repository.findOne({ 
            where: { id } as FindOptionsWhere<T> 
        });
    }

    async findOne(conditions: FindOptionsWhere<T>): Promise<T | null> {
        return this.repository.findOne({ where: conditions });
    }

    async find(options?: FindManyOptions<T>): Promise<T[]> {
        return this.repository.find(options);
    }

    async findAll(): Promise<T[]> {
        return this.repository.find();
    }

    async save(entity: DeepPartial<T>): Promise<T> {
        return this.repository.save(entity as T);
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        await this.repository.update(id, data as any);
        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected! > 0;
    }

    async count(conditions?: FindOptionsWhere<T>): Promise<number> {
        return this.repository.count({ where: conditions });
    }

    // Industry Standard: Pagination
    async findWithPagination(
        page: number = 1, 
        limit: number = 10, 
        options?: FindManyOptions<T>
    ): Promise<{ data: T[], total: number, page: number, limit: number }> {
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