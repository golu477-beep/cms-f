import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API = 'https://cmsnew-b.vercel.app/';
const emptyEmployeeForm = { name: '', role: '', email: '' };
const emptyProjectForm = { name: '', description: '', status: 'Planning' };

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

function App() {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employeeForm, setEmployeeForm] = useState(emptyEmployeeForm);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'Todo', projectId: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, projRes, taskRes] = await Promise.all([
        axios.get(`${API}api/employees`),
        axios.get(`${API}api/projects`),
        axios.get(`${API}api/tasks`),
      ]);

      setEmployees(normalizeArray(empRes?.data));
      setProjects(normalizeArray(projRes?.data));
      setTasks(normalizeArray(taskRes?.data));
      setError('');
    } catch (err) {
      setEmployees([]);
      setProjects([]);
      setTasks([]);
      setError('Backend is not reachable. Set REACT_APP_API_URL to your backend URL or run the backend locally.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEmployeeChange = (e) => {
    setEmployeeForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProjectChange = (e) => {
    setProjectForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTaskChange = (e) => {
    setTaskForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addEmployee = async (e) => {
    if (e) e.preventDefault();
    try {
      setError('');
      setSuccess('');
      await axios.post(`${API}api/employees`, employeeForm);
      setEmployeeForm(emptyEmployeeForm);
      setSuccess('Employee added successfully');
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add employee');
    }
  };

  const addProject = async (e) => {
    if (e) e.preventDefault();
    try {
      setError('');
      setSuccess('');
      await axios.post(`${API}api/projects`, projectForm);
      setProjectForm(emptyProjectForm);
      setSuccess('Project added successfully');
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add project');
    }
  };

  const addTask = async (e) => {
    if (e) e.preventDefault();
    try {
      setError('');
      setSuccess('');
      await axios.post(`${API}api/tasks`, taskForm);
      setTaskForm({ title: '', description: '', status: 'Todo', projectId: '' });
      setSuccess('Task added successfully');
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add task');
    }
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">React CMS Dashboard</p>
          <h1>Manage employees and projects in one place</h1>
          <p className="subtitle">A clean React frontend connected to your Node.js backend.</p>
        </div>
      </header>

      {error ? <div className="alert error">{error}</div> : null}
      {success ? <div className="alert success">{success}</div> : null}

      <div className="grid">
        <section className="card">
          <h2>Add Employee</h2>
          <form onSubmit={addEmployee} className="form">
            <input name="name" value={employeeForm.name} onChange={handleEmployeeChange} placeholder="Name" required />
            <input name="role" value={employeeForm.role} onChange={handleEmployeeChange} placeholder="Role" required />
            <input name="email" type="email" value={employeeForm.email} onChange={handleEmployeeChange} placeholder="Email" required />
            <button type="submit">Save Employee</button>
          </form>
        </section>

        <section className="card">
          <h2>Add Project</h2>
          <form onSubmit={addProject} className="form">
            <input name="name" value={projectForm.name} onChange={handleProjectChange} placeholder="Project name" required />
            <textarea name="description" value={projectForm.description} onChange={handleProjectChange} placeholder="Description" rows="3" />
            <select name="status" value={projectForm.status} onChange={handleProjectChange}>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
            <button type="submit">Save Project</button>
          </form>
        </section>
      </div>

      <div className="grid">
        <section className="card">
          <h2>Task Management</h2>
          <form onSubmit={addTask} className="form">
            <input name="title" value={taskForm.title} onChange={handleTaskChange} placeholder="Task title" required />
            <textarea name="description" value={taskForm.description} onChange={handleTaskChange} placeholder="Task description" rows="3" />
            <select name="status" value={taskForm.status} onChange={handleTaskChange}>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select name="projectId" value={taskForm.projectId} onChange={handleTaskChange} required>
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            <button type="submit">Add Task</button>
          </form>
        </section>

        <section className="card">
          <h2>Employees</h2>
          {loading ? (
            <p>Loading employees...</p>
          ) : (
            <ul className="list">
              {employees.map((employee) => (
                <li key={employee._id}>
                  <strong>{employee.name}</strong>
                  <span>{employee.role}</span>
                  <small>{employee.email}</small>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2>Projects</h2>
          {loading ? (
            <p>Loading projects...</p>
          ) : (
            <ul className="list">
              {projects.map((project) => (
                <li key={project._id}>
                  <strong>{project.name}</strong>
                  <span>{project.status}</span>
                  <small>{project.description}</small>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2>Tasks</h2>
          {loading ? (
            <p>Loading tasks...</p>
          ) : (
            <ul className="list">
              {tasks.map((task) => (
                <li key={task._id}>
                  <strong>{task.title}</strong>
                  <span>{task.status}</span>
                  <small>{task.description}</small>
                  <small>Project: {task.projectId?.name || 'N/A'}</small>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
