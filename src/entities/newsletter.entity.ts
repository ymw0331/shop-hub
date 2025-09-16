import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index
} from "typeorm";

@Entity("newsletter_subscriptions")
@Index(["email"], { unique: true })
@Index(["active"])
export class Newsletter {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    name?: string;

    @Column({ type: "boolean", default: true })
    active: boolean;

    @Column({ type: "varchar", nullable: true })
    unsubscribeToken?: string;

    @CreateDateColumn({ name: "subscribed_at", type: "timestamp" })
    subscribedAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;
}