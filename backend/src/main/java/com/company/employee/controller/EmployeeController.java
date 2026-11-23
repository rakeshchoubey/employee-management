
package com.company.employee.controller;

import com.company.employee.entity.Employee;
import com.company.employee.repository.EmployeeRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    private final EmployeeRepository repository;

    public EmployeeController(EmployeeRepository repository) {
        this.repository = repository;
    }

    // GET - All employees
    @GetMapping
    public List<Employee> getEmployees() {
        return repository.findAll();
    }

    // GET - Employee by ID
    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Employee not found with ID: " + id
                    )
                );
    }

    // POST - Create employee
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Employee createEmployee(
            @Valid @RequestBody Employee employee) {

        employee.setId(null);

        return repository.save(employee);
    }

    // PUT - Update existing employee
    @PutMapping("/{id}")
    public Employee updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody Employee updatedEmployee) {

        Employee existingEmployee = repository.findById(id)
                .orElseThrow(() ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Employee not found with ID: " + id
                    )
                );

        existingEmployee.setName(updatedEmployee.getName());
        existingEmployee.setEmail(updatedEmployee.getEmail());
        existingEmployee.setDepartment(
            updatedEmployee.getDepartment()
        );

        return repository.save(existingEmployee);
    }

    // DELETE - Remove employee
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmployee(@PathVariable Long id) {

        Employee employee = repository.findById(id)
                .orElseThrow(() ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Employee not found with ID: " + id
                    )
                );

        repository.delete(employee);
    }
}
