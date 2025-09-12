# MongoDB to PostgreSQL/TypeORM Migration Guide

## Overview
This document outlines the complete migration strategy from MongoDB/Mongoose to PostgreSQL/TypeORM for the e-commercehub API, ensuring zero breaking changes to the frontend.

## Current Architecture Analysis

### MongoDB Models
- **User**: Authentication, profile data, role-based access
- **Category**: Product categorization with slug
- **Product**: Product details, photo storage (Buffer), category reference
- **Order**: Order management with product references and status tracking

### API Endpoints (Must Remain Unchanged)
```
Auth Routes:
POST   /api/register
POST   /api/login
GET    /api/auth-check
GET    /api/admin-check
PUT    /api/profile
GET    /api/orders
GET    /api/all-orders

Category Routes:
POST   /api/category
PUT    /api/category/:categoryId
DELETE /api/category/:categoryId
GET    /api/categories
GET    /api/category/:slug
GET    /api/products-by-category/:slug

Product Routes:
POST   /api/product
GET    /api/products
GET    /api/product/:slug
GET    /api/product/photo/:productId
DELETE /api/product/:productId
PUT    /api/product/:productId
POST   /api/filtered-products
GET    /api/products-count
GET    /api/list-products/:page
GET    /api/products/search/:keyword
GET    /api/related-products/:productId/:categoryId
GET    /api/braintree/token
POST   /api/braintree/payment
PUT    /api/order-status/:orderId
```

## Phase 1: Environment Setup

### 1.1 Install Dependencies
```bash
npm install typeorm pg reflect-metadata
npm install --save-dev @types/node
```

### 1.2 Update package.json Scripts
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:generate": "npm run typeorm migration:generate -- -n",
    "migration:run": "npm run typeorm migration:run",
    "migration:revert": "npm run typeorm migration:revert"
  }
}
```

### 1.3 Environment Variables
Add to `.env`:
```env
# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=ecommercehub

# Keep existing variables
JWT_SECRET=your_jwt_secret
BRAINTREE_MERCHANT_ID=your_merchant_id
BRAINTREE_PUBLIC_KEY=your_public_key
BRAINTREE_PRIVATE_KEY=your_private_key
SENDGRID_KEY=your_sendgrid_key
```

## Phase 2: TypeORM Configuration

### 2.1 Create data-source.ts
```javascript
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false, // Use migrations in production
  logging: process.env.NODE_ENV === "development",
  entities: ["entities/**/*.js"],
  migrations: ["migrations/**/*.js"],
  subscribers: ["subscribers/**/*.js"],
});
```

## Phase 3: Entity Definitions

### 3.1 User Entity (entities/User.js)
```javascript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";
import { hashPassword } from "../helpers/auth.js";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id;

  @Column({ type: "varchar", length: 255 })
  name;

  @Column({ type: "varchar", length: 255, unique: true })
  email;

  @Column({ type: "varchar", length: 255 })
  password;

  @Column({ type: "text", nullable: true })
  address;

  @Column({ type: "int", default: 0 })
  role;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  @OneToMany(() => Order, order => order.buyer)
  orders;

  // Maintain MongoDB _id compatibility for JWT
  get _id() {
    return this.id;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && this.password.length < 64) {
      this.password = await hashPassword(this.password);
    }
  }
}
```

### 3.2 Category Entity (entities/Category.js)
```javascript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";
import slugify from "slugify";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id;

  @Column({ type: "varchar", length: 32, unique: true })
  name;

  @Column({ type: "varchar", length: 255, unique: true })
  slug;

  @OneToMany(() => Product, product => product.category)
  products;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = slugify(this.name, { lower: true });
    }
  }

  // Maintain MongoDB _id compatibility
  get _id() {
    return this.id;
  }
}
```

### 3.3 Product Entity (entities/Product.js)
```javascript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import slugify from "slugify";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id;

  @Column({ type: "varchar", length: 160 })
  name;

  @Column({ type: "varchar", length: 255, unique: true })
  slug;

  @Column({ type: "text" })
  description;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price;

  @ManyToOne(() => Category, category => category.products, { eager: true })
  category;

  @Column({ type: "int", default: 0 })
  quantity;

  @Column({ type: "int", default: 0 })
  sold;

  @Column({ type: "varchar", nullable: true })
  photoPath; // Store file path instead of Buffer

  @Column({ type: "varchar", nullable: true })
  photoContentType;

  @Column({ type: "boolean", default: false })
  shipping;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  @ManyToMany(() => Order, order => order.products)
  orders;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = slugify(this.name, { lower: true });
    }
  }

  // Maintain MongoDB _id compatibility
  get _id() {
    return this.id;
  }
}
```

### 3.4 Order Entity (entities/Order.js)
```javascript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id;

  @ManyToMany(() => Product, product => product.orders)
  @JoinTable({
    name: "order_products",
    joinColumn: { name: "order_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "product_id", referencedColumnName: "id" }
  })
  products;

  @Column({ type: "jsonb", nullable: true })
  payment;

  @ManyToOne(() => User, user => user.orders)
  buyer;

  @Column({
    type: "enum",
    enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Not processed"
  })
  status;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Maintain MongoDB _id compatibility
  get _id() {
    return this.id;
  }
}
```

## Phase 4: Repository Layer

### 4.1 Base Repository (repositories/BaseRepository.js)
```javascript
export class BaseRepository {
  constructor(entity, dataSource) {
    this.repository = dataSource.getRepository(entity);
  }

