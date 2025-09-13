// src/types/index.ts

// Using interfaces instead of types for several reasons:
// 1. Interfaces are extendable and can be merged (declaration merging)
// 2. Better for object-oriented patterns and class implementations
// 3. More performant for TypeScript compiler with large codebases
// 4. Better error messages and IDE support
// 5. Industry standard for defining object shapes in TypeScript
// 6. Can be implemented by classes (e.g., class User implements IUser)
// 7. Better compatibility with TypeORM entities which use class-based approach
// 8. Interfaces support inheritance with 'extends' keyword for cleaner syntax
// 9. Better support for generic constraints and conditional types
// 10. Interfaces can define function signatures and indexable types more intuitively
// 11. Better refactoring support in IDEs (rename, extract interface, etc.)
// 12. Interfaces are open-ended, allowing augmentation from different modules
// 13. Better compatibility with third-party libraries and frameworks
// 14. Clearer intent when defining contracts for objects vs union/intersection types


export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    address?: string;
    role: number;
    orders?: IOrder[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ICategory {
    id: string;
    name: string;
    slug: string;
    products?: IProduct[];
}

export interface IProduct {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    quantity: number;
    sold: number;
    photoPath?: string; // Changed from Buffer to file path
    photoContentType?: string;
    shipping: boolean;
    category: ICategory;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrder {
    id: string;
    products: IProduct[];
    payment?: any; // JSON object for payment details
    buyer: IUser;
    buyerId: string;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}

export enum OrderStatus {
    NOT_PROCESSED = "Not processed",
    PROCESSING = "Processing",
    SHIPPED = "Shipped",
    DELIVERED = "Delivered",
    CANCELLED = "Cancelled"
}

// DTOs (Data Transfer Objects) - Industry standard for API requests
export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    address?: string;
}

export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: string;
    shipping: boolean;
}

export interface CreateCategoryDto {
    name: string;
    slug: string;
}