import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from './Header';

const ScorePage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { score, total, quizTitle, bannerImage, timeTaken, startedAt, quizCode, answeredCount } = state || {};

  if (!state) {
    navigate(`/quiz/${code}`);
    return null;
  }

  const formatTimeTaken = (seconds) => {
    if (!seconds) return '00:00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    return { time, date: dateStr };
  };

  const { time: startTime, date: startDate } = formatDateTime(startedAt);

  return (
    <div className="min-h-screen" style={{ background: '#191023' }}>
      <Header/>
      {bannerImage && (
        <div className="w-full h-32" style={{ background: 'linear-gradient(180deg, rgba(89,132,255,0.3) 0%, rgba(41,5,95,0.5) 100%)' }}>
          <img 
            src={bannerImage} 
            alt="Quiz Banner" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
      )}
      
      <div className="max-w-md mx-auto px-6 py-8">
        <div className="text-center text-white mb-10">
          <p className="text-s opacity-80" style={{ fontFamily: 'var(--font-heading)', fontStyle :'italic' }}>
            title
          </p>
          <h1 
            className="text-5xl mb-2 leading-tight font-semibold"
            style={{ 
              fontFamily: 'var(--text-main)', 
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              lineHeight: '1.2'
            }}
          >
            {quizTitle || 'Untitled'}
          </h1>
          {/* <p className="text-xs dm-sans-italic mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
            By: Amber coma A_kk89
          </p> */}
        </div>

        <div className="space-y-4 mb-10 text-white">
          <div className="flex justify-between items-center">
            <span className="text-2xl" style={{fontFamily: 'var(--font-heading)', fontStyle :'italic'}}>
              Time Taken
            </span>
            <span className="text-xl tracking-wider" style={{fontFamily: 'var(--font-main)'}}>
              {formatTimeTaken(timeTaken)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-2xl" style={{fontFamily: 'var(--font-heading)', fontStyle :'italic'}}>
              Started at
            </span>
            <div className="text-right">
              <div className="text-xl" style={{fontFamily: 'var(--font-main)'}}>{startTime || '08:00 PM'}</div>
              <div className=" text-xs" style={{fontFamily: 'var(--font-main)'}}>
                {startDate || '29th august 2025'}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-2xl" style={{fontFamily: 'var(--font-heading)', fontStyle :'italic'}}>
              Code
            </span>
            <span className="text-xl" style={{fontFamily: 'var(--font-main)'}}>
              #{quizCode || code || '5SUMPLA6OTH'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-2xl" style={{fontFamily: 'var(--font-heading)', fontStyle :'italic'}}>
              Answered
            </span>
            <span className="text-xl" style={{fontFamily: 'var(--font-main)'}}>
              {answeredCount || total}/{total}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3">
            <span className="text-2xl" style={{fontFamily: 'var(--font-heading)', fontStyle :'italic'}}>
              Score
            </span>
            <span className="text-xl" style={{fontFamily: 'var(--font-main)'}}>
              {score}/{total}
            </span>
          </div>
        </div>

        <div className="flex gap-4 mt-12">
          <button
            onClick={() => navigate('/joined-quizzes')}
            className="flex-1 py-4 rounded-full text-lg transition-all dm-sans-regular"
            style={{ 
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              border: 'none'
            }}
          >
            Back
          </button>
          <button
            onClick={() => navigate(`/quiz/${code}`)}
            className="flex-1 py-4 rounded-full text-lg transition-all dm-sans-regular"
            style={{ 
              background: 'var(--color-join)',
              color: 'white',
              border: 'none'
            }}
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScorePage;
