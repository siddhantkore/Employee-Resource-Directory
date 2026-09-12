# Employee Resource Directory

A full-stack CRUD application for managing employees, departments, and reporting structures.

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Database | **PostgreSQL**                    |
| ORM      | Prisma v7 (with `@prisma/adapter-pg`) |
| Backend  | Node.js + Express v5              |
| Frontend | React (Vite)                      |
| Testing  | Jest + Supertest (backend)        |

---

## Prerequisites

- Node.js >= 18
- PostgreSQL running locally (default port 5432)

---

## Database Setup

### 1. Create the database

```bash
psql -U postgres -c "CREATE DATABASE employee_directory;"
```

### 2. Run the seed file

This creates the `employees` table and inserts sample data:

```bash
psql -U postgres -d employee_directory -f backend/init.sql
```

The seed file creates the following table:

```sql
CREATE TABLE IF NOT EXISTS employees (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    department VARCHAR(50) NOT NULL,
    role       VARCHAR(50) NOT NULL,
    manager_id INT REFERENCES employees(id) ON DELETE SET NULL,
    status     VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

It seeds 6 employees across Engineering, HR, and Sales, including self-referencing manager relationships.

---

## Backend Setup

```bash
cd backend
```

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

`.env` fields:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=employee_directory

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/employee_directory?schema=public"
```

### 3. Generate the Prisma client

```bash
npx prisma generate
```

### 4. Start the server

```bash
npm start
```

The API will be available at `http://localhost:5000`.

---

## API Endpoints

| Method   | Endpoint               | Description                                             |
|----------|------------------------|---------------------------------------------------------|
| `GET`    | `/api/employees`       | List all employees. Supports `?search=` and `?department=` query params |
| `GET`    | `/api/employees/:id`   | Get a single employee (includes manager + direct reports) |
| `POST`   | `/api/employees`       | Create a new employee                                   |
| `PUT`    | `/api/employees/:id`   | Update an existing employee                             |
| `DELETE` | `/api/employees/:id`   | Delete an employee                                      |
| `GET`    | `/health`              | Health check                                            |

### Request body for POST / PUT

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "department": "Engineering",
  "role": "Senior Developer",
  "managerId": 1,
  "status": "active"
}
```

- `name`, `email`, `department`, `role` are **required** for POST.
- All fields are optional for PUT (partial update).
- `managerId` must reference an existing employee's `id` (or be omitted/null).
- `status` must be `"active"` or `"inactive"`.

---

## Running Backend Tests

```bash
cd backend
npm test
```

Tests use **Jest + Supertest** against the real development database. The test suite covers:

- `POST /api/employees` — missing fields, invalid email, non-existent managerId, successful creation, duplicate email
- `GET /api/employees` — list all, search filter, department filter
- `GET /api/employees/:id` — 404 for missing, 400 for invalid ID
- `PUT /api/employees/:id` — 404 for missing, invalid status value
- `DELETE /api/employees/:id` — 404 for missing

Test data is cleaned up after each run (any employee with `@testdomain.com` email is deleted).

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:5173`.

### Features

- **Employee table** — shows name, department, role, manager name, and active/inactive badge
- **Search bar** — live filter by name (debounced via state)
- **Department dropdown** — filter by department
- **Add Employee** button — opens a modal form
- **Edit** button per row — opens pre-filled modal form
- **Delete** button per row — confirmation dialog then removes
- **Loading / Error states** — "Loading…" while fetching, error message on failure

### Components

| Component | Description |
|---|---|
| `App.jsx` | Root — holds all state, fetches data, opens/closes modal |
| `EmployeeTable.jsx` | Reusable table — receives employees array + callbacks as props |
| `EmployeeForm.jsx` | Reusable modal form — works for both Add and Edit; client-side validation |
| `api/employeeApi.js` | All fetch calls isolated here — `getEmployees`, `createEmployee`, `updateEmployee`, `deleteEmployee` |

---

## Running Frontend Tests

```bash
cd frontend
npm test
```

Tests use **React Testing Library + Jest** and cover:

**EmployeeTable tests:**
- Renders correct number of rows given mock data
- Displays employee name, department, role
- Shows manager name when present / dash when absent
- Renders Edit and Delete buttons per row
- Shows empty message when array is empty

**EmployeeForm tests:**
- Shows all validation errors on empty submit
- Shows invalid email error
- Does NOT call `onSubmit` when validation fails
- Calls `onSubmit` with correct payload on valid form
- Displays server-side API error
- Pre-fills fields in edit mode
- Calls `onClose` when Cancel is clicked

---

## Project Structure

```
Employee-Resource-Directory/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # Prisma data model
│   ├── prisma.config.js         # Prisma v7 config (datasource URL)
│   ├── src/
│   │   ├── config/
│   │   │   └── prismaClient.js  # Prisma client singleton
│   │   ├── controllers/
│   │   │   └── employeeController.js
│   │   ├── routes/
│   │   │   └── employeeRoutes.js
│   │   └── utils/
│   │       └── validation.js    # Zod schemas
│   ├── tests/
│   │   └── employee.test.js
│   ├── app.js                   # Express app (no server.listen)
│   ├── server.js                # Entry point
│   └── init.sql                 # Schema + seed data
├── frontend/
│   └── src/
└── README.md
```

---

## Assumptions & Notes

- **Database**: PostgreSQL was chosen over MySQL for native support of `SERIAL`, `TIMESTAMP`, and referential integrity.
- **ORM**: Prisma v7 is used. It requires a `prisma.config.js` file for the datasource URL (breaking change from v6).
- **Status column**: Stored as `VARCHAR(20)` with a `CHECK` constraint in SQL (matching Prisma `String` type) rather than a native PostgreSQL `ENUM` — this avoids migration complexity while still enforcing valid values through Zod validation.
- **Tests run against the real dev DB**: There is no separate test database. All test records use the `@testdomain.com` email suffix and are cleaned up in `afterAll`.
- **Frontend**: Currently scaffolded — implementation pending.

---

## Docker (Optional)

A `docker-compose.yml` is provided in the root. It brings up PostgreSQL, the backend, and the frontend together:

```bash
docker-compose up --build
```