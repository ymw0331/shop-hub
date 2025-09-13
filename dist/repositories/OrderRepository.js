// src/repositories/OrderRepository.ts
import { In } from "typeorm";
import { BaseRepository } from "./BaseRepository.js";
import { Order } from "../entities/Order.js";
import { Product } from "../entities/Product.js";
import { OrderStatus } from "../types/index.js";
export class OrderRepository extends BaseRepository {
    constructor() {
        super(Order);
    }
    // Order-specific queries matching your Mongoose patterns
    async findByUser(userId) {
        return this.find({
            where: { buyerId: userId },
            relations: ["products", "buyer"],
            order: { createdAt: "DESC" }
        });
    }
    async findByStatus(status) {
        return this.find({
            where: { status },
            relations: ["products", "buyer"],
            order: { createdAt: "DESC" }
        });
    }
    // Create order with products (many-to-many)
    async createOrder(orderData, productIds) {
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
    async updateStatus(id, status) {
        return this.update(id, { status });
    }
    // Recent orders for admin dashboard
    async findRecentOrders(limit = 10) {
        return this.repository
            .createQueryBuilder("order")
            .leftJoinAndSelect("order.products", "products")
            .leftJoinAndSelect("order.buyer", "buyer")
            .orderBy("order.createdAt", "DESC")
            .limit(limit)
            .getMany();
    }
    // Always include products and buyer (matches Mongoose populate)
    async findAllWithRelations() {
        return this.find({
            relations: ["products", "buyer"],
            order: { createdAt: "DESC" }
        });
    }
    async findByIdWithRelations(id) {
        return this.repository.findOne({
            where: { id },
            relations: ["products", "products.category", "buyer"]
        });
    }
    // Analytics for admin
    async getTotalSales() {
        const result = await this.repository
            .createQueryBuilder("order")
            .leftJoin("order.products", "product")
            .select("SUM(product.price)", "total")
            .where("order.status != :status", { status: OrderStatus.CANCELLED })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getOrdersByDateRange(startDate, endDate) {
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
    async updatePayment(id, paymentData) {
        return this.update(id, { payment: paymentData });
    }
    // Get user's order count
    async getUserOrderCount(userId) {
        return this.repository.count({
            where: { buyerId: userId }
        });
    }
}
