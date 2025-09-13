// Entities are TypeScript classes that map to database tables. Each entity represents a table, and each property represents a column.

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index
} from "typeorm";
import { IUser } from "../types/index.js";
import { Order } from "./Order.js";

@Entity("users") // Table name
@Index(["email"], { unique: true }) // Database index for performance
export class User implements IUser {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email: string;

    @Column({ type: "varchar", length: 255 })
    password: string;

    @Column({ type: "text", nullable: true })
    address?: string;

    @Column({ type: "int", default: 0 })
    role: number;

    // Industry Standard: Relationships
    @OneToMany(() => Order, (order: Order) => order.buyer, {
        cascade: true
    })
    orders?: Order[];

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    // Industry Standard: Virtual property for MongoDB compatibility
    get _id(): string {
        return this.id;
    }
}