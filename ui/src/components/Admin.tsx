import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaDownload, FaLock } from 'react-icons/fa';

interface Student {
  id: number;
  fullName: string;
  birthInfo: string;
  phoneNumber: string;
  altPhoneNumber: string;
  location: string;
  classSchedule: string;
}

const AdminDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'rolyne') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('http://localhost:5000/api/students')
        .then((response) => setStudents(response.data))
        .catch((error) => console.error('Error fetching students:', error));
    }
  }, [isAuthenticated]);

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:5000/api/students/${id}`)
      .then(() => setStudents(students.filter((student) => student.id !== id)))
      .catch((error) => console.error('Error deleting student:', error));
  };

  const handleDownload = () => {
    axios.get('http://localhost:5000/api/students/export', { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'students.xlsx');
        document.body.appendChild(link);
        link.click();
      });
  };

  if (!isAuthenticated) {
    return (
      <div className="form-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label><FaLock /> Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <button type="submit"><FaDownload /> Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <button onClick={handleDownload} className="download-btn">
        <FaDownload /> Download Excel
      </button>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Birth Date</th>
              <th>Phone</th>
              <th>Alt Phone</th>
              <th>Location</th>
              <th>Schedule</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.fullName}</td>
                <td>{student.birthInfo}</td>
                <td>{student.phoneNumber}</td>
                <td>{student.altPhoneNumber || '-'}</td>
                <td>{student.location}</td>
                <td>{student.classSchedule}</td>
                <td>
                  <button onClick={() => handleDelete(student.id)} className="delete-btn">
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;