  async findOne(conditions) {
    return await this.repository.findOne({ where: conditions });
  }

  async findById(id) {
    return await this.repository.findOne({ where: { id } });
  }

  async find(conditions = {}) {
    return await this.repository.find(conditions);
  }

  async save(entity) {
    return await this.repository.save(entity);
  }

  async update(id, data) {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id) {
    const entity = await this.findById(id);
    await this.repository.delete(id);
    return entity;
  }
}
```

### 4.2 User Repository (repositories/UserRepository.js)
```javascript
import { BaseRepository } from "./BaseRepository.js";
import { User } from "../entities/User.js";

export class UserRepository extends BaseRepository {
  constructor(dataSource) {
    super(User, dataSource);
  }

  async findByEmail(email) {
    return await this.repository.findOne({ where: { email } });
  }

  async findWithOrders(userId) {
    return await this.repository.findOne({
      where: { id: userId },
      relations: ["orders", "orders.products"]
    });
  }
}
```

### 4.3 Product Repository (repositories/ProductRepository.js)
```javascript
import { BaseRepository } from "./BaseRepository.js";
import { Product } from "../entities/Product.js";

export class ProductRepository extends BaseRepository {
  constructor(dataSource) {
    super(Product, dataSource);
  }

  async findBySlug(slug) {
    return await this.repository.findOne({
      where: { slug },
      relations: ["category"]
    });
  }

  async findWithCategory() {
    return await this.repository.find({
      relations: ["category"],
      order: { createdAt: "DESC" }
    });
  }

  async findByCategory(categoryId) {
    return await this.repository.find({
      where: { category: { id: categoryId } },
      relations: ["category"]
    });
  }

  async search(keyword) {
    return await this.repository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .where("product.name ILIKE :keyword", { keyword: `%${keyword}%` })
      .orWhere("product.description ILIKE :keyword", { keyword: `%${keyword}%` })
      .getMany();
  }

  async findRelated(productId, categoryId) {
    return await this.repository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .where("product.category.id = :categoryId", { categoryId })
      .andWhere("product.id != :productId", { productId })
      .limit(3)
      .getMany();
  }

  async count() {
    return await this.repository.count();
  }

