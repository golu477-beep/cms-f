import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        setEmployees(employees.filter((emp) => (emp._id || emp.id) !== id));
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  return (
    <div style={{ maxWidth: '100%', padding: '10px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Employees</h3>
      
      {employees.map((emp) => (
        <div 
          key={emp._id || emp.id} 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '12px 0', 
            borderBottom: '1px solid #e5e7eb' 
          }}
        >
          {/* Left Side: Employee Details */}
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#111827' }}>
              {emp.name}
            </div>
            <div style={{ fontSize: '14px', color: '#374151', margin: '2px 0' }}>
              {emp.role || 'Student'}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              {emp.email}
            </div>
          </div>

          {/* Right Side: Red Delete Button */}
          <button 
            onClick={() => handleDelete(emp._id || emp.id)}
            style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default EmployeeList;