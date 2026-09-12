import { useState, useEffect, useCallback } from "react";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeForm from "./components/EmployeeForm";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "./api/employeeApi";
import "./App.css";

const DEPARTMENTS = ["Engineering", "Sales", "Finance", "HR", "Operations"];

function App() {
  // ── State ──────────────────────────────────────────────────────────────
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  // modal state
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = "Add" mode

  const [formLoading, setFormLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // ── Fetch employees ────────────────────────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const data = await getEmployees(search, department);
      setEmployees(data);
    } catch (err) {
      setFetchError(err.message || "Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  }, [search, department]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditTarget(null);
    setApiError("");
    setShowForm(true);
  };

  const handleOpenEdit = (employee) => {
    setEditTarget(employee);
    setApiError("");
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditTarget(null);
    setApiError("");
  };

  const handleSubmit = async (payload) => {
    setFormLoading(true);
    setApiError("");
    try {
      if (editTarget) {
        await updateEmployee(editTarget.id, payload);
      } else {
        await createEmployee(payload);
      }
      handleClose();
      fetchEmployees();
    } catch (err) {
      setApiError(err.message || "Something went wrong.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await deleteEmployee(id);
      // Optimistically remove from list
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete employee.");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <header className="app-header">
        <h1>Employee Resource Directory</h1>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          + Add Employee
        </button>
      </header>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search employees by name"
        />
        <select
          className="dept-select"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          aria-label="Filter by department"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <main className="app-main">
        {loading && <p className="status-msg">Loading…</p>}
        {!loading && fetchError && (
          <p className="status-msg error">{fetchError}</p>
        )}
        {!loading && !fetchError && (
          <EmployeeTable
            employees={employees}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      {showForm && (
        <EmployeeForm
          initial={editTarget}
          employees={employees}
          onSubmit={handleSubmit}
          onClose={handleClose}
          apiError={apiError}
          loading={formLoading}
        />
      )}
    </div>
  );
}

export default App;
