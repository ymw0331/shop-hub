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

@Entity("product_views")
@Index(["productId", "userId"])
@Index(["viewedAt"])
export class ProductView {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: "product_id" })
    product: Product;

    @Column({ name: "product_id", type: "uuid" })
    productId: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "user_id" })
    user?: User;

    @Column({ name: "user_id", type: "uuid", nullable: true })
    userId?: string;

    @Column({ type: "varchar", nullable: true })
    sessionId?: string;

    @Column({ type: "int", default: 0 })
    duration: number;

    @CreateDateColumn({ name: "viewed_at", type: "timestamp" })
    viewedAt: Date;
}