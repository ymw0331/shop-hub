# E-Commerce Hub Complete Testing Guide (UI + API)

## Table of Contents
1. [Environment Setup](#environment-setup)
2. [Test User Accounts](#test-user-accounts)
3. [UI Testing - Customer Journey](#ui-testing---customer-journey)
4. [UI Testing - Admin Dashboard](#ui-testing---admin-dashboard)
5. [API Testing with UI Correlation](#api-testing-with-ui-correlation)
6. [End-to-End Testing Scenarios](#end-to-end-testing-scenarios)
7. [Payment Testing](#payment-testing)
8. [Troubleshooting Guide](#troubleshooting-guide)

---

## Environment Setup

### 1. Prerequisites

```bash
# Backend (Port 8000)
cd /Users/wayneyong/Documents/Portfolios/e-commercehub
npm install
npm run dev

# Frontend (Port 3000)
cd client
npm install
npm start
```

### 2. Environment Variables (.env)

```env
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=shophub_user
POSTGRES_PASSWORD=shophub_password_123
POSTGRES_DB=shophub_db

# Application
NODE_ENV=development
PORT=8000
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-complex

# Braintree Sandbox (Get from https://sandbox.braintreegateway.com)
BRAINTREE_MERCHANT_ID=your_sandbox_merchant_id
BRAINTREE_PUBLIC_KEY=your_sandbox_public_key
BRAINTREE_PRIVATE_KEY=your_sandbox_private_key
BRAINTREE_ENVIRONMENT=sandbox

# Brevo Email Service (Get from https://www.brevo.com)
BREVO_API_KEY=xkeysib-your-brevo-api-key
BREVO_SENDER_EMAIL=noreply@shophub.com
BREVO_SENDER_NAME=ShopHub
```

### 3. Database Setup

```bash
# Create database
createdb shophub_db

# Clear existing data (if needed)
npm run db:clear

# Seed test data
npm run db:seed

# Generate product images
npm run db:images
```

### 4. Getting Sandbox Credentials

#### Braintree Sandbox (2025)
1. Go to: https://sandbox.braintreegateway.com
2. Sign up (select United States)
3. Dashboard → Settings → API Keys
4. Copy: Merchant ID, Public Key, Private Key

**Test Credit Cards:**
```
Success: 4111111111111111
Declined: 4000111111111115
Invalid: 4242424242424242

CVV: Any 3 digits
Expiry: Any future date
```

#### Brevo (Recommended - 300 emails/day FREE)
1. Go to: https://www.brevo.com
2. Sign up and verify your email
3. Navigate: Settings → SMTP & API
4. Create API Key → Name: "ShopHub Production"
5. Copy the API key immediately

---

## Test User Accounts

### Pre-configured Test Users

```javascript
// Regular Customer
{
  email: "customer@test.com",
  password: "password123",
  role: 0  // Customer
}

// Admin User
{
  email: "admin@test.com",
  password: "admin123456",
  role: 1  // Admin
}

// Test Customer 2
{
  email: "john.doe@test.com",
  password: "password123",
  role: 0
}
```

### Creating New Test Users

```sql
-- Make existing user an admin
UPDATE users SET role = 1 WHERE email = 'your-email@test.com';
```

---

## UI Testing - Customer Journey

### 1. Homepage Testing

**URL:** http://localhost:3000

**Test Checklist:**
- [ ] Hero section loads with carousel/banner
- [ ] Categories display correctly
- [ ] "New Arrivals" section shows latest products
- [ ] "Best Sellers" section shows popular products
- [ ] Product cards display:
  - [ ] Product image
  - [ ] Name
  - [ ] Price
  - [ ] "Add to Cart" button
  - [ ] Category badge
  - [ ] Stock status
- [ ] "Load More" button works (pagination)
- [ ] Dark mode toggle works

**Expected API Calls:**
```javascript
// On page load
GET /api/products-count
GET /api/list-products/1
GET /api/categories
```

### 2. User Registration Flow

**URL:** http://localhost:3000/register

**Test Steps:**
1. Click "Sign Up" in navigation
2. Fill registration form:
   - Name: "Test User"
   - Email: "newuser@test.com"
   - Password: "password123"
3. Click "Register"

**Validation Tests:**
- [ ] Empty name shows error: "Name is required"
- [ ] Invalid email shows error: "Please enter a valid email"
- [ ] Password < 6 chars shows error: "Password must be at least 6 characters"
- [ ] Duplicate email shows error: "Email is already registered"

**Success Indicators:**
- [ ] Redirects to dashboard/home
- [ ] Shows success toast
- [ ] User menu appears in navbar
- [ ] Cart persists after registration

**API Correlation:**
```bash
POST /api/register
Body: { name, email, password }
Response: { user: {...}, token: "jwt-token" }
```

### 3. User Login Flow

**URL:** http://localhost:3000/login

**Test Steps:**
1. Enter email: "customer@test.com"
2. Enter password: "password123"
3. Click "Login"

**Error Scenarios:**
- [ ] Wrong email: "Invalid email or password"
- [ ] Wrong password: "Invalid email or password"
- [ ] Empty fields: Field validation errors

**Success Indicators:**
- [ ] Redirects to intended page or dashboard
- [ ] User name appears in navbar
- [ ] Cart items restored (if any)
- [ ] "Logout" option available

**API Correlation:**
```bash
POST /api/login
Body: { email, password }
Response: { user: {...}, token: "jwt-token" }
```

### 4. Product Browsing & Search

**URL:** http://localhost:3000/shop

**Filter Testing:**
- [ ] Category checkboxes filter products
- [ ] Price range slider works
- [ ] Sort dropdown (Newest, Popular, Price Low-High, Price High-Low)
- [ ] Search bar filters products in real-time
- [ ] Clear filters button resets all

**Product Grid Testing:**
- [ ] Grid/List view toggle
- [ ] Product hover effects
- [ ] Quick view opens modal
- [ ] Image lazy loading
- [ ] Out of stock items are grayed out

**Search Testing:**
- [ ] Search "iphone" returns Apple products
- [ ] Search "laptop" returns computers
- [ ] No results shows empty state
- [ ] Search persists when navigating back

**API Correlation:**
```bash
GET /api/products
POST /api/filtered-products
Body: { checked: [categoryIds], radio: [minPrice, maxPrice] }
GET /api/products/search/keyword
```

### 5. Product Details Page

**URL:** http://localhost:3000/product/:slug

**Test Checklist:**
- [ ] Product images display (main + thumbnails)
- [ ] Image zoom on hover
- [ ] Product information displays:
  - [ ] Name, price, description
  - [ ] Category
  - [ ] Stock status
  - [ ] Shipping info
- [ ] Quantity selector works
- [ ] Add to cart button:
  - [ ] Disabled when out of stock
  - [ ] Shows success toast
  - [ ] Updates cart counter
- [ ] Related products section loads

**API Correlation:**
```bash
GET /api/product/slug-name
GET /api/products/related/:productId/:categoryId
GET /api/product/photo/:productId
```

### 6. Shopping Cart

**URL:** http://localhost:3000/cart

**Cart Drawer Testing:**
- [ ] Opens when cart icon clicked
- [ ] Shows cart items with:
  - [ ] Product image
  - [ ] Name and price
  - [ ] Quantity controls
  - [ ] Remove button
- [ ] Updates total in real-time
- [ ] "Continue Shopping" closes drawer
- [ ] "Checkout" navigates to checkout

**Cart Page Testing:**
- [ ] Displays all cart items
- [ ] Quantity +/- buttons work
- [ ] Remove item works
- [ ] Shows order summary:
  - [ ] Subtotal
  - [ ] Shipping
  - [ ] Tax (if applicable)
  - [ ] Total
- [ ] Empty cart shows message
- [ ] "Continue Shopping" button works

**Local Storage:**
```javascript
// Check browser console
localStorage.getItem('cart')
// Should contain array of product objects
```

### 7. Checkout Process

**URL:** http://localhost:3000/checkout

**Guest Checkout:**
- [ ] Redirects to login if not authenticated
- [ ] Option to continue as guest (if implemented)

**Authenticated Checkout:**
1. **Shipping Information:**
   - [ ] Pre-filled if profile has address
   - [ ] Form validation works
   - [ ] Save address checkbox

2. **Payment Information:**
   - [ ] Braintree Drop-in UI loads
   - [ ] Credit card form appears
   - [ ] PayPal option available

3. **Order Review:**
   - [ ] Shows all items
   - [ ] Displays total
   - [ ] Edit cart link works

**Test Payment:**
```javascript
// Use test card
Card: 4111111111111111
Expiry: 12/29
CVV: 123
```

**Success Flow:**
- [ ] Shows processing spinner
- [ ] Redirects to success page
- [ ] Shows order confirmation
- [ ] Receives email (if configured)
- [ ] Cart is cleared

**API Correlation:**
```bash
GET /api/braintree/getToken/:userId
POST /api/braintree/payment/:userId
Body: { nonce, cart, amount }
```

### 8. User Dashboard

**URL:** http://localhost:3000/dashboard

**Profile Section:**
- [ ] Shows user info
- [ ] Edit profile form:
  - [ ] Update name
  - [ ] Update address
  - [ ] Change password
- [ ] Save changes works

**Order History:**
- [ ] Lists all orders
- [ ] Shows order:
  - [ ] Order ID
  - [ ] Date
  - [ ] Items
  - [ ] Total
  - [ ] Status badge
- [ ] Click order for details
- [ ] Pagination if many orders

**API Correlation:**
```bash
GET /api/orders/:userId
PUT /api/profile/:userId
Body: { name, address, password }
```

---

## UI Testing - Admin Dashboard

### 1. Admin Login

**URL:** http://localhost:3000/login

**Steps:**
1. Login with admin@test.com / admin123456
2. Should see "Admin" menu in navbar

### 2. Admin Dashboard

**URL:** http://localhost:3000/admin/dashboard

**Test Checklist:**
- [ ] Shows statistics cards:
  - [ ] Total Products
  - [ ] Total Orders
  - [ ] Total Users
  - [ ] Revenue
- [ ] Recent orders table
- [ ] Quick actions buttons
- [ ] Charts/graphs (if implemented)

### 3. Category Management

**URL:** http://localhost:3000/admin/category

**Create Category:**
1. Click "Add Category"
2. Enter name: "Test Category"
3. Slug auto-generates
4. Click "Save"

**Test Checklist:**
- [ ] Category list displays
- [ ] Create category works
- [ ] Edit category works
- [ ] Delete category:
  - [ ] Shows confirmation
  - [ ] Removes from list
- [ ] Search/filter categories

**API Correlation:**
```bash
POST /api/category/create/:adminId
PUT /api/category/:categoryId/:adminId
DELETE /api/category/:categoryId/:adminId
```

### 4. Product Management

**URL:** http://localhost:3000/admin/products

**Create Product:**
1. Click "Add Product"
2. Fill form:
   - Name: "Test Product"
   - Description: "Test description"
   - Price: 99.99
   - Category: Select one
   - Quantity: 50
   - Upload image
3. Click "Create"

**Test Checklist:**
- [ ] Products table/grid displays
- [ ] Search products works
- [ ] Filter by category
- [ ] Create product:
  - [ ] Form validation
  - [ ] Image upload preview
  - [ ] Success message
- [ ] Edit product:
  - [ ] Pre-filled form
  - [ ] Update image
  - [ ] Save changes
- [ ] Delete product:
  - [ ] Confirmation dialog
  - [ ] Removes from list
- [ ] Bulk actions (if implemented)

**API Correlation:**
```bash
POST /api/product/create/:adminId (multipart/form-data)
PUT /api/product/:productId/:adminId
DELETE /api/product/:productId/:adminId
```

### 5. Order Management

**URL:** http://localhost:3000/admin/orders

**Test Checklist:**
- [ ] Orders list displays with:
  - [ ] Order ID
  - [ ] Customer name
  - [ ] Date
  - [ ] Total
  - [ ] Status
- [ ] Filter by status
- [ ] Search by order ID or customer
- [ ] View order details:
  - [ ] Customer info
  - [ ] Items ordered
  - [ ] Payment details
  - [ ] Shipping address
- [ ] Update order status:
  - [ ] Dropdown with statuses
  - [ ] Save updates
  - [ ] Status badge updates

**Status Options:**
- Not processed
- Processing
- Shipped
- Delivered
- Cancelled

**API Correlation:**
```bash
GET /api/admin/orders
PUT /api/order/status/:orderId/:adminId
Body: { status: "Shipped" }
```

---

## API Testing with UI Correlation

### Testing API Endpoints Directly

Use tools like Postman, Insomnia, or VS Code REST Client

#### 1. Authentication Flow

```http
### Register
POST http://localhost:8000/api/register
Content-Type: application/json

{
  "name": "API Test User",
  "email": "apitest@test.com",
  "password": "password123"
}

### Login
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "email": "apitest@test.com",
  "password": "password123"
}

### Verify Auth
GET http://localhost:8000/api/secret/{{userId}}
Authorization: Bearer {{token}}
```

#### 2. Product Operations

```http
### Get All Products
GET http://localhost:8000/api/products

### Search Products
GET http://localhost:8000/api/products/search/laptop

### Filter Products
POST http://localhost:8000/api/filtered-products
Content-Type: application/json

{
  "checked": ["category-uuid-1", "category-uuid-2"],
  "radio": [0, 1000]
}

### Get Product Image
GET http://localhost:8000/api/product/photo/{{productId}}
```

#### 3. Admin Operations

```http
### Create Category (Admin)
POST http://localhost:8000/api/category/create/{{adminId}}
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "name": "API Test Category",
  "slug": "api-test-category"
}

### Create Product (Admin)
POST http://localhost:8000/api/product/create/{{adminId}}
Authorization: Bearer {{adminToken}}
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="name"

API Test Product
------WebKitFormBoundary
Content-Disposition: form-data; name="price"

199.99
------WebKitFormBoundary
Content-Disposition: form-data; name="quantity"

25
------WebKitFormBoundary
Content-Disposition: form-data; name="category"

{{categoryId}}
------WebKitFormBoundary
Content-Disposition: form-data; name="photo"; filename="product.jpg"
Content-Type: image/jpeg

[Binary Image Data]
------WebKitFormBoundary--
```

---

## End-to-End Testing Scenarios

### Scenario 1: Complete Purchase Flow

**Objective:** Test complete customer journey from browsing to purchase

1. **Browse Products**
   - Navigate to http://localhost:3000
   - Verify homepage loads
   - Click "Shop" in navigation

2. **Search and Filter**
   - Search for "laptop"
   - Filter by price range $500-$2000
   - Sort by "Price: Low to High"

3. **View Product**
   - Click on a product
   - Verify details page loads
   - Check related products appear

4. **Add to Cart**
   - Select quantity: 2
   - Click "Add to Cart"
   - Verify cart badge updates

5. **Review Cart**
   - Click cart icon
   - Verify items appear
   - Update quantity to 1
   - Note total price

6. **Checkout**
   - Click "Checkout"
   - Login if needed
   - Enter shipping info
   - Use test credit card: 4111111111111111
   - Complete payment

7. **Verify Order**
   - Check success page
   - Go to dashboard
   - Verify order in history

### Scenario 2: Admin Product Management

**Objective:** Test admin can manage inventory

1. **Admin Login**
   - Login as admin@test.com

2. **Create Category**
   - Go to Admin → Categories
   - Create "Flash Sale" category

3. **Add Product**
   - Go to Admin → Products
   - Add new product:
     - Name: "Limited Edition Item"
     - Category: "Flash Sale"
     - Price: $49.99
     - Quantity: 10

4. **Verify on Frontend**
   - Logout admin
   - Go to shop page
   - Search for "Limited Edition"
   - Verify product appears

5. **Edit Product**
   - Login as admin
   - Change price to $39.99
   - Update quantity to 5

6. **Delete Product**
   - Delete the test product
   - Verify it's removed from shop

### Scenario 3: Out of Stock Handling

**Objective:** Test inventory management

1. **Find Low Stock Item**
   - As admin, find product with quantity = 1

2. **Customer Purchase**
   - As customer, buy that item
   - Complete checkout

3. **Verify Out of Stock**
   - Return to product page
   - Verify "Out of Stock" badge
   - Verify "Add to Cart" disabled

4. **Admin Restock**
   - As admin, update quantity to 10
   - Verify product available again

### Scenario 4: Order Status Management

**Objective:** Test order lifecycle

1. **Place Order**
   - As customer, place an order
   - Note order ID

2. **Admin View Orders**
   - As admin, go to Orders
   - Find the new order
   - Verify status: "Not processed"

3. **Update Status**
   - Change to "Processing"
   - Save
   - Change to "Shipped"
   - Save

4. **Customer Verify**
   - As customer, check order history
   - Verify status shows "Shipped"

---

## Payment Testing

### Braintree Sandbox Testing

**Test Card Numbers:**
```
Success: 4111111111111111
Declined: 4000111111111115
Insufficient Funds: 4009348888881881
Expired Card: 4111111111111111 (with past date)
```

**Test PayPal:**
- Use sandbox PayPal account
- Email: sb-test@personal.example.com
- Password: sandbox123

**Testing Different Scenarios:**

1. **Successful Payment**
   - Use card: 4111111111111111
   - Any future expiry
   - Any CVV
   - Should complete successfully

2. **Declined Payment**
   - Use card: 4000111111111115
   - Should show error message
   - Cart should remain intact

3. **Network Error**
   - Disconnect internet after token load
   - Should show network error
   - Should allow retry

---

## Troubleshooting Guide

### Common UI Issues

#### 1. Products Not Loading
```javascript
// Check browser console
// Network tab → Filter XHR
// Look for failed API calls

// Common fixes:
- Ensure backend is running (port 8000)
- Check CORS settings
- Verify API base URL in frontend
```

#### 2. Cart Not Persisting
```javascript
// Check localStorage
localStorage.getItem('cart')

// Clear and retry
localStorage.removeItem('cart')
```

#### 3. Images Not Displaying
```bash
# Check uploads directory exists
ls -la uploads/products/

# Check file permissions
chmod -R 755 uploads/

# Verify image serving route
curl http://localhost:8000/api/product/photo/[product-id]
```

#### 4. Payment Not Working
```javascript
// Check Braintree credentials
// Browser Console → Network → Look for token request
// Should return clientToken

// Verify in .env:
BRAINTREE_MERCHANT_ID=correct_value
BRAINTREE_PUBLIC_KEY=correct_value
BRAINTREE_PRIVATE_KEY=correct_value
```

### Common API Issues

#### 1. 401 Unauthorized
- Token expired (regenerate)
- Token format wrong (needs "Bearer ")
- JWT_SECRET mismatch

#### 2. 403 Forbidden
- User doesn't have admin role
- Check database: `SELECT * FROM users WHERE email='your@email.com';`

#### 3. 500 Server Error
- Check server logs: `tail -f logs/app-*.log`
- Database connection issue
- Missing required fields

### Database Verification Queries

```sql
-- Check user roles
SELECT id, email, role FROM users;

-- Verify products exist
SELECT name, quantity, price FROM products LIMIT 10;

-- Check orders
SELECT o.id, u.email, o.status, o.created_at
FROM orders o
JOIN users u ON o.buyer_id = u.id
ORDER BY o.created_at DESC;

-- Product inventory status
SELECT name, quantity, sold,
       CASE
         WHEN quantity = 0 THEN 'Out of Stock'
         WHEN quantity < 5 THEN 'Low Stock'
         ELSE 'In Stock'
       END as status
FROM products;
```

### Browser Testing Checklist

Test on multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### Performance Checks

```javascript
// Browser Console - Check load times
performance.getEntriesByType("navigation")[0].loadEventEnd

// Network tab - Check API response times
// Should be < 200ms for most endpoints
// Images should be optimized (< 200KB)
```

---

## Quick Testing Checklist

### Essential User Flows
- [ ] Register new account
- [ ] Login/Logout
- [ ] Browse products
- [ ] Search products
- [ ] Filter by category
- [ ] Add to cart
- [ ] Update cart quantity
- [ ] Complete checkout
- [ ] View order history

### Essential Admin Flows
- [ ] Admin login
- [ ] Create category
- [ ] Create product with image
- [ ] Edit product
- [ ] Delete product
- [ ] View all orders
- [ ] Update order status

### Critical Validations
- [ ] Form validations work
- [ ] Auth protected routes redirect
- [ ] Admin routes restricted
- [ ] Payment processes correctly
- [ ] Cart persists properly
- [ ] Images upload and display
- [ ] Search returns results
- [ ] Filters work correctly

---

## Testing Data Reset

If you need to reset for fresh testing:

```bash
# Stop the server
# Clear database
npm run db:clear

# Reseed with fresh data
npm run db:seed

# Generate new images
npm run db:images

# Clear browser data
# Chrome: Settings → Privacy → Clear browsing data
# Include: Cookies, Cache, Local Storage

# Restart server
npm run dev
```

---

## Notes

- Always test both happy path and error scenarios
- Test on different screen sizes (responsive design)
- Verify console has no errors during normal operation
- Check that loading states appear during API calls
- Ensure error messages are user-friendly
- Test with slow network (Chrome DevTools → Network → Slow 3G)
- Verify accessibility (keyboard navigation, screen readers)