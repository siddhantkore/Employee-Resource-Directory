import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmployeeForm from "./EmployeeForm";

const MOCK_EMPLOYEES = [
  { id: 1, name: "Alice Johnson", department: "Engineering" },
];

const noop = jest.fn();

describe("EmployeeForm — validation", () => {
  test("shows validation errors when form is submitted empty", () => {
    render(
      <EmployeeForm
        initial={null}
        employees={[]}
        onSubmit={noop}
        onClose={noop}
        apiError=""
        loading={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));

    expect(screen.getByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Department is required.")).toBeInTheDocument();
    expect(screen.getByText("Role is required.")).toBeInTheDocument();
  });

  test("shows invalid email error for bad email format", () => {
    render(
      <EmployeeForm
        initial={null}
        employees={[]}
        onSubmit={noop}
        onClose={noop}
        apiError=""
        loading={false}
      />
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "not-an-email" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));

    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
  });

  test("does NOT call onSubmit when validation fails", () => {
    const onSubmit = jest.fn();
    render(
      <EmployeeForm
        initial={null}
        employees={[]}
        onSubmit={onSubmit}
        onClose={noop}
        apiError=""
        loading={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("calls onSubmit with correct payload when form is valid", () => {
    const onSubmit = jest.fn();
    render(
      <EmployeeForm
        initial={null}
        employees={MOCK_EMPLOYEES}
        onSubmit={onSubmit}
        onClose={noop}
        apiError=""
        loading={false}
      />
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/department/i), {
      target: { value: "Engineering" },
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: "Employee" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Jane Doe",
        email: "jane@example.com",
        department: "Engineering",
        role: "Employee",
        status: "active",
        managerId: null,
      })
    );
  });

  test("shows server-side apiError when provided", () => {
    render(
      <EmployeeForm
        initial={null}
        employees={[]}
        onSubmit={noop}
        onClose={noop}
        apiError="An employee with this email already exists."
        loading={false}
      />
    );

    expect(
      screen.getByText("An employee with this email already exists.")
    ).toBeInTheDocument();
  });

  test("renders in edit mode with pre-filled values", () => {
    const existing = {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      department: "Engineering",
      role: "Manager",
      managerId: null,
      status: "active",
    };

    render(
      <EmployeeForm
        initial={existing}
        employees={MOCK_EMPLOYEES}
        onSubmit={noop}
        onClose={noop}
        apiError=""
        loading={false}
      />
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue("Alice Johnson");
    expect(screen.getByLabelText(/email/i)).toHaveValue("alice@example.com");
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  test("calls onClose when Cancel is clicked", () => {
    const onClose = jest.fn();
    render(
      <EmployeeForm
        initial={null}
        employees={[]}
        onSubmit={noop}
        onClose={onClose}
        apiError=""
        loading={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onClose).toHaveBeenCalled();
  });
});
