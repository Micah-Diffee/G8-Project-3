import React, { useEffect, useState } from 'react';
import './EmployeeInfo.css';

/**
 * Employee Info page that allows users to view and add employees.
 */
function EmployeeInfo() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false); // State to control popup visibility
    const [formData, setFormData] = useState({
        name: '',
        id: '',
        hours: '',
        contact: '',
        payroll: '',
        employeerole: '',
        password: 'PandaExpress'
    });

    /**
     * Fetches employee data from the server.
     */
    useEffect(() => {
        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/EmployeeInfo')
            .then(response => response.json())
            .then(data => setEmployees(data.employees))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    /**
     * Handles the deletion of a selected employee.
     * 
     * @function handleDelete
     */
    const handleDelete = () => {

        // If no employee is selected, show a message
        if (selectedEmployee === null) {
            alert("No employee is selected.");
            return;
        }
    
        // Delete the selected employee from the database
        const updatedEmployees = employees.filter(employee => employee.id !== selectedEmployee);
        setEmployees(updatedEmployees);
        setSelectedEmployee(null);
        const SQLcommand = `DELETE FROM employeedata WHERE id = '${selectedEmployee}'`;
        handleQuery(SQLcommand);
    };

    /**
     * Opens the form for adding a new employee.
     * 
     * @function handleAdd
     */
    const handleAdd = () => {
        setIsFormOpen(true);
    };

    /**
     * Handles the selection of an employee when a row in the table is clicked.
     * 
     * @function handleRowClick
     * @param employee - The employee that is selected.
     */
    const handleRowClick = (employee) => {

        // Toggle selection. If the clicked employee is already selected, deselect it
        if (selectedEmployee === employee.id) {
            setSelectedEmployee(null);
        } else {
            setSelectedEmployee(employee.id);
        }
    };
    
    /**
     * Handles form submission for adding a new employee to the database.
     * 
     * @function handleFormSubmit
     * @param e - The form submission event.
     */
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const { name, id, hours, contact, payroll, employeerole, password } = formData;
    
        // Check if any field is empty
        if (!name || !id || !hours || !contact || !payroll || !employeerole || !password) {
            alert("Please fill in all fields.");
            return;
        }
    
        // Validate that the ID is an 8-digit number
        if (!/^\d{8}$/.test(id)) {
            alert("Employee ID must be 8 digits.");
            return;
        }
    
        // Validate that hours is a valid number (can have decimal points)
        if (!/^\d*\.?\d+$/.test(hours)) {
            alert("Hours must be a number.");
            return;
        }
    
        // Validate that contact matches the phone number format (XXX)-XXX-XXXX
        if (!/^\(\d{3}\)-\d{3}-\d{4}$/.test(contact)) {
            alert("Contact must be in the form: (XXX)-XXX-XXXX");
            return;
        }
    
        // Validate that payroll is a valid number (can have decimal points)
        if (!/^\d*\.?\d+$/.test(payroll)) {
            alert("Payroll must be a number.");
            return;
        }
    
        // If all validations pass, proceed with the SQL insertion and form data reset
        const SQLcommand = `INSERT INTO employeedata (name, id, hours, contact, payroll, employeerole, password) VALUES ('${name}', '${id}', '${hours}', '${contact}', '${payroll}', '${employeerole}', '${password}')`;
        handleQuery(SQLcommand);
    
        const newEmployee = { name, id, hours, contact, payroll, employeerole, password };
    
        // Add the new employee to the list and set the new employee as selected
        setEmployees((prevEmployees) => {
            const updatedEmployees = [...prevEmployees, newEmployee];
            setSelectedEmployee(newEmployee.id);
            return updatedEmployees;
        });
    
        // Close the form after submission and reset form data
        setIsFormOpen(false);
        setFormData({ name: '', id: '', hours: '', contact: '', payroll: '', employeerole: '', password: '' });
    };
    
    /**
     * Sends a query to the server to execute a SQL command.
     *
     * @function handleQuery
     * @param query - The SQL command to be executed.
     */
    const handleQuery = (query) => {
        fetch('https://panda-express-pos-backend-nc89.onrender.com/executeQuery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        })
        .then(response => response.text())
        .catch(error => console.error('Error executing query:', error));
    };

    /**
     * Handles closing the form for adding a new employee.
     * 
     * @function handleCloseForm
     */
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setFormData({ name: '', id: '', hours: '', contact: '', payroll: '', employeerole: '', password: 'PandaExpress' });
    };

    return (
        <div className="employee-info-section">
            <h2 className="section-title">Employee Info</h2>
            <hr />
            <div className="employee-info-content">
                {/* Employee Table */}
                <div className="table-container">
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>ID</th>
                                <th>Hours</th>
                                <th>Contact</th>
                                <th>Payroll</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr
                                    key={employee.id}
                                    onClick={() => handleRowClick(employee)}
                                    className={selectedEmployee === employee.id ? 'selected-row' : ''}
                                >
                                    <td>{employee.name}</td>
                                    <td>{employee.employeerole}</td>
                                    <td>{employee.id}</td>
                                    <td>{employee.hours}</td>
                                    <td>{employee.contact}</td>
                                    <td>{employee.payroll}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="buttons">
                    <button className="action-button" onClick={handleAdd}>Add Employee</button>
                    <button className="action-button" onClick={handleDelete}>Delete Item</button>
                </div>
            </div>

            {/* Popup Form */}
            {isFormOpen && (
                <div className="form-popup">
                    <form className="form-container" onSubmit={handleFormSubmit}>
                        <h1>Add Employee</h1>
                        <hr />

                        <label for="name"><b>Name</b></label>
                        <input
                            type="text"
                            placeholder="Enter name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <label for="id"><b>ID</b></label>
                        <input
                            type="text"
                            placeholder="Enter ID"
                            name="id"
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                            required
                        />

                        <label for="employeerole"><b>Employee Role</b></label>
                        <select
                            name="employeerole"
                            value={formData.employeerole}
                            onChange={(e) => setFormData({ ...formData, employeerole: e.target.value })}
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="Manager">Manager</option>
                            <option value="Cashier">Cashier</option>
                        </select>

                        <label for="hours"><b>Hours</b></label>
                        <input
                            type="text"
                            placeholder="Enter hours"
                            name="hours"
                            value={formData.hours}
                            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                            required
                        />

                        <label for="contact"><b>Contact</b></label>
                        <input
                            type="text"
                            placeholder="Enter contact"
                            name="contact"
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            required
                        />

                        <label for="payroll"><b>Payroll</b></label>
                        <input
                            type="text"
                            placeholder="Enter payroll"
                            name="payroll"
                            value={formData.payroll}
                            onChange={(e) => setFormData({ ...formData, payroll: e.target.value })}
                            required
                        />

                        <button type="submit" className="btn">Add Employee</button>
                        <button type="button" className="btn cancel" onClick={handleCloseForm}>Close</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default EmployeeInfo;
