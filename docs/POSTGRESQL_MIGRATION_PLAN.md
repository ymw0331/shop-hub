# PostgreSQL Migration Plan

## Overview
Step-by-step plan to migrate from MongoDB/Mongoose to PostgreSQL/TypeORM.

---

## Phase 1: Setup TypeORM (Week 1, Days 1-2)

### 1.1 Install Dependencies
```bash
npm install typeorm reflect-metadata pg @types/node
npm install --save-dev @types/express
```

### 1.2 Configure TypeScript for TypeORM
Update `tsconfig.json`:
- Enable `experimentalDecorators: true`
- Enable `emitDecoratorMetadata: true`
- Set `strictPropertyInitialization: false`

### 1.3 Create Database Configuration
Create `src/config/database.ts`:
- Setup DataSource with PostgreSQL connection
- Configure entities, migrations paths
- Add connection initialization function

---

## Phase 2: Create TypeORM Entities (Week 1, Days 3-4)

### 2.1 User Entity (`src/entities/User.ts`)
Map from Mongoose model:
- `name`: String → `@Column({ type: "varchar" })`
- `email`: String (unique) → `@Column({ unique: true })`
- `password`: String → `@Column()`
- `address`: String → `@Column({ nullable: true })`
- `role`: Number → `@Column({ type: "int", default: 0 })`
- Add `@PrimaryGeneratedColumn("uuid")` for id
- Add `@CreateDateColumn()` and `@UpdateDateColumn()`
- Add `@OneToMany()` relation to Orders

### 2.2 Category Entity (`src/entities/Category.ts`)
Map from Mongoose model:
- `name`: String (unique) → `@Column({ unique: true })`
- `slug`: String (unique) → `@Column({ unique: true })`
- Add `@OneToMany()` relation to Products

### 2.3 Product Entity (`src/entities/Product.ts`)
Map from Mongoose model:
- `name`: String → `@Column()`
- `slug`: String → `@Column({ unique: true })`
- `description`: Mixed → `@Column({ type: "text" })`
- `price`: Number → `@Column({ type: "decimal", precision: 10, scale: 2 })`
- `quantity`: Number → `@Column({ type: "int" })`
- `sold`: Number → `@Column({ type: "int", default: 0 })`
- `photo`: Buffer → Change to `photoUrl: @Column({ nullable: true })`
- `shipping`: Boolean → `@Column({ type: "boolean" })`
- `category`: ObjectId → `@ManyToOne()` relation to Category

### 2.4 Order Entity (`src/entities/Order.ts`)
Map from Mongoose model:
- `products`: Array of ObjectIds → `@ManyToMany()` relation to Products
- `payment`: Mixed → `@Column({ type: "jsonb" })`
- `buyer`: ObjectId → `@ManyToOne()` relation to User
- `status`: String with enum → `@Column({ type: "enum", enum: OrderStatus })`
- Create OrderStatus enum

---

## Phase 3: Create Repository Layer (Week 1, Day 5)

### 3.1 Base Repository Pattern
Create abstract `BaseRepository<T>` with common CRUD operations:
- `findAll()`
- `findById(id)`
- `create(data)`
- `update(id, data)`
- `delete(id)`

### 3.2 Specific Repositories
- **UserRepository**: Add `findByEmail()`, `comparePassword()`
- **CategoryRepository**: Add `findBySlug()`
- **ProductRepository**: Add `search()`, `findByCategory()`, `updateQuantity()`
- **OrderRepository**: Add `findByUser()`, `updateStatus()`

---

## Phase 4: Update Controllers (Week 2, Days 1-3)

### 4.1 Auth Controller (`controllers/auth.ts`)
Replace Mongoose operations:
- `User.findOne()` → `userRepository.findByEmail()`
- `new User().save()` → `userRepository.create()`
- `user.comparePassword()` → `userRepository.comparePassword()`

### 4.2 Category Controller
Replace Mongoose operations:
- `Category.find()` → `categoryRepository.findAll()`
- `new Category().save()` → `categoryRepository.create()`
- Use slugify for generating slugs

### 4.3 Product Controller
Replace Mongoose operations:
- Handle file upload differently (store URL instead of Buffer)
- `Product.find().populate()` → Include relations in repository
- Implement pagination with TypeORM

