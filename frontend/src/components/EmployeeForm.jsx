import { useState, useEffect } from "react";

const DEPARTMENTS = ["Engineering ", "Sales", "Finance", "HR", "Operations"];
const ROLES = ["Employee", "Team Lead", "Manager"];

const EMPTY_FORM = {
  name: "",
  email: "",
  department: "",
  role: "",
  managerId: "",
  status: "active",
};



function EmployeeForm({ initial, employees, onSubmit, onClose, apiError, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        email: initial.email || "",
        department: initial.department || "",
        role: initial.role || "",
        managerId: initial.managerId != null ? String(initial.managerId) : "",
        status: initial.status || "active",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [initial]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };



  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!form.department) errs.department = "Department is required.";
    if (!form.role) errs.role = "Role is required.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }


    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      department: form.department,
      role: form.role,
      status: form.status,
      managerId: form.managerId ? parseInt(form.managerId, 10) : null,
    };
    onSubmit(payload);
  };



  const managerOptions = employees.filter(
    (emp) => !initial || emp.id !== initial.id
  );

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h2>{initial ? "Edit Employee" : "Add Employee"}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <select id="department" name="department" value={form.department} onChange={handleChange}>
              <option value="">— Select department —</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.department && <span className="field-error">{errors.department}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <select id="role" name="role" value={form.role} onChange={handleChange}>
              <option value="">— Select role —</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.role && <span className="field-error">{errors.role}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="managerId">Reporting Manager</label>
            <select id="managerId" name="managerId" value={form.managerId} onChange={handleChange}>
              <option value="">— No manager —</option>
              {managerOptions.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.department})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>


          {apiError && <p className="api-error">{apiError}</p>}

          <div className="modal-footer">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving…" : initial ? "Save Changes" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;



