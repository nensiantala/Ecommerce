# Ecommerce
Clothing Brand

## Welcome to the Ecommerce Project\!

### a. Quick Look & Cool Features
A full-stack E-commerce web application built with Next.js (Frontend), Node.js + Express (Backend), and MongoDB. This project demonstrates user authentication, product management, and secure API endpoints.
We're building a complete **Online Store**—a powerful e-commerce platform that handles everything from browsing products to shipping orders. Think of it as the ultimate digital storefront, built for a smooth ride for both customers and admins.

**What it can do:**

  * 🛍️ **Simple Product Handling:** We can easily add, edit, or remove anything in the inventory.
  * 🔐 **Secure User Accounts:** Everyone gets a safe place to sign up and log in, with separate superpowers for our store admins.
  * 🛒 **Smart Shopping Cart:** It remembers what you want\! The cart stays with you.
  * 💳 **Smooth Checkout:** A secure, quick process to turn a full cart into a confirmed order. 
  * 👑 **The Admin Hub:** A central dashboard where we can manage products, track orders, and keep an eye on users.

-----

b. Tech Stack and Dependencies

Frontend:

Next.js

React

Axios

Backend:

Node.js

Express

MongoDB + Mongoose

bcryptjs (password hashing)

jsonwebtoken (JWT authentication)

dotenv (environment variables)

cors

Dev Dependencies:

nodemon (auto-restart server)

c. Setup and Environment Variables
Clone Repository
git clone <your-repo-url>
cd ecommerce

Backend Setup
cd backend
npm install


.env file

PORT=5000
MONGO_URI=mongodb+srv://nensiantala:Username12@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

Frontend Setup
cd frontend
npm install


.env.local file

NEXT_PUBLIC_API_URL=http://localhost:5000

d. Database Configuration and Migration Steps

MongoDB Atlas Setup

Create a cluster in MongoDB Atlas

Create a database <dbname> and a user <username> with a password <password>

Connecting Backend

Set MONGO_URI in .env as above

Seed Data

cd backend
npm run seed


This will populate the database with sample products for testing.
f. API and Frontend Route Summaries
Backend API Routes
| Method | Route              | Description       | Protected |
| ------ | ------------------ | ----------------- | --------- |
| POST   | /api/auth/register | Register new user | No        |
| POST   | /api/auth/login    | User login        | No        |
| GET    | /api/products      | Get all products  | No        |
| GET    | /api/products/:id  | Get product by ID | No        |
| POST   | /api/products      | Create product    | Admin     |
| PUT    | /api/products/:id  | Update product    | Admin     |
| DELETE | /api/products/:id  | Delete product    | Admin     |

Frontend Routes
Route	Description
| Route         | Description            |
| ------------- | ---------------------- |
| /             | Home / Product Listing |
| /product/[id] | Product Details        |
| /cart         | Shopping Cart          |
| /admin        | Admin Dashboard        |
| /login        | Login Page             |
| /register     | User Registration      |

g. Deployment URLs

Frontend: https:https://ecommerce-bay-ten-13.vercel.app/

Backend API: https://ecommerce-tnen.onrender.com

### h. Admin Access for Review

For anyone evaluating or testing the admin features, here are the super-user keys\! **Please change these right away in the production environment\!**

  * **Email:** `admin@example.com` **(PLACEHOLDER - PLEASE UPDATE)**
  * **Password:** `admin123` **(PLACEHOLDER - PLEASE UPDATE)**

