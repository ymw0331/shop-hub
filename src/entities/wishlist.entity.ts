import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index
} from "typeorm";
import { User } from "./user.entity.js";
import { Product } from "./product.entity.js";

@Entity("wishlists")
@Index(["userId", "productId"], { unique: true })
export class Wishlist {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ name: "user_id", type: "uuid" })
    userId: string;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: "product_id" })
    product: Product;

    @Column({ name: "product_id", type: "uuid" })
    productId: string;

    @CreateDateColumn({ name: "added_at", type: "timestamp" })
    addedAt: Date;
}