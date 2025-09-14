// src/entities/Category.ts
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany,
    Index
} from "typeorm";
import { ICategory } from "../types/index.js";
import { Product } from "./product.entity.js";

@Entity("categories")
@Index(["name"], { unique: true })
@Index(["slug"], { unique: true })
export class Category implements ICategory {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 32, unique: true })
    name: string;

    @Column({ type: "varchar", length: 255, unique: true })
    slug: string;

    // Industry Standard: Bidirectional relationship
    @OneToMany(() => Product, (product: Product) => product.category, {
        cascade: true
    })
    products?: Product[];

}