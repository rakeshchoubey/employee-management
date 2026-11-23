
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080/api/employees";

async function handleResponse(response) {
  if (!response.ok) {
    let message = `Request failed: HTTP ${response.status}`;

    try {
      const error = await response.json();
      message = error.detail || error.message || message;
    } catch {
      // Response did not contain JSON
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// GET all employees
export async function getEmployees() {
  const response = await fetch(API_URL);
  return handleResponse(response);
}

// GET employee by ID
export async function getEmployeeById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  return handleResponse(response);
}

// POST new employee
export async function createEmployee(employee) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(employee)
  });

  return handleResponse(response);
}

// PUT existing employee
export async function updateEmployee(id, employee) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(employee)
  });

  return handleResponse(response);
}

// DELETE employee
export async function deleteEmployee(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  return handleResponse(response);
}
