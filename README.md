# Bazario — Multi-Seller E-Commerce Platform

Bazario is a full-stack multi-seller e-commerce platform built using the MERN stack. It allows multiple sellers to manage their products while customers can browse products, add items to their cart, and place orders.

## Features

### Customer

* User registration and login
* Secure authentication
* Browse products
* Search and filter products
* View product details
* Add products to cart
* Update cart quantity
* Remove products from cart
* Place orders
* View order history
* Manage user profile

### Seller

* Seller registration and login
* Seller dashboard
* Add products
* Update product details
* Delete products
* Manage inventory
* Manage seller products
* Manage received orders

### Admin

* Admin authentication
* Manage users
* Manage sellers
* Manage products
* Manage orders
* Manage the overall platform

## Tech Stack

### Frontend

* React.js
* React Router
* Tailwind CSS
* Axios
* JavaScript

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication

### Database

* MongoDB
* Mongoose

### Tools

* Git
* GitHub
* VS Code
* Postman

## Project Structure

```text
Bazario/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/bazario.git
```

### Navigate to the Project

```bash
cd bazario
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit the `.env` file to GitHub.

## Running the Project

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

## Application Flow

```text
Customer
   |
   |-- Register / Login
   |
   |-- Browse Products
   |
   |-- Add to Cart
   |
   |-- Place Order
   |
   v
Seller
   |
   |-- Manage Products
   |-- Manage Inventory
   |-- Manage Orders
   |
   v
Admin
   |
   |-- Manage Users
   |-- Manage Sellers
   |-- Manage Products
   |-- Manage Orders
```

## Future Improvements

* Online payment integration
* Product reviews and ratings
* Wishlist functionality
* Order tracking
* Seller analytics dashboard
* Product recommendations
* Image upload using Cloudinary
* Email notifications
* Advanced search and filtering
* Responsive mobile-first UI

## Project Goals

Bazario was developed to gain practical experience with:

* Full-stack web development
* REST API development
* Authentication and authorization
* Role-based access control
* MongoDB database design
* CRUD operations
* Frontend-backend integration
* E-commerce workflows
* Multi-seller architecture

## Author

Khushi Kumari

GitHub: https://github.com/your-username

## License

This project is developed for educational and portfolio purposes.
