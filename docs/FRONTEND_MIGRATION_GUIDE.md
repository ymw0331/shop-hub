# Frontend Migration Guide: MongoDB to PostgreSQL

## 🎯 Overview
This guide outlines the changes needed in the frontend to adapt to our new PostgreSQL backend with native `id` fields instead of MongoDB `_id` fields.

## 📋 Required Changes Summary

### 1. **Database ID Field Changes**
**Before (MongoDB):**
```javascript
user._id
product._id  
order._id
category._id
```

**After (PostgreSQL):**
```javascript
user.id
product.id
order.id
category.id
```

## 🔧 Specific Frontend Updates Needed

### **Authentication Context (`client/src/context/auth.js`)**

**Update JWT Token Handling:**
```javascript
// Before:
const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

// After:
const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
```

**Update User State:**
```javascript
// Before:
localStorage.setItem('user', JSON.stringify({_id: user._id, ...otherData}));

// After:  
localStorage.setItem('user', JSON.stringify({id: user.id, ...otherData}));
```

### **React Components - Update Key Props**

**Product Lists (`client/src/components/cards/ProductCard.jsx`):**
```jsx
// Before:
products.map(product => (
  <ProductCard key={product._id} product={product} />
))

// After:
products.map(product => (
  <ProductCard key={product.id} product={product} />
))
```

**Order Lists (`client/src/pages/user/UserOrders.jsx`):**
```jsx
// Before:
orders.map(order => (
  <OrderItem key={order._id} order={order} />
))

// After:
orders.map(order => (
  <OrderItem key={order.id} order={order} />
))
```

### **API Call Updates**

**User Profile Updates:**
```javascript
// Before:
const updateProfile = async (userData) => {
  const response = await fetch(`/api/profile/${user._id}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  });
};

// After:
const updateProfile = async (userData) => {
  const response = await fetch(`/api/profile/${user.id}`, {
    method: 'PUT', 
    body: JSON.stringify(userData)
  });
};
```

**Product/Category/Order Management:**
```javascript
// Before:
const deleteProduct = (productId) => {
  fetch(`/api/product/${product._id}`, { method: 'DELETE' });
};

// After:
const deleteProduct = (productId) => {
  fetch(`/api/product/${product.id}`, { method: 'DELETE' });
};
```

### **State Management Updates**

**Cart Context (`client/src/context/cart.js`):**
```javascript
// Before:
const addToCart = (product) => {
  const existingItem = cart.find(item => item._id === product._id);
  // ...
};

// After:
const addToCart = (product) => {
  const existingItem = cart.find(item => item.id === product.id);
  // ...
};
```

**Search Context (`client/src/context/search.js`):**
```javascript
// Before:
const searchResults = products.filter(p => p._id.includes(searchTerm));

// After:
const searchResults = products.filter(p => p.id.includes(searchTerm));
```

### **Form Submissions & Validations**

**Admin Product Forms:**
```javascript
// Before:
const handleSubmit = (formData) => {
  if (isEditing) {
    updateProduct(product._id, formData);
  } else {
    createProduct(formData);
  }
};

// After:
const handleSubmit = (formData) => {
  if (isEditing) {
    updateProduct(product.id, formData);
  } else {
    createProduct(formData);
  }
};
```

## 🔍 Files to Update

### **Context Files:**
- `client/src/context/auth.js`
- `client/src/context/cart.js` 
- `client/src/context/search.js`

### **Component Files:**
- `client/src/components/cards/ProductCard.jsx`
- `client/src/components/cards/ProductCardHorizontal.jsx`
- All admin components (`client/src/pages/admin/`)
- All user components (`client/src/pages/user/`)

### **Page Files:**
- `client/src/pages/Cart.jsx`
- `client/src/pages/Checkout.jsx`
- `client/src/pages/ProductView.jsx`
- `client/src/pages/CategoryView.jsx`
- `client/src/pages/Shop.jsx`

## ⚡ Quick Migration Strategy

### **Step 1: Global Find & Replace**
```bash
# In your frontend directory:
find client/src -name "*.js" -o -name "*.jsx" | xargs sed -i 's/\._id/\.id/g'
find client/src -name "*.js" -o -name "*.jsx" | xargs sed -i 's/_id:/id:/g' 
```

### **Step 2: Manual Review**
- Check JWT token handling in auth context
- Verify React key props use `id` instead of `_id`
- Update any hardcoded `_id` references in API calls
- Test authentication flow end-to-end

### **Step 3: Testing Checklist**
- [ ] User registration/login works
- [ ] Product listing displays correctly  
- [ ] Cart functionality works
- [ ] Admin CRUD operations work
- [ ] Order creation/viewing works
- [ ] Search functionality works
- [ ] Category filtering works

## 🚨 Breaking Changes

### **JWT Token Structure**
**Before:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "iat": 1642680000,
  "exp": 1643284800
}
```

**After:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "iat": 1642680000,
  "exp": 1643284800
}
```

### **API Response Format**
**Before:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**After:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe", 
  "email": "john@example.com"
}
```

## ✅ Benefits After Migration

1. **Industry Standard**: PostgreSQL `id` fields follow database best practices
2. **Better TypeScript Support**: Native `id` typing is cleaner
3. **No Technical Debt**: Removes MongoDB compatibility layers
4. **Future-Proof**: Standard UUID primary keys for scaling
5. **Performance**: Native PostgreSQL indexing on `id` fields

## 🔧 Development Workflow

1. **Backend First**: Ensure all backend APIs return `id` instead of `_id`
2. **Frontend Update**: Apply changes systematically using this guide
3. **Testing**: Run full test suite after each major component update
4. **Gradual Deployment**: Test authentication flow first, then other features

---

**This migration ensures your frontend properly communicates with the new PostgreSQL backend using industry-standard field names.**
