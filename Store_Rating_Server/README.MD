# Store Rating Platform - Backend API

A complete, production-ready backend API for a multi-role store rating platform built with Node.js, Express, and MySQL.

## Overview

This backend provides a comprehensive REST API for managing stores and user ratings with three distinct user roles:
- **System Administrator** - Manage users, stores, and view analytics
- **Normal User** - Register, browse stores, and submit ratings
- **Store Owner** - Manage own stores and view ratings

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcryptjs
- **HTTP:** REST API with JSON
- **Validation:** Custom validation helpers

## Quick Start

### Prerequisites
- Node.js v14+
- MySQL server running
- npm package manager

### Installation

1. **Clone/Setup the project**
```bash
cd Backend
npm install
```

2. **Database Setup**
- MySQL database "store" must exist
- Run `db.sql` to create tables
- Update credentials in `utils/db.js` if needed

3. **Start the Server**
```bash
node server.js
```

Server runs on: `http://localhost:4000`

## API Overview

### 19 Total Endpoints

**Authentication (3):**
- Register new user
- Login user
- Update password

**Admin (6):**
- Dashboard statistics
- Manage users (add, list, view details)
- Manage stores (add, list)

**Normal User (5):**
- Browse all stores
- Search stores
- Submit/update ratings
- View own ratings

**Store Owner (2):**
- View dashboard with statistics
- View user ratings

## Project Structure

```
Backend/
├── config/              # Configuration files
├── controllers/         # Business logic (4 files)
├── middleware/          # Authentication & authorization
├── routes/              # API endpoints (4 files)
├── helpers/             # Validation & utilities
├── utils/               # Database connection
├── server.js            # Main server file
├── package.json         # Dependencies
├── db.sql               # Database schema
├── API_DOCUMENTATION.md # Complete API reference
├── QUICK_START.md       # Quick reference guide
├── SETUP.md             # Detailed setup instructions
└── IMPLEMENTATION_SUMMARY.md  # What was built
```

## Key Features

### Security
✅ Password hashing with bcryptjs
✅ JWT token authentication (7-day expiry)
✅ Role-based access control (RBAC)
✅ Input validation for all fields
✅ Email uniqueness constraints
✅ Secure database connections

### Admin Features
✅ Dashboard with user/store/rating statistics
✅ User management (create any role)
✅ Store management
✅ Advanced filtering and sorting
✅ User detail viewing

### User Features
✅ Self-registration
✅ Secure login
✅ Browse and search stores
✅ Submit and modify ratings
✅ View rating history

### Store Owner Features
✅ Dashboard with statistics
✅ View submitted ratings
✅ Track average ratings

## Validation Rules

| Field | Rule | Example |
|-------|------|---------|
| Name | 20-60 characters | "John Doe Example Name" |
| Email | Valid email format | "user@example.com" |
| Password | 8-16 chars, 1+ uppercase, 1+ special char | "Password@123" |
| Address | Max 400 characters | "123 Street Address" |
| Rating | Integer 1-5 | 4 |
| Role | Admin, Normal, or Store Owner | "Normal" |

## API Response Format

All endpoints return consistent JSON:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## HTTP Status Codes

- `200` - OK (successful GET/PUT)
- `201` - Created (successful POST)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid token/credentials)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## Testing

### Using Postman
1. Import `postman_collection.json`
2. Set variables: `baseUrl`, `token`
3. Test endpoints sequentially

### Using cURL
```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe Example Name","email":"john@example.com","password":"Password@123","address":"123 Main Street"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password@123"}'

# Protected endpoint (use token from login)
curl -X GET http://localhost:4000/api/users/stores \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database Schema

### Users Table
- id, name, email, password (hashed), address, role, timestamps

### Stores Table
- id, owner_id (foreign key), name, email, address, timestamps

### Ratings Table
- id, user_id (foreign key), store_id (foreign key), rating_value, timestamps
- Unique constraint: (user_id, store_id)

## Documentation

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Detailed API reference with examples
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference and common tasks
- **[SETUP.md](./SETUP.md)** - Detailed installation and configuration
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Complete feature overview

## Error Handling

All errors include:
- Appropriate HTTP status code
- Clear error message
- Validation details when applicable

Common error messages:
- "All fields are required"
- "Invalid email format"
- "Email is already registered"
- "Access denied. Insufficient permissions"
- "Database error"

## Authentication

Protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token obtained from login endpoint, valid for 7 days.

## Role-Based Access

| Endpoint | Admin | User | Owner |
|----------|-------|------|-------|
| Register | ❌ | ✅ | ❌ |
| Login | ✅ | ✅ | ✅ |
| Add User | ✅ | ❌ | ❌ |
| View Users | ✅ | ❌ | ❌ |
| Add Store | ✅ | ❌ | ❌ |
| View Stores | ✅ | ✅ | ✅ |
| Rate Store | ❌ | ✅ | ❌ |
| View Ratings | ✅ | ✅ | ✅ |

## Environment Setup

Create a `.env` file based on `.env.example`:
```
DB_HOST=localhost
DB_USER=w3_93020_Apurva
DB_PASSWORD=manager
DB_NAME=store
JWT_SECRET=your_secret_key
```

## Common Issues

### Database Connection Error
- Ensure MySQL is running
- Verify credentials in `utils/db.js`
- Check database "store" exists

### Module Not Found
```bash
npm install
```

### Invalid Token Error
- Token has expired (get new one by logging in)
- Ensure correct format: `Authorization: Bearer <token>`

### Validation Errors
- Check field lengths match requirements
- Verify password has uppercase + special character
- Ensure name is 20-60 characters

## Performance

- Connection pooling for database
- Optimized queries with JOINs
- Proper indexing with foreign keys
- No N+1 query problems

## Security Considerations

✅ Passwords hashed with bcryptjs
✅ JWT authentication
✅ SQL injection prevention
✅ Role-based access control
✅ Input validation
✅ Unique email enforcement

## Future Enhancements

Potential additions:
- Pagination for large datasets
- Rate limiting
- Email notifications
- Audit logging
- Two-factor authentication
- Full-text search
- Redis caching
- Analytics dashboard

## Deployment

Ready for deployment to:
- AWS (EC2, RDS)
- Heroku
- DigitalOcean
- Google Cloud
- Azure

Configure environment variables for production deployment.

## Support & Troubleshooting

1. Check documentation files (see above)
2. Verify database credentials
3. Ensure all dependencies installed
4. Check JWT_SECRET in config
5. Verify MySQL is running

## License

Private project - Store Rating Platform

## Version

1.0.0 - Complete implementation of all core features

---

**Status:** ✅ Production Ready

**Last Updated:** 2024

For questions or issues, refer to the documentation files included in the project.
