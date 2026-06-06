# Frontend Setup

This document explains how to run the frontend in `Store_Rating_Client/Store`.

## Install dependencies

From the `Store_Rating_Client/Store` folder:

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

## Build for production

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Notes

- The frontend expects the backend API to be running at `http://localhost:4000`.
- Authentication token and user details are stored in `localStorage`.
- The `Header` component uses `localStorage.token` to determine whether to show login/register links or dashboard/logout.
