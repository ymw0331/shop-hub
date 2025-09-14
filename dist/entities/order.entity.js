var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/Order.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinColumn, JoinTable, Index } from "typeorm";
import { OrderStatus } from "../types/index.js";
import { User } from "./user.entity.js";
import { Product } from "./product.entity.js";
let Order = class Order {
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    ManyToMany(() => Product, (product) => product.orders, {
        eager: true,
        cascade: true
    }),
    JoinTable({
        name: "order_products",
        joinColumn: { name: "order_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "product_id", referencedColumnName: "id" }
    }),
    __metadata("design:type", Array)
], Order.prototype, "products", void 0);
__decorate([
    Column({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "payment", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.orders, {
        eager: true,
        onDelete: "CASCADE"
    }),
    JoinColumn({ name: "buyer_id" }),
    __metadata("design:type", User)
], Order.prototype, "buyer", void 0);
__decorate([
    Column({ name: "buyer_id", type: "uuid" }),
    __metadata("design:type", String)
], Order.prototype, "buyerId", void 0);
__decorate([
    Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.NOT_PROCESSED
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    CreateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
Order = __decorate([
    Entity("orders"),
    Index(["buyerId"]) // For querying user orders
    ,
    Index(["status"]) // For filtering by status
    ,
    Index(["createdAt"]) // For date-based queries
], Order);
export { Order };
