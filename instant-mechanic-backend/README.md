# Instant Mechanic — Final Backend

Production-style backend for the **Live Vehicle Service Operations Dashboard** assignment.

## What is included

- Clean TypeScript + Express modular architecture
- MongoDB/Mongoose data modeling and indexes
- Deterministic realistic seed data: 5 users, 120 customers, 30 mechanics, 10 services, 1,250 bookings
- JWT authentication + ADMIN/OPERATIONS RBAC
- bcrypt password hashing
- Booking CRUD, status state machine, search, filters, sorting and pagination
- MongoDB aggregation dashboard
- Mechanic and customer APIs
- Service API
- Socket.IO authenticated real-time events
- Notification system
- Audit log + live activity feed
- CSV booking export
- Zod request validation
- Centralized error handling
- Helmet, CORS, rate limiting and request size limits
- Swagger/OpenAPI at `/api/docs`
- Health check at `/health`
- Jest + Supertest tests
- Docker + docker-compose
- Graceful shutdown and AWS-ready `process.env.PORT`

## Architecture

```text
Next.js Frontend
       ↓ REST + Socket.IO
Node.js + Express + TypeScript
       ↓
Controllers → Services → Mongoose
       ↓
MongoDB / MongoDB Atlas
```

Controllers stay thin. Business rules live in services.

## Install and run locally

```bash
npm install
cp .env.example .env
npm run typecheck
npm run seed
npm run dev
```

**Important:** this project uses CommonJS intentionally so `tsx` can run `.ts` source files directly. Do not change imports to `.js` while using this setup.

## Demo credentials

```text
ADMIN
admin@instantmechanic.com
Admin@123

OPERATIONS
ops1@instantmechanic.com
Ops@123
```

## API table

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | Public | Health/database status |
| POST | `/api/auth/login` | Public | Login/JWT |
| GET | `/api/auth/me` | JWT | Current user |
| GET | `/api/dashboard?range=7d` | ADMIN/OPS | Aggregated dashboard |
| GET | `/api/bookings` | ADMIN/OPS | List/search/filter/paginate |
| GET | `/api/bookings/:id` | ADMIN/OPS | Booking details |
| POST | `/api/bookings` | ADMIN/OPS | Create booking |
| PATCH | `/api/bookings/:id` | ADMIN/OPS | Update booking |
| PATCH | `/api/bookings/:id/status` | ADMIN/OPS | State transition |
| DELETE | `/api/bookings/:id` | ADMIN | Delete cancelled booking |
| GET | `/api/mechanics` | ADMIN/OPS | Mechanics list |
| GET | `/api/mechanics/:id` | ADMIN/OPS | Mechanic details |
| PATCH | `/api/mechanics/:id` | ADMIN/OPS | Update mechanic |
| GET | `/api/customers` | ADMIN/OPS | Customers list/search |
| GET | `/api/customers/:id` | ADMIN/OPS | Customer details |
| GET | `/api/services` | JWT | Active services |
| GET | `/api/notifications` | JWT | Notifications |
| PATCH | `/api/notifications/:id/read` | JWT | Mark notification read |
| GET | `/api/activity` | JWT | Recent operational activity |
| GET | `/api/audit-logs` | ADMIN | Audit log |
| GET | `/api/bookings/export/bookings` | ADMIN/OPS | CSV export |
| GET | `/api/docs` | Public | Swagger UI |

## Booking state machine

```text
PENDING
  ↓
ASSIGNED
  ↓
MECHANIC_ON_THE_WAY
  ↓
IN_PROGRESS
  ↓
COMPLETED
```

Cancellation is allowed from the active states where appropriate. Terminal states cannot be moved backward.

Completing a booking sets `completedAt`, increments mechanic completed jobs, makes the mechanic available, and updates customer spend. Changes are emitted through Socket.IO.

## Dashboard aggregation

The dashboard does not fetch all bookings into Node.js. MongoDB `$facet`, `$match`, `$group`, `$lookup` and `$dateToString` calculate summary counts, revenue, status breakdown, service breakdown and time-series data in the database. This scales much better for thousands of bookings.

## Socket.IO

Connect to `/socket.io` with:

```js
io("http://localhost:5000", {
  auth: { token: jwtToken }
});
```

Important events:

- `booking:updated`
- `dashboard:updated`
- `mechanic:updated`
- `notification:new`

Socket connections require a valid JWT.

## MongoDB schema/index explanation

Booking references Customer, Service and Mechanic using ObjectIds. Vehicle and location are embedded because they belong to the booking snapshot.

Key indexes:
- Booking: bookingId, status, scheduledAt, createdAt, customer, mechanic, registration number, compound status/date/customer/mechanic indexes
- Customer: customerId, name, email, phone
- Mechanic: mechanicId, email, status and status/specialization compound index
- Service: unique name and category/active
- User: unique email, role and active
- Notification/AuditLog: type/read/booking and createdAt

## Tests

```bash
npm test
```

The included tests verify protected-route authentication and public health behavior. The project structure is ready for expanding integration tests against a test MongoDB.

## Docker

```bash
docker compose up --build
```

The API is available on port 5000 and MongoDB on port 27017.

## AWS deployment

1. Create a MongoDB Atlas cluster and database user.
2. Put the Atlas connection string into `MONGODB_URI`.
3. Set a long random `JWT_SECRET`.
4. Build the Docker image and deploy the container to ECS/Fargate, Elastic Beanstalk, or another AWS container/runtime service.
5. Set `PORT`, `FRONTEND_URL` and other environment variables in the deployment configuration.
6. Configure the load balancer health check to `/health`.
7. Restrict MongoDB Atlas network access to the deployment environment where possible.
8. Never commit `.env`.

The application listens on `process.env.PORT` and `0.0.0.0`, so it does not depend on localhost.

## AI usage

AI tools were used for architecture brainstorming, boilerplate generation, debugging assistance, test scaffolding and documentation. The implementation should still be reviewed and tested manually before submission.

## Interview points

**Why services?** Controllers handle HTTP concerns; services hold business rules, making the code easier to test and maintain.

**Why aggregation?** Dashboard metrics are computed close to the data instead of transferring thousands of documents to Node.js.

**Why indexes?** They reduce query work for frequent status/date/customer/mechanic/search access patterns.

**Why JWT + RBAC?** JWT provides stateless authentication; role middleware controls which operations an authenticated user can perform.

**Why Socket.IO?** It lets operations dashboards receive booking/notification changes without polling or full reloads.

**Why transactions?** Booking status changes can update booking, mechanic, customer and audit/notification records together, preventing partial state changes when MongoDB transactions are supported by the deployment.

## Files to understand before interview

1. `src/models/Booking.ts`
2. `src/services/booking.service.ts`
3. `src/services/dashboard.service.ts`
4. `src/middleware/auth.middleware.ts`
5. `src/services/auth.service.ts`
6. `src/sockets/io.ts`
7. `src/seed/seed.ts`
8. `src/app.ts`
9. `src/server.ts`
10. `src/routes/booking.routes.ts`
