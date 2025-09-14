// src/entities/Product.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany,
    JoinColumn,
    Index
} from "typeorm";
import { IProduct } from "../types/index.js";
import { Category } from "./category.entity.js";
import { Order } from "./order.entity.js";

@Entity("products")
@Index(["name"]) // For search performance
@Index(["slug"], { unique: true })
@Index(["categoryId"]) // For filtering by category
export class Product implements IProduct {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 160 })
    name: string;

    @Column({ type: "varchar", length: 255, unique: true })
    slug: string;

    @Column({ type: "text" })
    description: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number;

    @Column({ type: "int", default: 0 })
    quantity: number;

    @Column({ type: "int", default: 0 })
    sold: number;

    // Industry Standard: File storage instead of BLOB
    @Column({ type: "varchar", nullable: true })
    photoPath?: string;

    @Column({ type: "varchar", nullable: true })
    photoContentType?: string;

    @Column({ type: "boolean", default: false })
    shipping: boolean;

    // Industry Standard: Proper foreign key relationships
    @ManyToOne(() => Category, (category: Category) => category.products, {
        eager: true, // Always load category with product
        onDelete: "CASCADE" // Delete products when category is deleted
    })
    @JoinColumn({ name: "category_id" })
    category: Category;

    @Column({ name: "category_id" })
    categoryId: string;

    @ManyToMany(() => Order, (order: Order) => order.products)
    orders?: Order[];

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

}