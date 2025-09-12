# Cursor AI Prompt for MongoDB to PostgreSQL Migration

## Project Context
I'm migrating an e-commerce application from MongoDB/Mongoose to PostgreSQL/TypeORM. The frontend is already modernized with Tailwind CSS and must remain unchanged. All API endpoints must maintain exact response formats for frontend compatibility.

## Current Architecture
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose ORM
- **Models**: User, Product, Category, Order
- **Authentication**: JWT tokens
- **Payment**: Braintree integration
- **Photo Storage**: Currently stored as Buffer in MongoDB (needs migration to file system)
- **Frontend**: React with Tailwind CSS (already modernized, no changes needed)

## Migration Requirements
1. **Zero Breaking Changes**: All API endpoints must return identical response structures
2. **Maintain MongoDB ID Compatibility**: Use UUID with `_id` getter for JWT compatibility
3. **Photo Storage Migration**: Move from Buffer storage to file system
4. **Keep All Existing Features**: Authentication, payment processing, order management

## Step-by-Step Migration Guide

### STEP 1: Environment Setup
**What to do**: Install TypeORM and PostgreSQL dependencies
```bash
npm install typeorm pg reflect-metadata
npm install --save-dev @types/node
```
**Why**: TypeORM is our ORM for PostgreSQL, pg is the PostgreSQL driver, reflect-metadata is required for TypeORM decorators to work.

### STEP 2: PostgreSQL Database Setup
**What to do**: Create a PostgreSQL database
```sql
CREATE DATABASE ecommercehub;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```
**Why**: We need a database to store our data, and uuid-ossp extension generates UUIDs for primary keys.

### STEP 3: Environment Variables
**What to do**: Add PostgreSQL configuration to `.env`
```env
# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=ecommercehub

# Keep existing variables
MONGO_URI=your_mongo_uri  # Keep for reference during migration
JWT_SECRET=your_jwt_secret
BRAINTREE_MERCHANT_ID=your_merchant_id
BRAINTREE_PUBLIC_KEY=your_public_key
BRAINTREE_PRIVATE_KEY=your_private_key
SENDGRID_KEY=your_sendgrid_key
```
**Why**: TypeORM needs connection details to connect to PostgreSQL.

### STEP 4: Create TypeORM Configuration
**What to do**: Create `data-source.js` in root directory
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
  synchronize: process.env.NODE_ENV === "development", // Auto-create tables in dev
  logging: process.env.NODE_ENV === "development",
  entities: ["entities/**/*.js"],
  migrations: ["migrations/**/*.js"],
});
```
**Why**: This configures how TypeORM connects to PostgreSQL and where to find our entities and migrations.

### STEP 5: Create Entity Files
**What to do**: Create `/entities` folder with TypeORM entities

**5.1 User Entity** (`entities/User.js`):
```javascript
import { EntitySchema } from "typeorm";
import { hashPassword } from "../helpers/auth.js";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid"
    },
    name: {
      type: "varchar",
      length: 255
    },
    email: {
      type: "varchar",
      length: 255,
      unique: true
    },
    password: {
      type: "varchar",
      length: 255
    },
    address: {
      type: "text",
      nullable: true
    },
    role: {
      type: "int",
      default: 0
    },
    createdAt: {
      type: "timestamp",
      createDate: true
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true
    }
  },
  relations: {
    orders: {
      type: "one-to-many",
      target: "Order",
      inverseSide: "buyer"
    }
  }
});
```
**Why**: This defines the User table structure in PostgreSQL. The UUID primary key replaces MongoDB's ObjectId.

**5.2 Category Entity** (`entities/Category.js`):
```javascript
import { EntitySchema } from "typeorm";

export const Category = new EntitySchema({
  name: "Category",
  tableName: "categories",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid"
    },
    name: {
      type: "varchar",
      length: 32,
      unique: true
    },
    slug: {
      type: "varchar",
      length: 255,
      unique: true
    }
  },
  relations: {
    products: {
      type: "one-to-many",
      target: "Product",
      inverseSide: "category"
    }
  }
});
```
**Why**: Categories organize products. The slug is used for SEO-friendly URLs.

**5.3 Product Entity** (`entities/Product.js`):
```javascript
import { EntitySchema } from "typeorm";

export const Product = new EntitySchema({
  name: "Product",
  tableName: "products",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid"
    },
    name: {
      type: "varchar",
      length: 160
    },
    slug: {
      type: "varchar",
      length: 255,
      unique: true
    },
    description: {
      type: "text"
    },
    price: {
      type: "decimal",
      precision: 10,
      scale: 2
    },
    quantity: {
      type: "int",
      default: 0
    },
    sold: {
      type: "int",
      default: 0
    },
    photoPath: {
      type: "varchar",
      nullable: true
    },
    photoContentType: {
      type: "varchar",
      nullable: true
    },
    shipping: {
      type: "boolean",
      default: false
    },
    createdAt: {
      type: "timestamp",
      createDate: true
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true
    }
  },
  relations: {
    category: {
      type: "many-to-one",
      target: "Category",
      joinColumn: true,
      eager: true
    }
  }
});
```
**Why**: Products now store photo paths instead of Buffer data, improving performance.

**5.4 Order Entity** (`entities/Order.js`):
```javascript
import { EntitySchema } from "typeorm";

