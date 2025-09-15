# AWS Modernization Plan for E-Commerce Platform

## Executive Summary

A practical, cost-effective modernization plan to transform the existing MERN e-commerce platform into a modern Next.js 15 + TypeScript + AWS application suitable for portfolio showcase.

**Timeline**: 3 weeks
**Budget**: < $10/month after AWS free tier
**Complexity**: Manageable for single developer

---

## 1. Architecture Overview

### Current Stack (Existing)
- **Backend**: Node.js + Express + TypeORM
- **Database**: PostgreSQL (migrating from MongoDB)
- **Frontend**: React (Bootstrap → Tailwind migration in progress)
- **Authentication**: JWT
- **Payment**: Braintree

### Target Stack (Modernized)
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + TypeORM
- **Database**: AWS RDS PostgreSQL (free tier)
- **Storage**: AWS S3 + CloudFront CDN
- **Authentication**: NextAuth.js / AWS Cognito
- **Email**: AWS SES
- **Deployment**: Vercel (free) or AWS Amplify

---

## 2. AWS Services Selection (Free Tier Focused)

### Core Services (Essential)
```yaml
AWS RDS PostgreSQL:
  - Purpose: Primary database
  - Free Tier: 750 hours/month for 12 months
  - Configuration: db.t3.micro, 20GB storage
  - Cost After: ~$15/month

AWS S3:
  - Purpose: Product images, static assets
  - Free Tier: 5GB storage, 20K GET, 2K PUT requests
  - Cost After: ~$1-2/month

AWS CloudFront:
  - Purpose: CDN for global content delivery
  - Free Tier: 1TB transfer/month for 12 months
  - Cost After: ~$5/month

AWS SES:
  - Purpose: Transactional emails
  - Free Tier: 62,000 emails/month
  - Cost After: $0.10 per 1000 emails
```

### Optional Services (Nice to Have)
```yaml
AWS Cognito:
  - Purpose: User authentication
  - Free Tier: 50,000 MAUs
  - Alternative: NextAuth.js (free)

AWS Lambda:
  - Purpose: Background jobs, image processing
  - Free Tier: 1M requests/month
  - Use Case: Thumbnail generation, email queue

AWS Amplify:
  - Purpose: Deployment alternative to Vercel
  - Free Tier: 1000 build minutes/month
  - Benefit: Better AWS integration
```

---

## 3. TypeORM Integration Strategy

### Database Configuration
```typescript
// lib/database/config.ts
import { DataSource } from "typeorm";
import * as entities from "@/entities";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // AWS RDS connection string
  synchronize: false, // Use migrations in production
  logging: process.env.NODE_ENV === "development",
  entities: Object.values(entities),
  migrations: ["migrations/*.ts"],
  ssl: {
    rejectUnauthorized: false // Required for AWS RDS
  }
});

// Connection helper for Next.js
let initialized = false;

export async function initializeDatabase() {
  if (!initialized) {
    await AppDataSource.initialize();
    initialized = true;
  }
  return AppDataSource;
}
```

### Repository Pattern
```typescript
// repositories/BaseRepository.ts
export abstract class BaseRepository<T> {
  protected repository: Repository<T>;

  constructor(entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(entity);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T | null> {
    await this.repository.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}

// repositories/ProductRepository.ts
export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(Product);
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.repository.find({
      where: { category: { id: categoryId } },
      relations: ["category"]
    });
  }

  async search(query: string): Promise<Product[]> {
    return this.repository
      .createQueryBuilder("product")
      .where("product.name ILIKE :query", { query: `%${query}%` })
      .orWhere("product.description ILIKE :query", { query: `%${query}%` })
      .leftJoinAndSelect("product.category", "category")
      .getMany();
  }
}
```

---

## 4. Next.js 15 Application Structure

### Directory Layout
```
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (shop)/                   # Public shop routes
│   │   ├── products/
│   │   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   ├── cart/
│   │   └── checkout/
│   ├── (user)/                   # Protected user routes
│   │   ├── profile/
│   │   ├── orders/
│   │   └── layout.tsx
│   ├── admin/                    # Admin dashboard
│   │   ├── products/
│   │   ├── orders/
│   │   └── middleware.ts
│   ├── api/                      # API Routes
│   │   ├── products/
│   │   ├── orders/
│   │   ├── auth/
│   │   └── upload/
│   └── layout.tsx
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── features/                 # Feature-specific components
│   └── layouts/
├── entities/                     # TypeORM entities (existing)
│   ├── User.ts
│   ├── Product.ts
│   ├── Order.ts
│   └── Category.ts
├── repositories/                 # Data access layer
├── services/                     # Business logic
├── lib/                         # Utilities and configs
│   ├── database/
│   ├── aws/
│   └── utils/
└── types/                       # TypeScript definitions
```

