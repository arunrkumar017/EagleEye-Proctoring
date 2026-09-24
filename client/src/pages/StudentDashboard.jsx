import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function StudentDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fetchMySessions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/test-session/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(res.data);
      } catch (err) {
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMySessions();
  }, []);

  const completed = sessions.filter((s) => s.status === 'completed');
  const avgScore = completed.length
    ? Math.round(completed.reduce((sum, s) => sum + s.integrityScore, 0) / completed.length)
    : '—';
  const lastScore = sessions[0]?.integrityScore ?? '—';

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="page-wide" style={{ flex: 1 }}>
        <h2>Student Dashboard</h2>
        <p className="subtitle">Welcome back, {user?.name}! Here's your test history.</p>

        <div style={{ display: 'flex', gap: '20px', margin: '24px 0' }}>
          <div className="card" style={{ flex: 1, textAlign: 'center' }}>
            <div className="score-badge" style={{ fontSize: '28px' }}>{sessions.length}</div>
            <p className="subtitle" style={{ margin: '4px 0 0' }}>Tests Taken</p>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center' }}>
            <div className="score-badge" style={{ fontSize: '28px' }}>{avgScore}</div>
            <p className="subtitle" style={{ margin: '4px 0 0' }}>Avg Integrity Score</p>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center' }}>
            <div className="score-badge" style={{ fontSize: '28px' }}>{lastScore}</div>
            <p className="subtitle" style={{ margin: '4px 0 0' }}>Last Score</p>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Test History</h3>
            <button className="btn btn-primary" onClick={() => navigate('/test')}>
              + Start New Test
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : sessions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No tests taken yet. Click "Start New Test" to begin.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s._id}>
                    <td>{s.testName}</td>
                    <td>
                      <span className={`pill ${s.status === 'completed' ? 'pill-completed' : 'pill-in-progress'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{s.integrityScore}</td>
                    <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {new Date(s.startTime).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;