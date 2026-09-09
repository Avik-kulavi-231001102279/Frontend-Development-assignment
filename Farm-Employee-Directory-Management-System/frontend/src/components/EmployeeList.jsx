import React, { useState, useEffect } from 'react';
import { fetchEmployees as fetchEmployeesAPI, removeEmployee } from '../services/api';
import { Trash2, Edit } from 'lucide-react';

const EmployeeList = ({ onEdit, refreshKey, search, department, onCountUpdate }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true);
      try {
        const res = await fetchEmployeesAPI(search, department);
        setEmployees(res.data.employees);
        onCountUpdate(res.data.totalCount);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, [refreshKey, search, department]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await removeEmployee(id);
        onEdit(null, 'delete');
      } catch (err) {
        onEdit(null, 'error');
      }
    }
  };

  if (loading) return <div className="loading">Loading employees...</div>;

  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <p>No employees found.</p>
      </div>
    );
  }

  return (
    <div className="employee-table-wrapper">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Local Address</th>
            <th>Permanent Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td className="emp-id">{emp.employeeId}</td>
              <td>{emp.name}</td>
              <td>{emp.department}</td>
              <td>{emp.gender}</td>
              <td>{emp.phoneNumber}</td>
              <td>{emp.localAddress}</td>
              <td>{emp.permanentAddress}</td>
              <td className="actions-cell">
                <button className="action-btn edit-btn" onClick={() => onEdit(emp, 'edit')} title="Edit">
                  <Edit size={16} />
                </button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(emp._id)} title="Delete">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
