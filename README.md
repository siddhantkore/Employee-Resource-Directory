# Employee Resource Directory

A full-stack employee management application for creating, viewing, updating, deleting, searching, and filtering employee records with reporting manager relationships.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Testing | Jest, React Testing Library, Supertest |
| Deployment | Docker, Docker Compose |

## Features

- Employee listing with department and manager details
- Add, edit, and delete employee records
- Search employees by name
- Filter employees by department
- Client-side form validation
- Server-side validation and duplicate email handling
- PostgreSQL seed data with manager relationships

## Project Structure

```text
Employee-Resource-Directory/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── utils/
│   ├── tests/
│   ├── app.js
│   ├── server.js
│   └── init.sql
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
├── assets/
├── docker-compose.yml
└── README.md
```

## Docker Setup

Run the complete application with Docker Compose:

```bash
docker-compose up --build
```

Application URLs:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:5000/health`
- Employee API: `http://localhost:5000/api/employees`

## Manual Setup

### 1. Create PostgreSQL Database

```bash
psql -U postgres -c "CREATE DATABASE employee_directory;"
```

### 2. Seed Database

```bash
psql -U postgres -d employee_directory -f backend/init.sql
```

### 3. Backend Setup

```bash
cd backend
npm install
npx prisma generate
npm start
```

The backend runs on `http://localhost:5000`.

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Environment Variables

Create `backend/.env` with the following values:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/employee_directory?schema=public"
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/:id` | Get employee by ID |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/health` | Backend health check |

## Testing

Run backend tests:

```bash
cd backend
npm test
```

Run frontend tests:

```bash
cd frontend
npm test
```

## Important Points

- `backend/init.sql` creates the employees table and inserts sample seed data.
- Employee email addresses are unique.
- `manager_id` supports reporting manager relationships between employees.
- The frontend communicates with the backend through the `/api` route.
- Docker Compose starts PostgreSQL, backend, and frontend together.

## Screenshots

### All Employees

![All Employee Table](assets/AllEmployeeTable.png)

### Add Employee

![Add Employee Form](assets/AddEmployee.png)

### Department Filter

![Department Filter](assets/Filter.png)

### Filtered Employees

![Filtered Employees](assets/AnotherFilter.png)
