# Frontend Services

The `src/services` folder contains the API clients used by the frontend.

## authService

File: `src/services/authService.js`

Endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/update-password`

Usage:
- `register(payload)` for registration
- `login(payload)` for authentication
- `updatePassword(payload)` for password changes

## adminService

File: `src/services/adminService.js`

Endpoints:
- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/stores`
- `GET /api/admin/users/:userId`
- `POST /api/admin/users`
- `POST /api/admin/stores`

Usage:
- Admin dashboard metrics
- User/store search and sort
- Creating users and stores
- Loading user details

## storeOwnerService

File: `src/services/storeOwnerService.js`

Endpoints:
- `GET /api/store-owner/dashboard`
- `GET /api/store-owner/ratings`

Usage:
- Store owner dashboard data
- Ratings list filtering by store and sort

## userService

File: `src/services/userService.js`

Endpoints:
- `GET /api/users/stores`
- `POST /api/users/ratings`
- `PUT /api/users/ratings/:storeId`

Usage:
- Fetching stores for normal users
- Submitting new ratings
- Updating existing ratings

## Shared behavior

All services attach a Bearer token from `localStorage.token` when available.
The frontend assumes the API is accessible at `http://localhost:4000`.
