import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navItems = [
    { label: '🏠 Dashboard', path: '/student-dashboard' },
  ];

  return (
    <div style={{
      width: '220px',
      minHeight: '100vh',
      background: 'white',
      borderRight: '1px solid var(--border)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <h3 style={{ color: 'var(--primary)', marginBottom: '32px' }}>🦅 EagleEye</h3>

      {navItems.map((item) => (
        <div
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            padding: '10px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '4px',
            fontSize: '14px',
            fontWeight: location.pathname === item.path ? 600 : 400,
            background: location.pathname === item.path ? '#eff6ff' : 'transparent',
            color: location.pathname === item.path ? 'var(--primary)' : 'var(--text)',
          }}
        >
          {item.label}
        </div>
      ))}

      <div style={{ marginTop: 'auto' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          {user?.name} ({user?.role})
        </p>
        <button className="logout-btn" style={{ width: '100%' }} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;