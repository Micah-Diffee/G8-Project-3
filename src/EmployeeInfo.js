import React from 'react';
import './EmployeeInfo.css';

function EmployeeInfo() {
    return (
        <div className="employee-info-section">
            <h2 className="section-title">Employee Info</h2>
            <hr />
            <div className="employee-info-content">
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
                            <tr>
                                <td>John Smith</td>
                                <td>11111111</td>
                                <td>36</td>
                                <td>(555)-555-5555</td>
                                <td>19.64</td>
                            </tr>
                            <tr>
                                <td>Sasha Andersen</td>
                                <td>12345678</td>
                                <td>32</td>
                                <td>(349)-861-4302</td>
                                <td>16.28</td>
                            </tr>
                            <tr>
                                <td>Chris Huff</td>
                                <td>00000000</td>
                                <td>20</td>
                                <td>(963)-628-7540</td>
                                <td>11.8</td>
                            </tr>
                            {/* Add other rows here */}
                        </tbody>
                    </table>
                </div>
                <div className="buttons">
                    <button className="action-button">Add Item</button>
                    <button className="action-button">Delete Item</button>
                </div>
            </div>
        </div>
    );
}

export default EmployeeInfo;
