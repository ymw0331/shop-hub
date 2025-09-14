# ShopHub - Modern Full-Stack E-Commerce Marketplace

A production-ready e-commerce marketplace platform built with modern technologies and best practices. Originally based on Ryan Dhungel's Udemy course, now fully modernized with PostgreSQL, TypeScript, and enterprise-grade architecture.

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (migrated from MongoDB)
- **ORM**: TypeORM
- **Authentication**: JWT with role-based access control
- **Payment**: Braintree (Sandbox ready)
- **Email**: SendGrid integration
- **Logging**: Winston with daily rotation
- **File Storage**: Local filesystem with static serving

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS (migrated from Bootstrap)
- **UI Components**: Custom component library
- **State Management**: Context API
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## ✨ Features

### User Features
- 🛍️ Browse products with advanced search and filtering
- 🔍 Search products by name, category, or price range
- 📦 Product details with image gallery and related products
- 🛒 Shopping cart with persistent storage
- 💳 Secure checkout with Braintree payment integration
- 👤 User registration and authentication
- 📱 Fully responsive design with dark mode support
- 📧 Email notifications for order updates
- 📋 Order history and tracking

### Admin Features
- 📊 Admin dashboard with statistics
- 🏷️ Category management (CRUD operations)
- 📦 Product management with image upload
- 📋 Order management with status updates
- 👥 User management and role assignment
- 📈 Sales analytics and reporting

### Technical Features
- 🔐 JWT-based authentication with refresh tokens
- 🛡️ Role-based access control (User/Admin)
- 📸 Image upload and optimization
- 🔄 Real-time inventory tracking
- 📱 Mobile-first responsive design
- 🌙 Dark mode support
- ⚡ Optimized database queries with indexes
- 📝 Comprehensive logging system
- 🧪 Testing-ready architecture

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Database Setup

1. Create PostgreSQL database:
```bash
createdb shophub_db
```

2. Create a PostgreSQL user:
```sql
CREATE USER shophub_user WITH PASSWORD 'shophub_password_123';
GRANT ALL PRIVILEGES ON DATABASE shophub_db TO shophub_user;
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=shophub_user
POSTGRES_PASSWORD=shophub_password_123
POSTGRES_DB=shophub_db

# Application Configuration
NODE_ENV=development
PORT=8000
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-complex
JWT_EXPIRES_IN=7d

# Braintree Configuration (Sandbox)
BRAINTREE_MERCHANT_ID=your_sandbox_merchant_id
BRAINTREE_PUBLIC_KEY=your_sandbox_public_key
BRAINTREE_PRIVATE_KEY=your_sandbox_private_key
BRAINTREE_ENVIRONMENT=sandbox

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key

# Frontend Configuration
REACT_APP_API=http://localhost:8000/api
REACT_APP_SERVER=http://localhost:8000
```

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shophub.git
cd shophub
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

4. Build TypeScript:
```bash
npm run build
```

5. Seed the database with sample data:
```bash
npm run db:seed
npm run db:images
```

### Running the Application

#### Development Mode

1. Start the backend server:
```bash
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd client
npm start
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api

#### Production Mode

1. Build the backend:
```bash
npm run build
```

2. Build the frontend:
```bash
cd client
npm run build
```

3. Start the production server:
```bash
npm start
```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Full Testing Guide](docs/FULL_TESTING_GUIDE.md)** - Complete UI and API testing documentation
- **[Database Setup](docs/DB_SETUP.md)** - PostgreSQL setup and configuration
- **[Data Seeding Plan](docs/MARKETPLACE_DATA_SEEDING_PLAN.md)** - Strategy for populating realistic demo data
- **[Improvement Roadmap](docs/MARKETPLACE_IMPROVEMENT_PLAN.md)** - Future enhancements and features

## 🧪 Testing

### API Testing
Use the provided testing guide for comprehensive API testing with Postman or VS Code REST Client.

### Frontend Testing
The application includes test scenarios for all user journeys and admin functions.

### Test Accounts
```javascript
// Regular User
Email: customer@test.com
Password: password123

// Admin User
Email: admin@test.com
Password: admin123456
```

### Sandbox Payment Testing
Use these test credit cards in Braintree sandbox:
- Success: `4111111111111111`
- Declined: `4000111111111115`
- Insufficient Funds: `4009348888881881`

## 📦 Database Management

### Useful Commands

```bash
# Clear database
npm run db:clear

# Seed with fresh data
npm run db:seed

# Generate product images
npm run db:images

# Run TypeORM migrations
npm run typeorm migration:run
```

## 🚀 Deployment

The application is deployment-ready for various platforms:

- **Vercel**: Frontend deployment with environment variables
- **Railway/Render**: Backend and database hosting
- **AWS**: Full-stack deployment with RDS and S3
- **Docker**: Containerized deployment (Dockerfile included)

## 📈 Performance Optimizations

- Database indexing for faster queries
- Image lazy loading and optimization
- React component memoization
- API response caching strategy
- Connection pooling for database
- Static asset CDN ready

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- SQL injection prevention via TypeORM
- XSS protection
- CORS configuration
- Rate limiting ready
- Input validation and sanitization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Original course by [Ryan Dhungel](https://www.udemy.com/course/react-ecommerce/)
- Modernization and PostgreSQL migration by Wayne Yong
- UI components inspired by modern e-commerce platforms
- Community contributors and testers

## 📧 Contact

Wayne Yong - [GitHub](https://github.com/ymw0331)

Project Link: [https://github.com/ymw0331/shophub](https://github.com/ymw0331/shophub)

---

**Note**: ShopHub has been significantly enhanced from its original form with modern architecture, PostgreSQL database, TypeScript implementation, and production-ready features suitable for portfolio demonstration.