  async paginate(page, limit = 12) {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      relations: ["category"],
      order: { createdAt: "DESC" },
      skip,
      take: limit
    });
  }
}
```

## Phase 5: Controller Updates

### 5.1 Auth Controller Updates
```javascript
// Replace MongoDB calls with repository methods
// Example for register function:
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validations remain the same
    
    // Replace: const existingUser = await User.findOne({ email });
    const existingUser = await userRepository.findByEmail(email);
    
    if (existingUser) {
      return res.json({ error: "Email is taken" });
    }
    
    // Create new user
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password; // Will be hashed by @BeforeInsert
    
    // Replace: const user = await new User({...}).save();
    const savedUser = await userRepository.save(user);
    
    // JWT creation remains the same
    const token = jwt.sign({ _id: savedUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    
    // Response format remains the same
    res.json({
      user: {
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        address: savedUser.address,
      },
      token,
    });
  } catch (err) {
    console.log(err);
  }
};
```

### 5.2 Product Controller Updates
```javascript
// Handle photo storage differently
export const create = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;
    
    // Validations remain the same
    
    const product = new Product();
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.quantity = quantity;
    product.shipping = shipping;
    
    if (photo) {
      // Save photo to file system
      const fileName = `${Date.now()}-${photo.name}`;
      const filePath = `./uploads/products/${fileName}`;
      
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync('./uploads/products')) {
        fs.mkdirSync('./uploads/products', { recursive: true });
      }
      
      fs.copyFileSync(photo.path, filePath);
      product.photoPath = filePath;
      product.photoContentType = photo.type;
    }
    
    const savedProduct = await productRepository.save(product);
    res.json(savedProduct);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

// Photo endpoint update
export const photo = async (req, res) => {
  try {
    const product = await productRepository.findById(req.params.productId);
    if (product.photoPath && fs.existsSync(product.photoPath)) {
      res.set("Content-Type", product.photoContentType);
      return res.send(fs.readFileSync(product.photoPath));
    }
  } catch (err) {
    console.log(err);
  }
};
```

## Phase 6: Database Connection Update

### 6.1 Update index.js
```javascript
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import "reflect-metadata";
import { AppDataSource } from "./data-source.js";

// Import routes
import authRoutes from './routes/auth.js';
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";

dotenv.config();

const app = express();

// Initialize TypeORM connection
AppDataSource.initialize()
  .then(() => {
    console.log("PostgreSQL Connected via TypeORM");
  })
  .catch((error) => console.log("DB Error => ", error));

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Router middleware
app.use('/api', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Node server is running on port ${port}`);
});
```

## Phase 7: Migration Scripts

### 7.1 Initial Schema Migration
```javascript
// migrations/1234567890-InitialSchema.js
export class InitialSchema1234567890 {
  async up(queryRunner) {
    // Create tables
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "email" varchar(255) UNIQUE NOT NULL,
        "password" varchar(255) NOT NULL,
        "address" text,
        "role" integer DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now()
      )
    `);
    
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(32) UNIQUE NOT NULL,
        "slug" varchar(255) UNIQUE NOT NULL
      )
    `);
    
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(160) NOT NULL,
        "slug" varchar(255) UNIQUE NOT NULL,
        "description" text NOT NULL,
        "price" decimal(10,2) NOT NULL,
        "categoryId" uuid REFERENCES categories(id),
        "quantity" integer DEFAULT 0,
        "sold" integer DEFAULT 0,
        "photoPath" varchar(255),
        "photoContentType" varchar(255),
        "shipping" boolean DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now()
      )
    `);
    
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "payment" jsonb,
        "buyerId" uuid REFERENCES users(id),
        "status" varchar(50) DEFAULT 'Not processed',
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now()
      )
    `);
    
    await queryRunner.query(`
      CREATE TABLE "order_products" (
        "order_id" uuid REFERENCES orders(id) ON DELETE CASCADE,
        "product_id" uuid REFERENCES products(id) ON DELETE CASCADE,
        PRIMARY KEY ("order_id", "product_id")
      )
    `);
  }
  
  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "order_products"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
```

