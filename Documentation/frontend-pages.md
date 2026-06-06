# Frontend Pages

This document describes the main page components in `src/pages`.

## Login

File: `src/pages/Login.jsx`

- Email/password login form
- Calls `authService.login`
- Stores `token` and `user` in `localStorage`
- Navigates to `/dashboard` on success
- Displays errors from API or validation

## Register

File: `src/pages/Register.jsx`

- Collects first name, last name, email, address, and password
- Validates: name length, email format, password complexity
- Calls `authService.register`
- Redirects to `/login` after successful registration

## Dashboard

File: `src/pages/Dashboard.jsx`

- Reads authenticated user info from `localStorage`
- Routes to one of the dashboard views based on role
- Prevents access when user is not authenticated

## AdminDashboard

File: `src/pages/AdminDashboard.jsx`

Features:
- Loads admin dashboard metrics and lists of users/stores
- Searches and filters users and stores
- Adds new users and new stores
- Fetches details for a selected user
- Uses `adminService`

## StoreOwnerDashboard

File: `src/pages/StoreOwnerDashboard.jsx`

Features:
- Loads store-owner-specific dashboard data and ratings
- Filters ratings by store, sort order, and sort field
- Allows logout and open change password modal
- Uses `storeOwnerService`

## UserDashboard

File: `src/pages/UserDashboard.jsx`

Features:
- Loads available stores and current user ratings
- Supports searching, sorting, rating, and rating updates
- Displays store details in a popup and handles form feedback
- Uses `userService`
- Supports change password modal and logout