### 4.4 Order Controller
Replace Mongoose operations:
- Update order creation with proper relations
- Handle payment data as JSON

---

## Phase 5: Database Migration (Week 2, Day 4)

### 5.1 Create Migration Files
```bash
npm run typeorm migration:generate -- -n InitialMigration
```

### 5.2 Data Migration Script
Create `src/scripts/migrate-data.ts`:
1. Connect to both MongoDB and PostgreSQL
2. Migrate data in order:
   - Categories first (no dependencies)
   - Users (no dependencies)
   - Products (depends on Categories)
   - Orders (depends on Users and Products)
3. Handle data transformations:
   - Convert ObjectIds to UUIDs
   - Convert photo Buffer to URL
   - Maintain relationships

### 5.3 Run Migrations
```bash
npm run typeorm migration:run
node src/scripts/migrate-data.js
```

---

## Phase 6: Update Routes & Middleware (Week 2, Day 5)

### 6.1 Update Middleware
- Modify auth middleware to work with TypeORM entities
- Update admin check middleware

### 6.2 Update Route Handlers
- Ensure all routes use new controllers
- Update error handling for TypeORM errors

---

## Phase 7: Testing & Validation (Week 2, Days 6-7)

### 7.1 Test All Endpoints
- User registration/login
- Category CRUD operations
- Product CRUD with image upload
- Order creation and management
- Search functionality

### 7.2 Validate Data Integrity
- Check all relationships are maintained
- Verify data migrated correctly
- Test pagination and filtering

### 7.3 Performance Testing
- Compare query performance
- Optimize slow queries with indexes
- Add database connection pooling

---

## Phase 8: Cleanup (Week 3, Day 1)

### 8.1 Remove MongoDB Dependencies
```bash
npm uninstall mongoose
```

### 8.2 Remove Old Files
- Delete `/models` directory
- Remove MongoDB connection code
- Update environment variables

### 8.3 Update Documentation
- Update README with PostgreSQL setup
- Document new database schema
- Add migration instructions

---

## Key Differences to Remember

### MongoDB/Mongoose → PostgreSQL/TypeORM

1. **IDs**: ObjectId → UUID
2. **Relations**: References → Foreign Keys
3. **Nested Objects**: Embedded → JSON columns or separate tables
4. **Queries**:
   - `find()` → `repository.find()`
   - `populate()` → `relations: ["category"]`
   - `findByIdAndUpdate()` → `repository.update()`
5. **Validation**: Mongoose schema → TypeORM decorators + class-validator
6. **Middleware**: Mongoose hooks → TypeORM subscribers
7. **Transactions**: Different syntax and approach

---

## Environment Variables

Update `.env`:
```bash
# Remove
MONGO_URI=mongodb://...

# Add
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=ecommerce
```

---

## Common Issues & Solutions

### Issue 1: Relations Not Loading
**Solution**: Always specify relations in find options:
```typescript
repository.find({ relations: ["category"] })
```

### Issue 2: Unique Constraint Violations
**Solution**: Check for existing records before insert:
```typescript
const existing = await repository.findOne({ where: { email } });
if (existing) throw new Error("Email already exists");
```

### Issue 3: Transaction Handling
**Solution**: Use QueryRunner for transactions:
```typescript
const queryRunner = dataSource.createQueryRunner();
await queryRunner.startTransaction();
try {
  // operations
  await queryRunner.commitTransaction();
} catch (err) {
  await queryRunner.rollbackTransaction();
}
```

---

## Success Checklist

- [ ] All Mongoose models converted to TypeORM entities
- [ ] All controllers updated to use repositories
- [ ] Data successfully migrated from MongoDB to PostgreSQL
- [ ] All API endpoints tested and working
- [ ] MongoDB dependencies removed
- [ ] Application runs without MongoDB
- [ ] Performance is acceptable
- [ ] Documentation updated

---

## Next Steps

After completing this migration:
1. Test thoroughly in development
2. Create backup of MongoDB data
3. Deploy to staging environment
4. Run migration in production
5. Proceed with AWS_MODERNIZATION_PLAN.md for Next.js upgrade