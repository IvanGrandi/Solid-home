# 🛒 Solid Home - Ecommerce Website: **Furniture Store**

> **🚀 Live Demo:** [solid-home.vercel.app](https://solid-home-nu.vercel.app/)

A simple ecommerce platform for buying home furniture — inspired by IKEA.  
It includes role-based access with key functionalities for each user type.

---

## 👥 User Roles & Features

### 🧑‍💻 Guest
- Can browse the website and view furniture
- Cannot add products to the cart

### 👤 Registered User
- Add products to the cart
- Validate and complete purchases

### 🛠️ Admin
- Full CRUD (Create, Read, Update, Delete) for products
- Manage user roles (promote, demote, or block users)

### 🔐 Authentication
- Includes login and signup system
- Roles: **Guest**, **User**, **Admin**

---

# 🏠 Solid Home - Home Decoration Project Setup

This guide explains how to set up and run the frontend and backend of the Home Decoration project on your local machine.

---

## 🗄️ Backend Setup

1. Create a MySQL database (e.g. in **MySQL Workbench**):
   ```sql
   CREATE DATABASE solidhome;
   ```

2. Create `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_db_password
   DB_NAME=solidhome
   DB_SSL=false

   # Required: a long random string used to sign login tokens
   JWT_SECRET=change_me_to_a_long_random_string

   # Optional: creates an admin account on setup if it doesn't exist yet
   ADMIN_USERNAME=admin
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=choose_a_strong_password

   # Optional: allowed frontend origins (comma-separated)
   # CORS_ORIGINS=http://localhost:5173
   ```

3. Install dependencies and start the server (locally it creates the tables, roles and admin on start):
   ```bash
   cd backend
   npm install
   npm start
   ```

4. (Optional) Load the sample products:
   ```bash
   node seedProducts.js
   ```

> **Deployed database (Vercel):** tables and seed data are not created on each cold start.
> Run `npm run db:setup` once with `backend/.env` pointing at that database, and set
> `JWT_SECRET` (plus `CORS_ORIGINS` if the frontend URL changes) in the Vercel project settings.

---

## 📦 Frontend Setup

1. Create `frontend/.env` with the backend URL:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

2. Install the dependencies and start the development server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

✅ **Your project is now running locally!**
The frontend will be served on `http://localhost:5173`, and the backend API on `http://localhost:5000`.
