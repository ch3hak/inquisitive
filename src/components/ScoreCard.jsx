import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const ScorePage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { score, total } = state || {};

  if (!state) {
    navigate(`/quiz/${code}`);
    return null;
  }

  return (
    <div style={{ maxWidth: 500, margin: '2em auto', padding: '1em', textAlign: 'center' }}>
      <h1>Quiz Complete!</h1>
      <div style={{
        padding: '1em',
        margin: '1.5em 0',
        borderTop: '1px solid #ccc',
        background: '#f9f9f9',
        borderRadius: '4px'
      }}>
        <h3>Your Score</h3>
        <p style={{ fontSize: '1.5em', margin: 0 }}>
          {score} / {total}
        </p>
      </div>
      <button onClick={() => navigate(`/quiz/${code}`)}>Review Quiz</button>
      <button onClick={() => navigate('/home')} style={{ marginLeft: 8 }}>
        Back to Home
      </button>
    </div>
  );
};

export default ScorePage;
