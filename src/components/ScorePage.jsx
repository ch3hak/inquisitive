import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from './Header';

const ScorePage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { score, total, quizTitle, bannerImage } = state || {};

  if (!state) {
    navigate(`/quiz/${code}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />
      
      {bannerImage && (
        <div className="w-full h-48" style={{ background: '#2A2A2A' }}>
          <img 
            src={bannerImage} 
            alt="Quiz Banner" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="max-w-md mx-auto px-6 py-12">
        <div className="text-center text-white mb-12">
          <p className="text-xs mb-2 dm-sans-italic opacity-60">title</p>
          <h1 className="text-5xl mb-3" style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
            {quizTitle || 'QUIZ COMPLETE'}
          </h1>
        </div>

        <div className="space-y-6 mb-12">
          <div className="flex justify-between items-center text-white">
            <span className="text-xl dm-sans-italic" style={{ fontFamily: 'var(--font-heading)' }}>Score</span>
            <span className="text-3xl dm-sans-bold">{score}/{total}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/joined-quizzes')}
            className="flex-1 py-4 px-6 rounded-3xl text-xl transition-all text-white"
            style={{ background: 'rgba(255, 255, 255, 0.1)', fontFamily: 'var(--font-heading)' }}
          >
            Back
          </button>
          <button
            onClick={() => navigate(`/quiz/${code}`)}
            className="flex-1 py-4 px-6 rounded-3xl text-xl transition-all text-white"
            style={{ background: 'var(--color-create)', fontFamily: 'var(--font-heading)' }}
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScorePage;
