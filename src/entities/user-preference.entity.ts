import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index
} from "typeorm";
import { User } from "./user.entity.js";

@Entity("user_preferences")
@Index(["userId"], { unique: true })
export class UserPreference {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ name: "user_id", type: "uuid" })
    userId: string;

    @Column({ type: "jsonb", nullable: true })
    categories: string[];

    @Column({ type: "jsonb", nullable: true })
    brands: string[];

    @Column({ type: "jsonb", nullable: true })
    priceRange: {
        min: number;
        max: number;
    };

    @Column({ type: "jsonb", nullable: true })
    viewHistory: Array<{
        productId: string;
        viewedAt: Date;
    }>;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;
}