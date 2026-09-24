import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/test-session/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const viewViolations = async (session) => {
    setSelectedSession(session);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/violation/session/${session._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setViolations(res.data);
    } catch (err) {
      setViolations([]);
    }
  };

  const scoreColor = (score) => {
    if (score >= 85) return '#2e7d32';
    if (score >= 60) return '#f9a825';
    return '#c62828';
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '60px' }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: '60px', color: 'red' }}>{error}</p>;

  return (
  <>
    <Navbar />
    <div className="page-wide" style={{ display: 'flex', gap: '24px' }}>
      <div className="card" style={{ flex: 2 }}>
        <h2>Instructor Dashboard</h2>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Test</th>
              <th>Status</th>
              <th>Integrity Score</th>
              <th>Started</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s._id}>
                <td>{s.student?.name || 'Unknown'}</td>
                <td>{s.testName}</td>
                <td>
                  <span className={`pill ${s.status === 'completed' ? 'pill-completed' : 'pill-in-progress'}`}>
                    {s.status}
                  </span>
                </td>
                <td style={{ color: scoreColor(s.integrityScore), fontWeight: 700 }}>
                  {s.integrityScore}
                </td>
                <td style={{ fontSize: '13px', color: '#64748b' }}>
                  {new Date(s.startTime).toLocaleString()}
                </td>
                <td>
                  <button className="btn btn-primary" style={{ padding: '5px 14px', fontSize: '12px' }} onClick={() => viewViolations(s)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSession && (
        <div className="card" style={{ flex: 1, height: 'fit-content' }}>
          <h4>{selectedSession.student?.name}'s Violations</h4>
          <p className="subtitle">{selectedSession.testName}</p>
          {violations.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#64748b' }}>No violations recorded.</p>
          ) : (
            <ul className="activity-log" style={{ maxHeight: '300px' }}>
              {violations.map((v) => (
                <li key={v._id}>
                  <strong>{v.type}</strong> ({v.severity}) — {new Date(v.timestamp).toLocaleTimeString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  </>
);
}

export default Dashboard;