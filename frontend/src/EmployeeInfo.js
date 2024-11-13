import React, { useEffect, useState } from 'react';
import './EmployeeInfo.css';

function EmployeeInfo() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false); // State to control popup visibility
    const [formData, setFormData] = useState({
        name: '',
        id: '',
        hours: '',
        contact: '',
        payroll: ''
    });

    // Fetch Inventory Data
    useEffect(() => {
        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/EmployeeInfo')
            .then(response => response.json())
            .then(data => setEmployees(data.employees))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Function to handle Delete Item button click
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

    // Open the form when "Add Item" is clicked
    const handleAdd = () => {
        setIsFormOpen(true);
    };

    // Function to highlight and store selected row
    const handleRowClick = (employee) => {

        // Toggle selection. If the clicked employee is already selected, deselect it
        if (selectedEmployee === employee.id) {
            setSelectedEmployee(null);
        } else {
            setSelectedEmployee(employee.id);
        }
    };
    
    // Function to handle when the form is submitted
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const { name, id, hours, contact, payroll } = formData;
    
        // Check if any field is empty
        if (!name || !id || !hours || !contact || !payroll) {
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
        const SQLcommand = `INSERT INTO employeedata (name, id, hours, contact, payroll) VALUES ('${name}', '${id}', '${hours}', '${contact}', '${payroll}')`;
        handleQuery(SQLcommand);
    
        const newEmployee = { name, id, hours, contact, payroll };
    
        // Add the new employee to the list and set the new employee as selected
        setEmployees((prevEmployees) => {
            const updatedEmployees = [...prevEmployees, newEmployee];
            setSelectedEmployee(newEmployee.id);
            return updatedEmployees;
        });
    
        // Close the form after submission an reset form data
        setIsFormOpen(false);
        setFormData({ name: '', id: '', hours: '', contact: '', payroll: '' });
    };
    
    // Function to send command to database
    const handleQuery = (query) => {
        fetch('https://panda-express-pos-backend-nc89.onrender.com/executeQuery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error executing query:', error));
    };

    // Function to handle form Close button
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setFormData({ name: '', id: '', hours: '', contact: '', payroll: '' });
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
