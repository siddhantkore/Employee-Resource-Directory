const request = require("supertest");
const app = require("../app");
const prisma = require("../src/config/prismaClient");

const TEST_EMAIL_SUFFIX = "@testdomain.com";

afterAll(async () => {
  // Cleanup any test employees created during tests
  await prisma.employee.deleteMany({
    where: { email: { endsWith: TEST_EMAIL_SUFFIX } },
  });
  await prisma.$disconnect();
});

// ─── POST /api/employees ─────────────────────────────────────────────────────

describe("POST /api/employees", () => {
  test("400 — missing required fields", async () => {
    const res = await request(app).post("/api/employees").send({ name: "Test" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("400 — invalid email format", async () => {
    const res = await request(app).post("/api/employees").send({
      name: "Test", email: "bad-email", department: "Eng", role: "Dev",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/valid email/i);
  });

  test("400 — manager_id references non-existent employee", async () => {
    const res = await request(app).post("/api/employees").send({
      name: "Test", email: "orphan@testdomain.com", department: "Eng", role: "Dev", managerId: 999999,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/999999/);
  });

  test("201 — creates employee successfully", async () => {
    const payload = {
      name: "Jane Doe", email: "jane.doe@testdomain.com",
      department: "Finance", role: "Analyst", status: "active",
    };
    const res = await request(app).post("/api/employees").send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe(payload.name);
    expect(res.body.email).toBe(payload.email);
    expect(res.body.status).toBe("active");
  });

  test("400 — duplicate email rejected", async () => {
    const res = await request(app).post("/api/employees").send({
      name: "Dupe", email: "jane.doe@testdomain.com", department: "HR", role: "Manager",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });
});

// ─── GET /api/employees ──────────────────────────────────────────────────────

describe("GET /api/employees", () => {
  test("200 — returns array of employees", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("200 — search filter returns matching employees", async () => {
    const res = await request(app).get("/api/employees?search=Jane");
    expect(res.statusCode).toBe(200);
    expect(res.body.every((e) => e.name.toLowerCase().includes("jane"))).toBe(true);
  });

  test("200 — department filter works", async () => {
    const res = await request(app).get("/api/employees?department=Finance");
    expect(res.statusCode).toBe(200);
    expect(res.body.every((e) => e.department.toLowerCase() === "finance")).toBe(true);
  });
});

// ─── GET /api/employees/:id ──────────────────────────────────────────────────

describe("GET /api/employees/:id", () => {
  test("404 — non-existent employee", async () => {
    const res = await request(app).get("/api/employees/999999");
    expect(res.statusCode).toBe(404);
  });

  test("400 — invalid ID param", async () => {
    const res = await request(app).get("/api/employees/abc");
    expect(res.statusCode).toBe(400);
  });
});

// ─── PUT /api/employees/:id ──────────────────────────────────────────────────

describe("PUT /api/employees/:id", () => {
  test("404 — update non-existent employee", async () => {
    const res = await request(app).put("/api/employees/999999").send({ name: "Ghost" });
    expect(res.statusCode).toBe(404);
  });

  test("400 — invalid status value", async () => {
    // Get a valid employee first
    const listRes = await request(app).get("/api/employees?search=Jane");
    const id = listRes.body[0]?.id;
    if (!id) return;

    const res = await request(app).put(`/api/employees/${id}`).send({ status: "retired" });
    expect(res.statusCode).toBe(400);
  });
});

// ─── DELETE /api/employees/:id ───────────────────────────────────────────────

describe("DELETE /api/employees/:id", () => {
  test("404 — delete non-existent employee", async () => {
    const res = await request(app).delete("/api/employees/999999");
    expect(res.statusCode).toBe(404);
  });
});
