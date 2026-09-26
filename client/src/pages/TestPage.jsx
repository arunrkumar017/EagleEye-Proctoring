import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const QUESTION_BANKS = {
  DSA: [
    { id: 1, text: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], correct: 'O(log n)' },
    { id: 2, text: 'Which data structure follows LIFO (Last In First Out)?', options: ['Queue', 'Stack', 'Linked List', 'Array'], correct: 'Stack' },
    { id: 3, text: 'What is the worst-case time complexity of Quicksort?', options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], correct: 'O(n²)' },
    { id: 4, text: 'Which of these is used to handle collisions in a hash table?', options: ['Recursion', 'Chaining', 'Binary Search', 'Sorting'], correct: 'Chaining' },
    { id: 5, text: 'What is the space complexity of an adjacency matrix for a graph with n vertices?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], correct: 'O(n²)' },
  ],
  OS: [
    { id: 1, text: 'Which scheduling algorithm can cause starvation?', options: ['Round Robin', 'Priority Scheduling', 'FCFS', 'SJF (non-preemptive, fair queue)'], correct: 'Priority Scheduling' },
    { id: 2, text: 'What is a deadlock?', options: ['A process finishing early', 'Two or more processes waiting on each other indefinitely', 'A memory leak', 'A CPU overheating'], correct: 'Two or more processes waiting on each other indefinitely' },
    { id: 3, text: 'Which of these is NOT one of the four necessary conditions for deadlock?', options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption', 'Circular Wait'], correct: 'Preemption' },
    { id: 4, text: 'What does "thrashing" refer to in an OS?', options: ['High CPU usage', 'Excessive paging activity degrading performance', 'A disk crash', 'A network failure'], correct: 'Excessive paging activity degrading performance' },
    { id: 5, text: 'Which memory management technique divides memory into fixed-size blocks?', options: ['Segmentation', 'Paging', 'Swapping', 'Caching'], correct: 'Paging' },
  ],
  DBMS: [
    { id: 1, text: 'Which normal form removes partial dependency?', options: ['1NF', '2NF', '3NF', 'BCNF'], correct: '2NF' },
    { id: 2, text: 'What does ACID stand for in transactions?', options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Index, Data', 'Atomic, Complete, Integrated, Durable', 'None of these'], correct: 'Atomicity, Consistency, Isolation, Durability' },
    { id: 3, text: 'Which key uniquely identifies a row and cannot be null?', options: ['Foreign Key', 'Primary Key', 'Candidate Key', 'Super Key'], correct: 'Primary Key' },
    { id: 4, text: 'Which SQL clause is used to filter grouped results?', options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], correct: 'HAVING' },
    { id: 5, text: 'What type of join returns only matching rows from both tables?', options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL OUTER JOIN'], correct: 'INNER JOIN' },
  ],
    CN: [
    { id: 1, text: 'Which layer of the OSI model is responsible for routing?', options: ['Data Link', 'Network', 'Transport', 'Session'], correct: 'Network' },
    { id: 2, text: 'Which protocol is used to translate domain names into IP addresses?', options: ['DHCP', 'DNS', 'FTP', 'ARP'], correct: 'DNS' },
    { id: 3, text: 'What is the main difference between TCP and UDP?', options: ['TCP is connectionless, UDP is connection-oriented', 'TCP is connection-oriented and reliable, UDP is connectionless and faster', 'They are identical', 'UDP guarantees delivery, TCP does not'], correct: 'TCP is connection-oriented and reliable, UDP is connectionless and faster' },
    { id: 4, text: 'Which device operates at the Data Link layer and forwards frames based on MAC addresses?', options: ['Router', 'Hub', 'Switch', 'Repeater'], correct: 'Switch' },
    { id: 5, text: 'What does DHCP stand for?', options: ['Dynamic Host Configuration Protocol', 'Direct Host Control Protocol', 'Data Handling Control Protocol', 'Dynamic Hyperlink Control Protocol'], correct: 'Dynamic Host Configuration Protocol' },
  ],
  'AI & ML': [
    { id: 1, text: 'What is overfitting in machine learning?', options: ['Model performs well on both training and test data', 'Model performs well on training data but poorly on unseen data', 'Model fails to learn anything', 'Model uses too little data'], correct: 'Model performs well on training data but poorly on unseen data' },
    { id: 2, text: 'Which of these is a supervised learning algorithm?', options: ['K-Means Clustering', 'Linear Regression', 'Apriori Algorithm', 'PCA'], correct: 'Linear Regression' },
    { id: 3, text: 'What does "gradient descent" primarily do?', options: ['Splits data into train/test sets', 'Minimizes a loss function by iteratively updating parameters', 'Selects the best features', 'Encodes categorical variables'], correct: 'Minimizes a loss function by iteratively updating parameters' },
    { id: 4, text: 'In a Convolutional Neural Network (CNN), what is the primary purpose of a pooling layer?', options: ['Increase image resolution', 'Reduce spatial dimensions and computation', 'Add color channels', 'Normalize pixel values only'], correct: 'Reduce spatial dimensions and computation' },
    { id: 5, text: 'Which metric is most appropriate for evaluating a highly imbalanced classification problem?', options: ['Accuracy', 'F1-Score', 'Mean Squared Error', 'R² Score'], correct: 'F1-Score' },
  ],
};

const SUBJECTS = Object.keys(QUESTION_BANKS);

function TestPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();
  
  const [stage, setStage] = useState('select-subject'); // 'select-subject' -> 'preview' -> 'active' -> 'submitted'
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [integrityScore, setIntegrityScore] = useState(100);
  const [log, setLog] = useState([]);
  const [answers, setAnswers] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const QUESTIONS = selectedSubject ? QUESTION_BANKS[selectedSubject] : [];
  
  const consecutiveNoFaceRef = useRef(0);
  const consecutiveMultiFaceRef = useRef(0);

  const token = localStorage.getItem('token');

  const addLog = (message) => {
    setLog((prev) => [`${new Date().toLocaleTimeString()} — ${message}`, ...prev]);
  };

  // Turn the webcam ON (used for the preview step)
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraReady(true);
    } catch (err) {
      setCameraError('Camera access denied. Please allow camera access to continue.');
    }
  };

  // Turn the webcam OFF completely (stops the physical camera light too)
  const stopWebcam = () => {
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => {
      track.stop();
      console.log(`Stopped track: ${track.kind}, readyState: ${track.readyState}`);
    });
    streamRef.current = null;
  }
  if (videoRef.current) {
    videoRef.current.srcObject = null;
    videoRef.current.pause();
  }
};

  // Reattach the camera stream whenever we switch stages (video element re-mounts)
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [stage]);

  // Start camera preview as soon as the component mounts
  useEffect(() => {
    return () => stopWebcam();
  }, []);

  const beginTest = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/test-session/start`,
        { testName: `${selectedSubject} Mock Test` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessionId(res.data.session._id);
      addLog('Test session started');
      setStage('active');
    } catch (err) {
      addLog('Failed to start test session');
    }
  };

  const submitTest = async () => {
    try {
      if (sessionId) {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/test-session/end/${sessionId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      addLog('Failed to mark test ended on server');
    } finally {
      stopWebcam(); // guaranteed camera-off on submit, success or failure
      addLog('Test submitted, camera turned off');
      setStage('submitted');
    }
  };

  const handleOptionSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append('frame', blob, 'frame.jpg');

      try {
        const res = await axios.post(`${import.meta.env.VITE_AI_URL}/api/analyze-frame`, formData);
        const { faceCount, violation } = res.data;

        if (violation === 'no-face') {
          consecutiveNoFaceRef.current += 1;
          consecutiveMultiFaceRef.current = 0;
          if (consecutiveNoFaceRef.current === 3) {
            addLog('Violation confirmed: no-face for multiple checks');
            logViolation('no-face', 'medium');
          } else {
            addLog(`No face detected (${consecutiveNoFaceRef.current}/3) — watching`);
          }
        } else if (violation === 'multiple-faces') {
          consecutiveMultiFaceRef.current += 1;
          consecutiveNoFaceRef.current = 0;
          if (consecutiveMultiFaceRef.current === 2) {
            addLog('Violation confirmed: multiple faces');
            logViolation('multiple-faces', 'high');
          } else {
            addLog(`Multiple faces detected (${consecutiveMultiFaceRef.current}/2) — watching`);
          }
        } else {
          consecutiveNoFaceRef.current = 0;
          consecutiveMultiFaceRef.current = 0;
        }
      } catch (err) {
        addLog('AI service unreachable');
      }
    }, 'image/jpeg');
  };

  const logViolation = async (type, severity) => {
    if (!sessionId) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/violation/log`,
        { testSessionId: sessionId, type, severity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIntegrityScore(res.data.newIntegrityScore);
    } catch (err) {
      addLog('Failed to log violation to server');
    }
  };

  // Tab-switch / window-blur detection — only while test is active
  useEffect(() => {
    if (stage !== 'active') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addLog('Tab switch detected');
        logViolation('tab-switch', 'low');
      }
    };
    const handleBlur = () => {
      addLog('Window lost focus');
      logViolation('window-blur', 'low');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [stage, sessionId]);

  // Periodic frame capture — only while test is active
  useEffect(() => {
    if (stage !== 'active') return;
    const interval = setInterval(captureAndAnalyze, 5000);
    return () => clearInterval(interval);
  }, [stage, sessionId]);

  const calculateMarks = () => {
    let correctCount = 0;
    QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correct) correctCount += 1;
    });
    return correctCount;
  };

  // ----- SUBMITTED SCREEN -----
  if (stage === 'submitted') {
    const marks = calculateMarks();
    return (
      <div className="page">
        <div className="card">
          <h2>Test Submitted</h2>
          <p><span className="score-badge">{marks} / {QUESTIONS.length}</span> questions correct</p>
          <p>Final Integrity Score: <span className="score-badge">{integrityScore} / 100</span></p>

          <h4>Answer Review</h4>
          {QUESTIONS.map((q) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correct;
            const cls = !userAnswer ? 'answer-neutral' : isCorrect ? 'answer-correct' : 'answer-incorrect';
            return (
              <div key={q.id} style={{ marginBottom: '14px' }}>
                <p style={{ marginBottom: '4px' }}><strong>Q{q.id}: {q.text}</strong></p>
                <div className={`answer-block ${cls}`}>
                  Your answer: {userAnswer || '(Not answered)'}
                  {userAnswer && (isCorrect ? '  ✅' : `  ❌ (Correct: ${q.correct})`)}
                </div>
              </div>
            );
          })}

          <h4>Full Activity Log</h4>
          <ul className="activity-log">
            {log.map((entry, i) => <li key={i}>{entry}</li>)}
          </ul>

          <button
            className="btn btn-primary"
            style={{ marginTop: '20px' }}
            onClick={() => navigate('/student-dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ----- SUBJECT SELECTION STAGE -----
  if (stage === 'select-subject') {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Choose a Subject</h2>
          <p className="subtitle">Select which subject you'd like to be tested on</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                className="btn btn-primary"
                onClick={() => {
                  setSelectedSubject(subject);
                  setStage('preview-loading'); // brief intermediate step
                  setTimeout(() => setStage('preview'), 0);
                }}
                style={{ padding: '14px', fontSize: '15px' }}
              >
                {subject} — {QUESTION_BANKS[subject].length} Questions
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ----- CAMERA PREVIEW STAGE (built-in, no separate page) -----
  if (stage === 'preview') {
      if (!streamRef.current && !cameraError) {
        startWebcam();
      }
    return (
      <div className="page">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>🎥 Camera Preview</h2>
          <p className="subtitle">
            Your webcam will be monitored throughout the test for face visibility and tab activity.
          </p>

          <div style={{
            width: '320px', height: '240px', margin: '20px auto',
            borderRadius: '10px', overflow: 'hidden', background: '#000',
            border: '2px solid var(--border)',
          }}>
            <video ref={videoRef} autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {cameraError && <p className="error-text">{cameraError}</p>}
          {cameraReady && !cameraError && (
            <p style={{ color: 'var(--success)', fontSize: '13px' }}>✅ Camera is working correctly</p>
          )}

          <button
            className="btn btn-success"
            disabled={!cameraReady}
            onClick={beginTest}
            style={{ marginTop: '16px', opacity: cameraReady ? 1 : 0.5 }}
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  // ----- ACTIVE TEST STAGE -----
  return (
    <div className="page">
      <div className="card">
        <h2>EagleEye — {selectedSubject} Mock Test</h2>
        <p>Integrity Score: <span className="score-badge">{integrityScore}</span></p>

        <video ref={videoRef} autoPlay muted className="webcam-frame" />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {QUESTIONS.map((q) => (
          <div key={q.id} className="question-card">
            <h4>Q{q.id}: {q.text}</h4>
            {q.options.map((opt) => (
              <label key={opt} className="option-label">
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleOptionSelect(q.id, opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}

        <button onClick={submitTest} className="btn btn-success">Submit Test</button>

        <h4 style={{ marginTop: '24px' }}>Activity Log</h4>
        <ul className="activity-log">
          {log.map((entry, i) => <li key={i}>{entry}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default TestPage;