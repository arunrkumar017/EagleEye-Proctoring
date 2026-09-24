import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="navbar">
      <h3>🦅 EagleEye</h3>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            {user.name} ({user.role})
          </span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Navbar;