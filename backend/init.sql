CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    department VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    manager_id INT REFERENCES employees(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data

INSERT INTO employees (name, email, department, role, manager_id, status) VALUES
('Alice Johnson', 'alice.johnson@example.com', 'Engineering', 'Engineering Manager', NULL, 'active'),
('Bob Smith', 'bob.smith@example.com', 'Human Resources', 'HR Manager', NULL, 'active'),
('Carol Danvers', 'carol.danvers@example.com', 'Sales', 'Sales Lead', NULL, 'active'),
('David Miller', 'david.miller@example.com', 'Engineering', 'Senior Developer', 1, 'active'),
('Emma Watson', 'emma.watson@example.com', 'Engineering', 'Junior Developer', 1, 'active'),
('Frank Castle', 'frank.castle@example.com', 'Human Resources', 'HR Associate', 2, 'inactive')
ON CONFLICT (email) DO NOTHING;
