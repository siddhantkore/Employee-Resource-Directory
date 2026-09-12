const BASE_URL = "/api/employees";

const readResponseBody = async (res) => {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!text) return null;
  if (contentType.includes("application/json")) {
    return JSON.parse(text);
  }

  return text;
};

const getErrorMessage = (body, fallback) => {
  if (body && typeof body === "object" && body.error) return body.error;
  if (typeof body === "string" && body.trim()) return body.trim();
  return fallback;
};


/**
 * Fetch all employees / search employees by name and/or department.
 * @param {string} search - name search query
 * @param {string} department - department filter
 */
export async function getEmployees(search = "", department = "") {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (department) params.set("department", department);

  const url = params.size ? `${BASE_URL}?${params}` : BASE_URL;
  const res = await fetch(url);
  const body = await readResponseBody(res);
  if (!res.ok) throw new Error(getErrorMessage(body, "Failed to fetch employees."));
  return body;
}


/**
 * Create a new employee.
 * @param {Object} data - employee payload
 */
export async function createEmployee(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await readResponseBody(res);
  if (!res.ok) throw new Error(getErrorMessage(body, "Failed to create employee."));
  return body;
}


/**
 * Update an existing employee by ID.
 * @param {number} id
 * @param {Object} data - partial employee payload
 */
export async function updateEmployee(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await readResponseBody(res);
  if (!res.ok) throw new Error(getErrorMessage(body, "Failed to update employee."));
  return body;
}



/**
 * Delete a employee by ID.
 * @param {number} id
 */
export async function deleteEmployee(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await readResponseBody(res);
    throw new Error(getErrorMessage(body, "Failed to delete employee."));
  }
}
