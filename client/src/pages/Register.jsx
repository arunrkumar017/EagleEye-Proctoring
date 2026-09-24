import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        role: 'student', // public registration is always as a student
      });

      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Create your EagleEye account</h2>
        <p className="subtitle">Register as a student to take proctored tests</p>

        <form onSubmit={handleRegister}>
          <div className="field">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{ paddingRight: '40px' }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#64748b',
                  userSelect: 'none',
                }}
              >
                {showPassword ? '🙈 Hide' : '👁 Show'}
              </span>
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}
          {success && <p style={{ color: 'var(--success)', fontSize: '13px' }}>{success}</p>}

          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>

        <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;