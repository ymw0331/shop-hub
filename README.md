# Ecommerce MERN Web Application

This project is based on [Ryan Dhungel's Udemy course](https://www.udemy.com/course/react-ecommerce/). The aim of this project is to create a fully functional ecommerce web application using the MERN stack.

## Features

- Creating, reading, updating, and deleting products and categories.
- Uploading images.
- Using custom product card components to display products.
- Advanced searching and filtering of products.
- Products based on categories.
- Sorting products by created date and sold quantity.
- Product in-stock/out-of-stock, sold quantity update etc.
- View product with relative products (suggestive selling).
- User cart and orders history.
- Admin and user dashboards.
- Order management by admin.
- Email notification to users on order status change.
- Protected routes for logged-in and admin users.
- Braintree Payment System (Credit Card and PayPal).
- Role-based access.

## Technologies

- React
- Node.js
- Express
- MongoDB

## Getting Started

1. Clone this repository:

```sh
git clone https://github.com/ymw0331/ecommerce-mern-webapp.git
```

2. Install dependencies for both the client and server:

```sh
# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../ && npm install
```

3. Set up environment variables by creating a .env file in the root of the project with the following keys:

```sh
MONGO_URI=<your_mongo_uri>
JWT_SECRET=<your_jwt_secret>
BRAINTREE_MERCHANT_ID=<your_braintree_merchant_id>
BRAINTREE_PUBLIC_KEY=<your_braintree_public_key>
BRAINTREE_PRIVATE_KEY=<your_braintree_private_key>
EMAIL_FROM=<your_email_address>
```

4. Start the server: (cd ../)

```sh
npm run start
```

5. Start the client: (cd client)

```sh
npm run start 
```


## Contributing
Contributions are welcome! If you find any issues or want to contribute to the project, feel free to open a pull request or an issue.


## Credits
Credit goes to Ryan Dhungel for his comprehensive course on Udemy, which served as the foundation for this project.