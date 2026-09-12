CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    department VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    manager_id INT REFERENCES employees(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO employees (name, email, department, role, status)
VALUES
    ('Alice Johnson', 'alice.johnson@example.com', 'Engineering', 'Manager', 'active'),
    ('Bob Smith', 'bob.smith@example.com', 'HR', 'Manager', 'active'),
    ('Carol Danvers', 'carol.danvers@example.com', 'Sales', 'Team Lead', 'active')
ON CONFLICT (email) DO NOTHING;

INSERT INTO employees (name, email, department, role, manager_id, status)
VALUES
    (
        'David Miller',
        'david.miller@example.com',
        'Engineering',
        'Employee',
        (SELECT id FROM employees WHERE email = 'alice.johnson@example.com'),
        'active'
    ),
    (
        'Emma Watson',
        'emma.watson@example.com',
        'Finance',
        'Employee',
        (SELECT id FROM employees WHERE email = 'bob.smith@example.com'),
        'active'
    ),
    (
        'Frank Castle',
        'frank.castle@example.com',
        'Operations',
        'Employee',
        (SELECT id FROM employees WHERE email = 'carol.danvers@example.com'),
        'inactive'
    )
ON CONFLICT (email) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('employees', 'id'),
    COALESCE((SELECT MAX(id) FROM employees), 1),
    true
);
