import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RegistrationForm from './components/Form';
import AdminDashboard from './components/Admin';
import './styles/main.scss';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <nav>
          <div className="nav-container">
            <h1>Computer Class Registration</h1>
            <div className="nav-links">
              <Link to="/">Register</Link>
              <Link to="/admin">Admin Dashboard</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<RegistrationForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        <footer>
          <p>© 2025 Computer Class Registration System</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;