### API Route Examples
```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ProductRepository } from "@/repositories/ProductRepository";
import { initializeDatabase } from "@/lib/database/config";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const productRepo = new ProductRepository();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    let products;
    if (search) {
      products = await productRepo.search(search);
    } else if (category) {
      products = await productRepo.findByCategory(category);
    } else {
      products = await productRepo.findAll();
    }

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const productRepo = new ProductRepository();
    const data = await request.json();

    const product = await productRepo.create(data);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
```

---

## 5. AWS Integration Implementation

### S3 Image Upload
```typescript
// lib/aws/s3.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function getUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    ContentType: contentType
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

// app/api/upload/route.ts
export async function POST(request: NextRequest) {
  const { fileName, contentType } = await request.json();

  const key = `products/${Date.now()}-${fileName}`;
  const uploadUrl = await getUploadUrl(key, contentType);
  const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;

  return NextResponse.json({ uploadUrl, fileUrl });
}
```

### SES Email Service
```typescript
// lib/aws/ses.ts
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1"
});

export async function sendOrderConfirmation(to: string, orderDetails: any) {
  const command = new SendEmailCommand({
    Source: process.env.FROM_EMAIL!,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: `Order Confirmation #${orderDetails.id}` },
      Body: {
        Html: {
          Data: `
            <h1>Thank you for your order!</h1>
            <p>Order ID: ${orderDetails.id}</p>
            <p>Total: $${orderDetails.total}</p>
            <p>Items: ${orderDetails.items.length}</p>
          `
        }
      }
    }
  });

  return sesClient.send(command);
}
```

### CloudFront CDN Setup
```typescript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.CLOUDFRONT_DOMAIN || 'd1234567890.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: `${process.env.S3_BUCKET_NAME}.s3.amazonaws.com`,
        pathname: '/**',
      }
    ],
  },
}
```

---

## 6. Implementation Phases

### Phase 1: Foundation (Week 1)

#### Day 1-2: Project Setup
- [ ] Create Next.js 15 project with TypeScript
- [ ] Configure TypeORM with existing entities
- [ ] Set up project structure
- [ ] Configure environment variables
- [ ] Set up ESLint and Prettier

#### Day 3-4: AWS Account Setup
- [ ] Create AWS account
- [ ] Set up IAM user with appropriate permissions
- [ ] Create RDS PostgreSQL instance (free tier)
- [ ] Create S3 bucket for images
- [ ] Set up CloudFront distribution
- [ ] Configure SES for email (sandbox mode)

#### Day 5-7: Database Migration
- [ ] Export data from existing database
- [ ] Set up RDS connection
- [ ] Run TypeORM migrations on RDS
- [ ] Import existing data
- [ ] Test database connectivity

### Phase 2: Core Development (Week 2)

#### Day 8-9: Authentication System
- [ ] Implement NextAuth.js or AWS Cognito
- [ ] Create login/register pages
- [ ] Set up JWT tokens
- [ ] Implement protected routes
- [ ] Add user profile management

#### Day 10-11: Product Catalog
- [ ] Create product listing pages
- [ ] Implement product detail pages
- [ ] Add category filtering
- [ ] Implement search functionality
- [ ] Set up pagination

#### Day 12-13: Shopping Cart
- [ ] Implement cart state management (Zustand)
- [ ] Create cart UI components
- [ ] Add cart persistence (localStorage + DB)
- [ ] Implement quantity updates
- [ ] Add cart calculations

#### Day 14: Checkout Process
- [ ] Create checkout flow
- [ ] Integrate payment (Stripe/PayPal)
- [ ] Implement order creation
- [ ] Add order confirmation
- [ ] Send confirmation emails

### Phase 3: Enhancement & Deployment (Week 3)

#### Day 15-16: Admin Dashboard
- [ ] Create admin authentication
- [ ] Build product management CRUD
- [ ] Add order management
- [ ] Implement basic analytics
- [ ] Create inventory tracking

#### Day 17-18: Performance & UX
- [ ] Implement image optimization
- [ ] Add loading states
- [ ] Set up error boundaries
- [ ] Implement SEO (metadata, sitemap)
- [ ] Add PWA features (optional)

#### Day 19-20: Testing & Optimization
- [ ] Write unit tests for critical functions
- [ ] Perform load testing
- [ ] Optimize database queries
- [ ] Implement caching strategies
- [ ] Security audit

#### Day 21: Deployment
- [ ] Deploy to Vercel or AWS Amplify
- [ ] Set up CI/CD pipeline
- [ ] Configure production environment
- [ ] Set up monitoring (CloudWatch)
- [ ] Create documentation

---

## 7. Key Features to Implement

### Essential Features (MVP)
1. **User Management**
   - Registration/Login
   - Profile management
   - Password reset
   - Order history

2. **Product Catalog**
   - Product listing with filters
   - Product search
   - Product details
   - Category navigation

3. **Shopping Cart**
   - Add/remove items
   - Update quantities
   - Persistent cart
   - Guest checkout

4. **Order Management**
   - Checkout process
   - Payment integration
   - Order confirmation
   - Email notifications

5. **Admin Panel**
   - Product CRUD
   - Order management
   - User management
   - Basic analytics

### Advanced Features (If Time Permits)
1. **Real-time Updates**
   - Live inventory counts
   - Price updates
   - Cart synchronization

2. **Enhanced UX**
   - Product recommendations
   - Recently viewed
   - Wishlist
   - Product reviews

3. **Performance**
   - Redis caching
   - Image lazy loading
   - Infinite scroll
   - Search autocomplete

---

## 8. Environment Configuration

### Development (.env.local)
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=ecommerce-images-dev
CLOUDFRONT_DOMAIN=d1234567890.cloudfront.net

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Email
FROM_EMAIL=noreply@yourdomain.com

# Payment
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Production (.env.production)
```bash
# Database (AWS RDS)
DATABASE_URL=postgresql://user:password@your-rds-endpoint.amazonaws.com:5432/ecommerce?sslmode=require

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
S3_BUCKET_NAME=ecommerce-images-prod
CLOUDFRONT_DOMAIN=your-cloudfront-domain.cloudfront.net

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# Email
FROM_EMAIL=noreply@yourdomain.com

