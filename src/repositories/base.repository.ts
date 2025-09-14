// src/repositories/BaseRepository.ts
import { Repository, FindOptionsWhere, FindManyOptions, DeepPartial } from "typeorm";
import { AppDataSource } from "../database/data-source.js";
import { Logger } from "../utils/logger.js";

export abstract class BaseRepository<T extends { id: string }> {
    protected repository: Repository<T>;
    protected logger: Logger;

    constructor(entity: any) {
        this.repository = AppDataSource.getRepository(entity);
        this.logger = new Logger(`${entity.name}Repository`);
    }

    // Generic CRUD operations
    async findById(id: string): Promise<T | null> {
        this.logger.query('findById', { id });
        const timer = this.logger.startTimer('findById');

        const result = await this.repository.findOne({
            where: { id } as FindOptionsWhere<T>
        });

        timer();
        this.logger.debug('findById result', { id, found: !!result });
        return result;
    }

    async findOne(conditions: FindOptionsWhere<T>): Promise<T | null> {
        this.logger.query('findOne', { conditions });
        const timer = this.logger.startTimer('findOne');

        const result = await this.repository.findOne({ where: conditions });

        timer();
        this.logger.debug('findOne result', { found: !!result });
        return result;
    }

    async find(options?: FindManyOptions<T>): Promise<T[]> {
        this.logger.query('find', { hasOptions: !!options });
        const timer = this.logger.startTimer('find');

        const results = await this.repository.find(options);

        timer();
        this.logger.debug('find results', { count: results.length });
        return results;
    }

    async findAll(): Promise<T[]> {
        this.logger.query('findAll');
        const timer = this.logger.startTimer('findAll');

        const results = await this.repository.find();

        timer();
        this.logger.debug('findAll results', { count: results.length });
        return results;
    }

    async save(entity: DeepPartial<T>): Promise<T> {
        this.logger.query('save', { hasId: !!(entity as any).id });
        const timer = this.logger.startTimer('save');

        const result = await this.repository.save(entity as T);

        timer();
        this.logger.debug('save result', { id: (result as any).id });
        return result;
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        this.logger.query('update', { id });
        const timer = this.logger.startTimer('update');

        await this.repository.update(id, data as any);
        const updated = await this.findById(id);

        timer();
        this.logger.debug('update result', { id, success: !!updated });
        return updated;
    }

    async delete(id: string): Promise<boolean> {
        this.logger.query('delete', { id });
        const timer = this.logger.startTimer('delete');

        const result = await this.repository.delete(id);
        const success = result.affected! > 0;

        timer();
        this.logger.debug('delete result', { id, success, affected: result.affected });
        return success;
    }

    async count(conditions?: FindOptionsWhere<T>): Promise<number> {
        this.logger.query('count', { hasConditions: !!conditions });
        const timer = this.logger.startTimer('count');

        const count = await this.repository.count({ where: conditions });

        timer();
        this.logger.debug('count result', { count });
        return count;
    }

    // Industry Standard: Pagination
    async findWithPagination(
        page: number = 1,
        limit: number = 10,
        options?: FindManyOptions<T>
    ): Promise<{ data: T[], total: number, page: number, limit: number }> {
        this.logger.query('findWithPagination', { page, limit });
        const timer = this.logger.startTimer('findWithPagination');

        const skip = (page - 1) * limit;

        const [entities, total] = await this.repository.findAndCount({
            ...options,
            skip,
            take: limit
        });

        timer();
        this.logger.debug('pagination results', {
            page,
            limit,
            total,
            returned: entities.length
        });

        return {
            data: entities,
            total,
            page,
            limit
        };
    }
}