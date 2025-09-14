// src/entities/Order.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany,
    JoinColumn,
    JoinTable,
    Index
} from "typeorm";
import { IOrder, OrderStatus } from "../types/index.js";
import { User } from "./user.entity.js";
import { Product } from "./product.entity.js";

@Entity("orders")
@Index(["buyerId"]) // For querying user orders
@Index(["status"]) // For filtering by status
@Index(["createdAt"]) // For date-based queries
export class Order implements IOrder {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToMany(() => Product, (product: Product) => product.orders, {
        eager: true,
        cascade: true
    })
    @JoinTable({
        name: "order_products",
        joinColumn: { name: "order_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "product_id", referencedColumnName: "id" }
    })
    products: Product[];

    @Column({ type: "jsonb", nullable: true })
    payment?: any;

    @ManyToOne(() => User, (user: User) => user.orders, {
        eager: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "buyer_id" })
    buyer: User;

    @Column({ name: "buyer_id" })
    buyerId: string;

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.NOT_PROCESSED
    })
    status: OrderStatus;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

}