# Payment
STRIPE_PUBLIC_KEY=${STRIPE_PUBLIC_KEY}
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
```

---

## 9. Cost Analysis

### AWS Free Tier (First 12 Months)
```yaml
Service         | Free Tier Limit           | Typical Usage | Cost
----------------|---------------------------|---------------|------
RDS PostgreSQL  | 750 hrs/month            | 720 hrs       | $0
S3 Storage      | 5GB, 20K GET, 2K PUT     | 2GB, 10K GET  | $0
CloudFront      | 1TB transfer             | 50GB          | $0
SES             | 62K emails/month         | 1K emails     | $0
Lambda          | 1M requests              | 100K requests | $0
Cognito         | 50K MAUs                 | 100 users     | $0
----------------|---------------------------|---------------|------
Total Monthly   |                          |               | $0
```

### Post Free Tier Costs
```yaml
Service         | Usage           | Monthly Cost
----------------|-----------------|-------------
RDS (t3.micro)  | 720 hrs        | $13
S3 Storage      | 5GB            | $0.12
CloudFront      | 100GB transfer | $8.50
SES             | 5K emails      | $0.50
Domain          | 1 domain       | $1
----------------|-----------------|-------------
Total Monthly   |                | ~$23
```

### Cost Optimization Tips
1. Use Vercel free tier instead of AWS Amplify
2. Implement aggressive caching
3. Optimize images before upload
4. Use CloudFront for all static assets
5. Set up AWS Budget Alerts
6. Use RDS auto-stop for development

---

## 10. Success Metrics

### Technical Metrics
- **Performance**: <3s page load, <200ms API response
- **Availability**: 99.9% uptime
- **SEO**: 90+ Lighthouse score
- **Security**: HTTPS, secure headers, input validation

### Portfolio Impact
- Demonstrates full-stack capabilities
- Shows AWS cloud knowledge
- Modern tech stack (Next.js 15, TypeScript)
- Professional architecture patterns
- Production-ready deployment

---

## 11. Learning Resources

### AWS Resources
- [AWS Free Tier Guide](https://aws.amazon.com/free/)
- [RDS PostgreSQL Setup](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.PostgreSQL.html)
- [S3 with Next.js](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-photo-album.html)
- [SES Email Guide](https://docs.aws.amazon.com/ses/latest/dg/send-email-api.html)

### Next.js Resources
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [TypeORM with Next.js](https://typeorm.io/usage-with-javascript)
- [App Router Guide](https://nextjs.org/docs/app)

### Tutorial Suggestions
- Start with local development first
- Test each AWS service individually
- Use AWS free tier calculator
- Monitor costs daily initially

---

## 12. Risk Mitigation

### Common Pitfalls to Avoid
1. **Database Connections**: Use connection pooling
2. **Cold Starts**: Keep Lambda warm or use Edge functions
3. **CORS Issues**: Configure properly in API routes
4. **TypeORM in Serverless**: Manage connections carefully
5. **AWS Costs**: Set up billing alerts immediately

### Backup Plans
- **If AWS is complex**: Start with local PostgreSQL, migrate later
- **If costs concern**: Use Supabase (free tier) instead of RDS
- **If deployment issues**: Use Vercel instead of AWS Amplify
- **If time runs out**: Focus on core features, skip advanced

---

## Conclusion

This modernization plan provides a practical path to transform your e-commerce platform using modern technologies while staying within budget and timeline constraints. The combination of Next.js 15, TypeORM, and AWS services creates an impressive portfolio piece that demonstrates real-world skills employers value.

**Key Advantages:**
- Leverages existing TypeORM work
- Uses AWS free tier effectively
- Achievable in 3 weeks
- Costs under $25/month
- Shows modern development practices
- Scalable architecture

Start with Phase 1 and progress systematically. Each phase builds on the previous, ensuring a working application at every stage.