### 7.2 Data Migration Script (if migrating existing data)
```javascript
// migrations/data-migration.js
import mongoose from 'mongoose';
import { AppDataSource } from '../data-source.js';
import { User } from '../entities/User.js';
import { Category } from '../entities/Category.js';
import { Product } from '../entities/Product.js';
import { Order } from '../entities/Order.js';

async function migrateData() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI);
  
  // Initialize TypeORM
  await AppDataSource.initialize();
  
  // Get repositories
  const userRepo = AppDataSource.getRepository(User);
  const categoryRepo = AppDataSource.getRepository(Category);
  const productRepo = AppDataSource.getRepository(Product);
  const orderRepo = AppDataSource.getRepository(Order);
  
  // Migrate Users
  const mongoUsers = await MongoUser.find({});
  for (const mongoUser of mongoUsers) {
    const user = new User();
    user.name = mongoUser.name;
    user.email = mongoUser.email;
    user.password = mongoUser.password; // Already hashed
    user.address = mongoUser.address;
    user.role = mongoUser.role;
    user.createdAt = mongoUser.createdAt;
    user.updatedAt = mongoUser.updatedAt;
    await userRepo.save(user);
  }
  
  // Migrate Categories
  const mongoCategories = await MongoCategory.find({});
  for (const mongoCat of mongoCategories) {
    const category = new Category();
    category.name = mongoCat.name;
    category.slug = mongoCat.slug;
    await categoryRepo.save(category);
  }
  
  // Continue for Products and Orders...
  
  console.log("Migration completed!");
  process.exit(0);
}

migrateData().catch(console.error);
```

## Phase 8: Testing Checklist

### 8.1 API Endpoint Testing
- [ ] Test all auth endpoints (register, login, profile update)
- [ ] Test category CRUD operations
- [ ] Test product CRUD operations
- [ ] Test product search and filtering
- [ ] Test order creation and status updates
- [ ] Test file upload for product photos
- [ ] Test pagination and count endpoints
- [ ] Test Braintree payment integration

### 8.2 Response Format Validation
- [ ] Verify User response structure matches original
- [ ] Verify Product response includes populated category
- [ ] Verify Order response includes populated products and buyer
- [ ] Verify error messages remain consistent
- [ ] Verify JWT tokens work correctly

### 8.3 Performance Testing
- [ ] Compare query performance with MongoDB
- [ ] Test connection pooling
- [ ] Test concurrent requests
- [ ] Monitor memory usage

## Phase 9: Deployment Considerations

### 9.1 Database Setup
```sql
-- Create database
CREATE DATABASE ecommercehub;

-- Create UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user and grant privileges
CREATE USER ecommerce_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ecommercehub TO ecommerce_user;
```

### 9.2 Environment-Specific Configurations
```javascript
// data-source.ts for production
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false, // Always false in production
  logging: false,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  entities: ["entities/**/*.js"],
  migrations: ["migrations/**/*.js"],
  extra: {
    max: 100, // Connection pool size
    connectionTimeoutMillis: 10000,
  }
});
```

### 9.3 Rollback Strategy
1. Keep MongoDB connection code in a separate branch
2. Use feature flags to switch between databases
3. Run both databases in parallel during transition
4. Implement data sync mechanism if needed

## Phase 10: Cleanup

### 10.1 Remove MongoDB Dependencies
```bash
npm uninstall mongoose
```

### 10.2 Remove Old Model Files
- Delete `/models` directory with MongoDB schemas
- Remove MongoDB connection code from index.js
- Clean up unused imports

### 10.3 Update Documentation
- Update API documentation
- Update README with PostgreSQL setup instructions
- Document new migration commands

## Troubleshooting Guide

### Common Issues and Solutions

1. **UUID vs ObjectId Compatibility**
   - Use getter methods to maintain `_id` compatibility
   - Update frontend if it expects MongoDB ObjectIds

2. **Photo Storage**
   - Implement proper file upload handling
   - Consider using cloud storage (S3) for production

3. **Relationship Loading**
   - Use `relations` option in find queries
   - Implement lazy loading where appropriate

4. **Transaction Handling**
   ```javascript
   await AppDataSource.transaction(async manager => {
     // Perform transactional operations
   });
   ```

5. **Query Performance**
   - Add appropriate indexes
   - Use query builder for complex queries
   - Implement query result caching

## Conclusion

This migration maintains 100% API compatibility while moving from MongoDB to PostgreSQL. The frontend requires no changes, and all existing functionality is preserved. The TypeORM implementation provides better type safety, SQL query capabilities, and relational database benefits while maintaining the simplicity of the original MongoDB design.

## Next Steps
1. Set up PostgreSQL database locally
2. Run migrations in sequence
3. Test each endpoint thoroughly
4. Deploy to staging environment
5. Monitor performance and optimize as needed
6. Plan production deployment with minimal downtime