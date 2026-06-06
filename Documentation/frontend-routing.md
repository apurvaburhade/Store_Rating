# Frontend Routing

The app router is defined in `src/App.jsx` using React Router DOM.

## Routes

- `/` -> redirects to `/login`
- `/login` -> `Login` page
- `/register` -> `Register` page
- `/dashboard` -> `Dashboard` page

## Dashboard routing behavior

`src/pages/Dashboard.jsx` is the protected dashboard wrapper.
It reads the logged-in user from `localStorage.user` and checks `user.role`.

The `Dashboard` component renders one of:
- `AdminDashboard` for `Admin`
- `StoreOwnerDashboard` for `Store Owner`
- `UserDashboard` for `Normal` or `User`

If the user is missing or has no role, it navigates back to `/login`.

## Header navigation

`src/components/Header.jsx` is displayed on all routes.
It shows:
- Login/Register links when no token is present
- Dashboard and Logout when an auth token exists

Logout clears `token` and `user` from `localStorage` and redirects to `/login`.
