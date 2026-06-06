# Backend Setup

This document explains how to run and understand the backend API in `Store_Rating_Server`.

## Overview

The backend implements a REST API for the Store Rating platform using Node.js, Express, and MySQL.

Roles supported:
- `Admin`
- `Normal`
- `Store Owner`

The backend supports user registration, login, password update, store management, ratings, and dashboard statistics.

## Server structure

```
Store_Rating_Server/
├── config/              # Authentication configuration
│   └── auth.js
├── controllers/         # Route handlers and business logic
│   ├── adminController.js
│   ├── authController.js
│   ├── storeOwnerController.js
│   └── userController.js
├── helpers/             # Validation utilities
│   └── validation.js
├── middleware/          # Authentication middleware
│   └── auth.js
├── routes/              # Express route definitions
│   ├── admin.js
│   ├── auth.js
│   ├── storeOwner.js
│   └── user.js
├── utils/               # Database connection helper
│   └── db.js
├── db.sql               # Database schema and initial structure
├── package.json         # Backend dependencies
└── server.js            # Express app startup
```

## Prerequisites

- Node.js v14 or newer
- MySQL server running
- npm

## Install dependencies

From `Store_Rating_Server`:

```bash
npm install
```

## Configuration

### Database connection

Update `Store_Rating_Server/utils/db.js` to use your MySQL credentials:

```js
const pool = mysql2.createPool({
    host: 'localhost',
    user: 'your_mysql_user',
    password: 'your_mysql_password',
    database: 'store'
})
```

### JWT configuration

`Store_Rating_Server/config/auth.js` uses `process.env.JWT_SECRET` if available, otherwise it defaults to a placeholder.

Set `JWT_SECRET` in your environment for production use.

## Database setup

1. Create a MySQL database named `store`.
2. Run `Store_Rating_Server/db.sql` to create the required tables.

Important tables:
- `users`
- `stores`
- `ratings`

## Running the backend

Start the server from the backend folder:

```bash
node server.js
```

The API listens on `http://localhost:4000`.

## Middleware and security

### `middleware/auth.js`
- `verifyToken` checks for a valid Bearer JWT in `Authorization` header.
- `checkRole(allowedRoles)` restricts routes by user role.

### Validation rules
- `name`: 20-60 characters
- `email`: valid email format
- `password`: 8-16 characters, at least one uppercase and one special character
- `address`: 1-400 characters
- `rating`: integer between 1 and 5

## API Endpoints

### Authentication

#### `POST /api/auth/register`
Register a new `Normal` or `Store Owner` user.

Body:
```json
{
  "name": "Example User Name Here",
  "email": "user@example.com",
  "password": "Password@123",
  "address": "123 Main Street",
  "role": "Normal"
}
```

Response keys:
- `success`
- `message`
- `role`

#### `POST /api/auth/login`
Login and receive a JWT token.

Body:
```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```

Success response includes `token` and `user` details.

#### `POST /api/auth/update-password`
Protected route. Update the authenticated user's password.

Headers:
```http
Authorization: Bearer <token>
```

Body:
```json
{
  "currentPassword": "Password@123",
  "newPassword": "NewPassword@123"
}
```

#### `POST /api/auth/logout`
Protected route. Returns logout confirmation.

## Admin routes

All admin routes require:
- `Authorization: Bearer <token>`
- user role `Admin`

#### `GET /api/admin/dashboard`
Returns admin dashboard statistics:
- `totalUsers`
- `totalStores`
- `totalRatings`

#### `POST /api/admin/users`
Add a new user with one of the roles: `Admin`, `Normal`, `Store Owner`.

Body:
```json
{
  "name": "Example Admin User Name Here",
  "email": "admin@example.com",
  "password": "Password@123",
  "address": "123 Admin Street",
  "role": "Admin"
}
```

#### `GET /api/admin/users`
List users with optional query filtering:
- `sortBy=name|email|address|role`
- `order=ASC|DESC`
- `search=<term>`
- `role=Admin|Normal|Store Owner`

#### `GET /api/admin/users/:userId`
Get user details by ID.
If the user is a `Store Owner`, the response also includes `rating`.

#### `POST /api/admin/stores`
Add a new store for a given `Store Owner`.

Body:
```json
{
  "owner_id": 3,
  "name": "Store Name",
  "email": "store@example.com",
  "address": "456 Store Avenue"
}
```

#### `GET /api/admin/stores`
List stores with optional filtering and sorting:
- `sortBy=name|email|address`
- `order=ASC|DESC`
- `search=<term>`

## Store Owner routes

All store owner routes require:
- `Authorization: Bearer <token>`
- user role `Store Owner`

#### `GET /api/store-owner/dashboard`
Returns dashboard data for the current store owner:
- `averageRating`
- `totalRatings`
- `stores` list with ratings

#### `GET /api/store-owner/ratings`
Returns rating records for the store owner's stores.
Optional query:
- `storeId` (filter by store)
- `sortBy=storeName|rating|submittedAt`
- `order=ASC|DESC`

## Normal user routes

All normal user routes require:
- `Authorization: Bearer <token>`
- user role `Normal`

#### `GET /api/users/stores`
Returns all stores, including average rating and the current user's rating.
Optional query:
- `sortBy=name|address|rating`
- `order=ASC|DESC`
- `search=<term>`

#### `GET /api/users/stores/search`
Search stores by name or address.
Query parameters:
- `name`
- `address`
- `sortBy=name|address|rating`
- `order=ASC|DESC`

#### `POST /api/users/ratings`
Submit a rating for a store.

Body:
```json
{
  "storeId": 5,
  "rating": 4
}
```

#### `PUT /api/users/ratings/:storeId`
Update an existing rating for a specific store.

Body:
```json
{
  "rating": 5
}
```

#### `GET /api/users/ratings/my-ratings`
Get the authenticated user's submitted ratings.
Optional query:
- `sortBy=storeName|rating|submitted`
- `order=ASC|DESC`

## Response format

Successful responses use:
```json
{
  "success": true,
  "message": "...",
  "data": {...}
}
```

Error responses use:
```json
{
  "success": false,
  "message": "..."
}
```

## Notes

- The backend currently listens on `http://localhost:4000`.
- The frontend expects the backend API to be available at this URL.
- Keep `JWT_SECRET` secure in production.
- Update database credentials before deploying.
