import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Live Vercel backend/local URL dynamic fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/employees';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 2. Delete Handler
  const handleDelete = async (id) => {
    if (!id) {
      alert("Employee ID not found!");
      return;
    }

    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        
        // Optimistic UI update (Instant delete from UI)
        setEmployees((prevEmployees) => 
          prevEmployees.filter((emp) => (emp._id || emp.id) !== id)
        );
      } catch (err) {
        console.error('Failed to delete:', err);
        alert('Failed to delete employee. Check backend CORS or URL settings.');
      }
    }
  };

  if (loading) {
    return <div style={{ padding: '10px' }}>Loading employees...</div>;
  }

  return (
    <div style={{ maxWidth: '100%', padding: '15px', fontFamily: 'sans-serif' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>
        Employees
      </h3>

      {employees.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No employees found.</p>
      ) : (
        employees.map((emp) => {
          const empId = emp._id || emp.id;

          return (
            <div 
              key={empId} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '12px 0', 
                borderBottom: '1px solid #e5e7eb' 
              }}
            >
              {/* Left Side: Employee Info */}
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#111827' }}>
                  {emp.name}
                </div>
                <div style={{ fontSize: '14px', color: '#4b5563', margin: '2px 0' }}>
                  {emp.role || emp.designation || 'Student'}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  {emp.email}
                </div>
              </div>

              {/* Right Side: Red Delete Button */}
              <button 
                onClick={() => handleDelete(empId)}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                Delete
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default EmployeeList;