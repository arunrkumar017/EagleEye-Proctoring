import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      // save token so we can use it for future requests
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (res.data.user.role === 'instructor') {
        navigate('/dashboard');
      } else {
        navigate('/student-dashboard');
      }

    
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
  <div className="page">
    <div className="card">
      <h2>EagleEye Login</h2>
      <p className="subtitle">Sign in to continue</p>
      <form onSubmit={handleLogin}>
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
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  </div>
);
}

export default Login;