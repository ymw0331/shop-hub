// Entities are TypeScript classes that map to database tables. Each entity represents a table, and each property represents a column.
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from "typeorm";
import { Order } from "./Order.js";
let User = class User {
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    Column({ type: "varchar", length: 255, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Column({ type: "text", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    Column({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "role", void 0);
__decorate([
    OneToMany(() => Order, (order) => order.buyer, {
        cascade: true
    }),
    __metadata("design:type", Array)
], User.prototype, "orders", void 0);
__decorate([
    CreateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    Entity("users") // Table name
    ,
    Index(["email"], { unique: true }) // Database index for performance
], User);
export { User };
