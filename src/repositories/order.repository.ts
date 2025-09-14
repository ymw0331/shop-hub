// src/repositories/OrderRepository.ts
import { FindOptionsWhere, In } from "typeorm";
import { BaseRepository } from "./base.repository.js";
import { Order } from "../entities/order.entity.js";
import { Product } from "../entities/product.entity.js";
import { IOrder, OrderStatus } from "../types/index.js";

export class OrderRepository extends BaseRepository<Order> {
    constructor() {
        super(Order);
    }

    // Order-specific queries matching your Mongoose patterns
    async findByUser(userId: string): Promise<Order[]> {
        return this.find({
            where: { buyerId: userId } as FindOptionsWhere<Order>,
            relations: ["products", "buyer"],
            order: { createdAt: "DESC" }
        });
    }

    async findByStatus(status: OrderStatus): Promise<Order[]> {
        return this.find({
            where: { status } as FindOptionsWhere<Order>,
            relations: ["products", "buyer"],
            order: { createdAt: "DESC" }
        });
    }

    // Create order with products (many-to-many)
    async createOrder(
        orderData: Omit<IOrder, 'id' | 'products' | 'createdAt' | 'updatedAt'>,
        productIds: string[]
    ): Promise<Order> {
        // Get products by IDs
        const products = await this.repository.manager
            .getRepository(Product)
            .findBy({ id: In(productIds) });

        // Create order with products
        const order = this.repository.create({
            ...orderData,
            products
        });

        return this.save(order);
    }

    async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
        return this.update(id, { status } as Partial<Order>);
    }

    // Recent orders for admin dashboard
    async findRecentOrders(limit: number = 10): Promise<Order[]> {
        return this.repository
            .createQueryBuilder("order")
            .leftJoinAndSelect("order.products", "products")
            .leftJoinAndSelect("order.buyer", "buyer")
            .orderBy("order.createdAt", "DESC")
            .limit(limit)
            .getMany();
    }

    // Always include products and buyer (matches Mongoose populate)
    async findAllWithRelations(): Promise<Order[]> {
        return this.find({
            relations: ["products", "buyer"],
            order: { createdAt: "DESC" }
        });
    }

    async findByIdWithRelations(id: string): Promise<Order | null> {
        return this.repository.findOne({
            where: { id },
            relations: ["products", "products.category", "buyer"]
        });
    }

    // Analytics for admin
    async getTotalSales(): Promise<number> {
        const result = await this.repository
            .createQueryBuilder("order")
            .leftJoin("order.products", "product")
            .select("SUM(product.price)", "total")
            .where("order.status != :status", { status: OrderStatus.CANCELLED })
            .getRawOne();

        return parseFloat(result.total) || 0;
    }

    async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
        return this.repository
            .createQueryBuilder("order")
            .leftJoinAndSelect("order.products", "products")
            .leftJoinAndSelect("order.buyer", "buyer")
            .where("order.createdAt >= :startDate", { startDate })
            .andWhere("order.createdAt <= :endDate", { endDate })
            .orderBy("order.createdAt", "DESC")
            .getMany();
    }

    // Update payment info
    async updatePayment(id: string, paymentData: any): Promise<Order | null> {
        return this.update(id, { payment: paymentData } as Partial<Order>);
    }

    // Get user's order count
    async getUserOrderCount(userId: string): Promise<number> {
        return this.repository.count({
            where: { buyerId: userId } as FindOptionsWhere<Order>
        });
    }
}