import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
    Index
} from "typeorm";
import { Product } from "./product.entity.js";

@Entity("collections")
@Index(["active"])
@Index(["createdAt"])
export class Collection {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 255, unique: true })
    slug: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ type: "varchar", length: 500, nullable: true })
    imageUrl?: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    theme?: string;

    @Column({ type: "boolean", default: true })
    active: boolean;

    @Column({ type: "int", default: 0 })
    displayOrder: number;

    @ManyToMany(() => Product)
    @JoinTable({
        name: "collection_products",
        joinColumn: {
            name: "collection_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "product_id",
            referencedColumnName: "id"
        }
    })
    products: Product[];

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;
}