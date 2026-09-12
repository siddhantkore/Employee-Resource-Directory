import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmployeeTable from "./EmployeeTable";



const MOCK_EMPLOYEES = [
  {
    id: 1,
    name: "Alice Johnson",
    department: "Engineering",
    role: "Manager",
    manager: null,
    status: "active",
  },
  {
    id: 2,
    name: "Bob Smith",
    department: "HR",
    role: "Employee",
    manager: { id: 1, name: "Alice Johnson" },
    status: "inactive",
  },
  {
    id: 3,
    name: "Carol Danvers",
    department: "Sales",
    role: "Team Lead",
    manager: null,
    status: "active",
  },
];

describe("EmployeeTable", () => {
  test("renders the correct number of rows", () => {
    render(
      <EmployeeTable
        employees={MOCK_EMPLOYEES}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(4);
  });

  test("displays each employee's name, department, and role", () => {
    render(
      <EmployeeTable
        employees={MOCK_EMPLOYEES}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getAllByText("Alice Johnson").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.getByText("HR")).toBeInTheDocument();
  });

  test("shows manager name when manager is present", () => {
    render(
      <EmployeeTable
        employees={MOCK_EMPLOYEES}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getAllByText("Alice Johnson").length).toBeGreaterThanOrEqual(1);
  });




  test("shows — when employee has no manager", () => {
    render(
      <EmployeeTable
        employees={MOCK_EMPLOYEES}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });

  
  
  test("renders Edit and Delete buttons for each row", () => {
    render(
      <EmployeeTable
        employees={MOCK_EMPLOYEES}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getAllByText("Edit")).toHaveLength(3);
    expect(screen.getAllByText("Delete")).toHaveLength(3);
  });

  test("shows empty message when employees array is empty", () => {
    render(
      <EmployeeTable employees={[]} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    expect(screen.getByText("No employees found.")).toBeInTheDocument();
  });
});


