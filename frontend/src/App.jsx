
import { useEffect, useState } from "react";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from "./api";

import "./App.css";

const emptyForm = {
  name: "",
  email: "",
  department: ""
};

function App() {

  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  // Fetch all employees
  async function loadEmployees() {
    try {
      const data = await getEmployees();
      setEmployees(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // Add or Update Employee
  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {

      const employeeData = {
        name: form.name.trim(),
        email: form.email.trim(),
        department: form.department.trim()
      };

      if (editingId !== null) {

        await updateEmployee(editingId, employeeData);

        setSuccess("Employee updated successfully!");

      } else {

        await createEmployee(employeeData);

        setSuccess("Employee added successfully!");
      }

      setForm(emptyForm);
      setEditingId(null);

      await loadEmployees();

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);
    }
  }

  // Populate form for editing
  function handleEdit(employee) {

    setEditingId(employee.id);

    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // Cancel editing
  function handleCancel() {

    setEditingId(null);
    setForm(emptyForm);

    setError("");
    setSuccess("");
  }

  // Delete employee
  async function handleDelete(id) {

    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {

      await deleteEmployee(id);

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }

      await loadEmployees();

      setSuccess("Employee deleted successfully!");

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);
    }
  }

  return (
    <div className="container">

      <h1>Employee Management System</h1>

      <p>Manage employee information using React and Spring Boot</p>

      <h2>
        {editingId !== null
          ? "Update Employee"
          : "Add New Employee"}
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading
            ? "Processing..."
            : editingId !== null
              ? "Update Employee"
              : "Add Employee"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            className="cancel"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}

      </form>

      {error && (
        <p className="error">{error}</p>
      )}

      {success && (
        <p className="success">{success}</p>
      )}

      <h2>Employee Directory</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {employees.length === 0 ? (

            <tr>
              <td colSpan="5">
                No employees found
              </td>
            </tr>

          ) : (

            employees.map(employee => (

              <tr key={employee.id}>

                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>

                <td>
                  <div className="actions">

                    <button
                      className="edit"
                      onClick={() => handleEdit(employee)}
                      disabled={loading}
                    >
                      Edit
                    </button>

                    <button
                      className="delete"
                      onClick={() => handleDelete(employee.id)}
                      disabled={loading}
                    >
                      Delete
                    </button>

                  </div>
                </td>

              </tr>

            ))

          )}

        </tbody>
      </table>

    </div>
  );
}

export default App;
