# Finance Data Processing & Access Control Backend

A production-quality REST API backend for a Finance Dashboard system, built with **Node.js, Express, TypeScript, Prisma ORM, and SQLite**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | SQLite (via Prisma ORM) |
| Authentication | JWT (jsonwebtoken) |
| Validation | Zod |
| Security | Helmet, CORS, express-rate-limit |
| Testing | Jest + Supertest |

---

## Project Structure

```
src/
├── app.ts                 # Express app setup (CORS, rate limiting, routes)
├── server.ts              # Server entry point
├── routes/
│   ├── auth.routes.ts     # POST /api/auth/register, /login
│   ├── user.routes.ts     # GET/PUT/DELETE /api/users (ADMIN only)
│   ├── record.routes.ts   # CRUD /api/records
│   └── analytics.routes.ts # GET /api/analytics/summary
├── controllers/           # Request/response handling
├── services/              # Business logic (auth, users, records, analytics)
├── middlewares/
│   ├── auth.middleware.ts       # JWT verification + role authorization
│   ├── validate.middleware.ts   # Zod schema validation
│   └── error.middleware.ts      # Global error handling
└── utils/
    ├── db.ts              # Prisma client instance
    ├── jwt.ts             # JWT sign/verify helpers
    └── errors.ts          # AppError class

prisma/
├── schema.prisma          # Database schema (User, FinancialRecord)
└── migrations/            # Auto-generated SQLite migrations

tests/
└── api.test.ts            # Integration tests (Jest + Supertest)
```

---

## Setup & Run

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Run database migrations (creates SQLite dev.db)
npx prisma migrate dev --name init

# 3. Start the development server
npm run dev
```

Server starts at: **http://localhost:3000**

---

## API Reference

### Authentication (Public)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

**Register body:**
```json
{
  "name": "John Admin",
  "email": "admin@company.com",
  "password": "password123",
  "role": "ADMIN"
}
```

> `role` is optional. Defaults to `VIEWER`. Accepted values: `VIEWER`, `ANALYST`, `ADMIN`

**Login body:**
```json
{
  "email": "admin@company.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "...",
      "name": "John Admin",
      "role": "ADMIN"
    },
    "token": "eyJhbGci..."
  }
}
```

> **All subsequent API calls require `Authorization: Bearer <token>` header.**

---

### Financial Records

| Method | Endpoint | Roles | Description |
|---|---|---|---|
| GET | `/api/records` | ALL | List records (paginated, filterable) |
| POST | `/api/records` | ADMIN | Create a record |
| PUT | `/api/records/:id` | ADMIN | Update a record |
| DELETE | `/api/records/:id` | ADMIN | Delete a record |

**Create Record body:**
```json
{
  "amount": 5000.00,
  "type": "INCOME",
  "category": "Salary",
  "date": "2024-01-15",
  "notes": "January salary"
}
```

**GET /api/records query params:**
```
?type=INCOME&category=Salary&startDate=2024-01-01&endDate=2024-12-31&page=1&limit=10
```

---

### Analytics Dashboard

| Method | Endpoint | Roles | Description |
|---|---|---|---|
| GET | `/api/analytics/summary` | ANALYST, ADMIN | Dashboard summary |

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalIncome": 15000.00,
    "totalExpenses": 4500.00,
    "netBalance": 10500.00,
    "categoryTotals": {
      "Salary": 15000.00,
      "Groceries": 2000.00,
      "Rent": 2500.00
    },
    "recentActivity": [...]
  }
}
```

---

### User Management (ADMIN only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | List all users |
| PUT | `/api/users/:id` | Update role or status |
| DELETE | `/api/users/:id` | Delete a user |

**Update User body:**
```json
{
  "role": "ANALYST",
  "status": "INACTIVE"
}
```

---

## Access Control Matrix

| Action | VIEWER | ANALYST | ADMIN |
|---|:---:|:---:|:---:|
| View financial records | ✅ | ✅ | ✅ |
| Create / Update / Delete records | ❌ | ❌ | ✅ |
| View analytics summary | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## Running Tests

```bash
npm test
```

**Test results: 5/5 tests pass ✅**

Tests cover:
- ✅ VIEWER blocked from creating records (403 Forbidden)
- ✅ ADMIN can create records (201 Created)
- ✅ Zod validation rejects bad input (400 Bad Request)
- ✅ ADMIN can access analytics summary (200 OK)
- ✅ VIEWER blocked from analytics (403 Forbidden)

---

## Assumptions

1. **Global Records**: Financial records are shared across all users (company-wide dashboard), not scoped per user. An Admin creates records; all roles can view them.
2. **Role Assignment on Register**: For simplicity, the `role` field is accepted at registration time. In production, only Admins should be able to assign roles.
3. **SQLite for Persistence**: Chosen for zero-config local setup. Easily swappable to PostgreSQL/MySQL by changing `prisma/schema.prisma` datasource.
4. **Soft Delete not implemented**: Hard deletes are used. Soft delete can be added with a `deletedAt` nullable DateTime fields.

---

## Security Features

- **JWT Authentication**: All protected routes require a valid Bearer token
- **Role Authorization**: Middleware enforces role rules on every route
- **Bcrypt Password Hashing**: Passwords are hashed with salt rounds = 10
- **Zod Input Validation**: All request bodies and query params validated
- **Helmet**: HTTP security headers applied
- **CORS**: Cross-origin requests enabled
- **Rate Limiting**: 100 requests per 15 minutes per IP
