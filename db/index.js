const connection = require("./connection");
// class db that holds all the methods for the queries
class db {
  constructor(connection) {
    this.connection = connection;
  }
  // find all departments, roles, employees and join them together to display all the information in a table 
  findAllDepartments() {
    return this.connection.promise().query("SELECT * FROM department");
  }
  findAllRoles() {
    return this.connection
      .promise()
      .query(
        "SELECT roles.id, roles.title, roles.salary, department.name AS department FROM roles LEFT JOIN department ON roles.department_id = department.id"
      );
  }
  findAllEmployees() {
    return this.connection.promise()
    .query(`SELECT
    employee.id, CONCAT(employee.first_name, ' ' , employee.last_name) AS name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ' , manager.last_name) AS manager
    FROM
    employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`);
}
// methods for adding a deparment, role, and employee to the database which are then inserted into the table
addADepartment(departmentName) {
    return this.connection
      .promise()
      .query("INSERT INTO department (name) VALUES (?)", [departmentName]);
  }
  addARole(roleTitle, roleSalary, roleDepartmentId) {
    return this.connection
      .promise()
      .query(
        "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
        [roleTitle, roleSalary, roleDepartmentId]
      );
  }
  addAnEmployee(answer) {
    return this.connection
      .promise()
      .query("INSERT INTO employee SET ?", answer);
  }
  // methods for updating and employess role and manager 
  updateAnEmployeeRole(roleId, employeeId) {
    return this.connection
      .promise()
      .query("UPDATE employee SET role_id = ? WHERE id = ?", [
        roleId,
        employeeId,
      ]);
  }
  updateAnEmployeeManager(managerId, employeeId) {
    return this.connection
      .promise()
      .query("UPDATE employee SET employee.manager_id = ? WHERE id = ?", [managerId, employeeId]);
  }  
  // method for finding managers and emplyees by manager and department 
  findAllManagers(employeeId) {
      return this.connection.promise().query("SELECT * FROM employee WHERE id != ?", [employeeId]);
  }
  findByManager(managerId) {
    return this.connection.promise().query(`SELECT employee.id, employee.manager_id, CONCAT(employee.first_name, ' ' , employee.last_name) AS name FROM employee LEFT JOIN roles on employee.role_id = roles.id WHERE manager_id = ?`, [managerId]);
  }
  findByDepartment(departmentId) {
      console.log("depId: ", departmentId)
    return this.connection.promise().query(`SELECT CONCAT(employee.first_name, ' ' , employee.last_name) AS name, department.name AS department
    FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id
    WHERE department.id = ?`, [departmentId]);
  }
  //methods for deleting a department, role, and employee from the database
  deleteADepartment(departmentId) {
    return this.connection.promise().query("DELETE FROM department WHERE id = ?", [departmentId]);
  }
  deleteARole(roleId) {
    console.log("roleId: ", roleId)
    return this.connection.promise().query("DELETE FROM roles WHERE id = ?", [roleId]); 
  }

  deleteAnEmployee(employeeId) {
    return this.connection.promise().query("DELETE FROM employee WHERE id = ?", [employeeId]);
  }
  //method that finds the total budget of a department whidh is the sum of all the salaries of the employees in that department
  findDepartmentBudget() {
    return this.connection.promise().query("SELECT department.name AS department, department.id, SUM(salary) AS total_salary FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id GROUP BY department.id");
  }
}
// export the db class
module.exports = new db(connection);