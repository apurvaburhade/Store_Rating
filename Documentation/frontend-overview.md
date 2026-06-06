# Frontend Overview

This folder documents the React frontend for the Store Rating app, located at `Store_Rating_Client/Store`.

## Purpose

The frontend provides:
- user authentication (login/register)
- role-based dashboards for Admin, Store Owner, and Normal User
- store browsing and ratings management
- change password support

## Main technologies

- React 19
- Vite
- React Router DOM
- Axios
- ESLint

## Key source folders

- `src/pages` - page-level routes and views
- `src/components` - reusable UI components
- `src/services` - API request helpers
- `src/App.jsx` - router and root app
- `src/main.jsx` - React entry point

## Role-based routing

The app stores `token` and `user` in `localStorage` after login.
The dashboard page checks `user.role` and renders:
- Admin: `AdminDashboard`
- Store Owner: `StoreOwnerDashboard`
- Normal/User: `UserDashboard`

## API backend

The frontend calls the backend at `http://localhost:4000/api`.
The API is split by route prefixes:
- `/api/auth`
- `/api/admin`
- `/api/store-owner`
- `/api/users`