export const Order = new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid"
    },
    payment: {
      type: "jsonb",
      nullable: true
    },
    status: {
      type: "enum",
      enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Not processed"
    },
    createdAt: {
      type: "timestamp",
      createDate: true
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true
    }
  },
  relations: {
    products: {
      type: "many-to-many",
      target: "Product",
      joinTable: {
        name: "order_products",
        joinColumn: { name: "order_id" },
        inverseJoinColumn: { name: "product_id" }
      }
    },
    buyer: {
      type: "many-to-one",
      target: "User",
      joinColumn: true
    }
  }
});
```
**Why**: Orders link users to their purchased products with payment details stored as JSON.

### STEP 6: Create Repository Layer
**What to do**: Create `/repositories` folder for data access

**6.1 Base Repository** (`repositories/BaseRepository.js`):
```javascript
export class BaseRepository {
  constructor(entity, dataSource) {
    this.repository = dataSource.getRepository(entity);
  }

  async findOne(conditions) {
    return await this.repository.findOne({ where: conditions });
  }

  async findById(id) {
    // Add _id getter for MongoDB compatibility
    const entity = await this.repository.findOne({ where: { id } });
    if (entity) {
      entity._id = entity.id;
    }
    return entity;
  }

  async find(conditions = {}) {
    const entities = await this.repository.find(conditions);
    // Add _id getter for each entity
    return entities.map(entity => {
      entity._id = entity.id;
      return entity;
    });
  }

  async save(entity) {
    const saved = await this.repository.save(entity);
    saved._id = saved.id;
    return saved;
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
**Why**: This base class provides common database operations that all repositories will inherit, reducing code duplication.

### STEP 7: Update Controllers
**What to do**: Modify controllers to use TypeORM instead of Mongoose

**Example - Auth Controller Update** (`controllers/auth.js`):
```javascript
// Before (MongoDB/Mongoose):
const existingUser = await User.findOne({ email });

// After (PostgreSQL/TypeORM):
const existingUser = await userRepository.findByEmail(email);

// Creating new user - Before:
const user = await new User({ name, email, password }).save();

// Creating new user - After:
const user = await userRepository.save({ name, email, password });
```
**Why**: Controllers now use repository pattern instead of direct Mongoose model calls.

### STEP 8: Photo Storage Migration
**What to do**: Update product photo handling

**8.1** Create uploads directory:
```bash
mkdir -p uploads/products
```

**8.2** Update product creation to save photos to file system:
```javascript
// In product controller
if (photo) {
  const fileName = `${Date.now()}-${photo.name}`;
  const filePath = `./uploads/products/${fileName}`;
  
  fs.copyFileSync(photo.path, filePath);
  product.photoPath = filePath;
  product.photoContentType = photo.type;
}
```
**Why**: File system storage is more efficient than storing binary data in the database.

### STEP 9: Update Main Server File
**What to do**: Update `index.js` to use TypeORM

```javascript
import "reflect-metadata";
import { AppDataSource } from "./data-source.js";

// Initialize TypeORM connection
AppDataSource.initialize()
  .then(() => {
    console.log("PostgreSQL Connected via TypeORM");
    
    // Start server after DB connection
    app.listen(port, () => {
      console.log(`Node server is running on port ${port}`);
    });
  })
  .catch((error) => console.log("DB Error => ", error));
```
**Why**: TypeORM needs to initialize before the server starts to ensure database connection is ready.

### STEP 10: Data Migration
**What to do**: Migrate existing MongoDB data to PostgreSQL

**10.1** Export MongoDB data:
```bash
mongoexport --db=ecommerce --collection=users --out=users.json
mongoexport --db=ecommerce --collection=categories --out=categories.json
mongoexport --db=ecommerce --collection=products --out=products.json
mongoexport --db=ecommerce --collection=orders --out=orders.json
```

**10.2** Create migration script (`migrate-data.js`):
```javascript
// Script to transform and import MongoDB data to PostgreSQL
// Handles ID mapping, photo extraction, relationship linking
```
**Why**: We need to preserve existing data during the migration.

### STEP 11: Testing
**What to do**: Test all API endpoints

**Test Checklist**:
- [ ] User registration creates user in PostgreSQL
- [ ] Login returns JWT token with user._id
- [ ] Product creation saves photo to file system
- [ ] Product photo endpoint serves files correctly
- [ ] Category CRUD operations work
- [ ] Order creation links products and buyer
- [ ] All frontend pages load without errors
- [ ] Search and filtering work correctly

**Why**: Ensure no breaking changes affect the frontend.

### STEP 12: Cleanup
**What to do**: Remove MongoDB dependencies

```bash
npm uninstall mongoose
```
- Delete `/models` folder
- Remove MongoDB connection code
- Update documentation

**Why**: Clean up unused code and dependencies.

## Important Notes for Cursor

1. **Maintain API Compatibility**: NEVER change response structures. The frontend expects:
   - User objects with `_id` field
   - Products with populated category
   - Orders with populated products and buyer

2. **Handle Async Operations**: All TypeORM operations are async. Always use async/await.

3. **Error Handling**: Wrap database operations in try-catch blocks.

4. **Testing**: Test each endpoint after migration to ensure frontend compatibility.

5. **Rollback Plan**: Keep MongoDB code in a backup branch until migration is verified in production.

## Common Issues and Solutions

1. **JWT Token Issues**: Ensure `_id` is available on user objects for JWT signing
2. **Photo Display Issues**: Update photo endpoint to read from file system
3. **Relationship Loading**: Use `relations` option or `leftJoinAndSelect` for eager loading
4. **Transaction Handling**: Use TypeORM's transaction manager for multi-table operations

## Commands Reference
```bash
# Run development server
npm run dev

# Run TypeORM migrations
npm run typeorm migration:run

# Revert last migration
npm run typeorm migration:revert

# Generate new migration
npm run typeorm migration:generate -- -n MigrationName
```

This migration maintains 100% API compatibility while modernizing the database layer. The frontend requires NO changes.