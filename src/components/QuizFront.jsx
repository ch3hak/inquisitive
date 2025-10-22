import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const QuizFront = ({ mode, onProceed, quizData }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(quizData?.title || '');
  const [bannerImage, setBannerImage] = useState(quizData?.bannerImage || null);
  const [uploading, setUploading] = useState(false);
  const [duration, setDuration] = useState(quizData?.duration || { hours: 0, minutes: 0, seconds: 0 });
  const [startDate, setStartDate] = useState(quizData?.startDate || '');
  const [startTime, setStartTime] = useState(quizData?.startTime || '00:00');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerImage(reader.result); 
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleProceed = () => {
    if (mode === 'create' && !title.trim()) {
      alert('Please enter a quiz title');
      return;
    }

    const frontData = {
      title,
      bannerImage,
      duration,
      startDate,
      startTime: startTime || '00:00'
    };

    onProceed(frontData);
  };

  const formatDuration = () => {
    const { hours, minutes, seconds } = duration;
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);
    return parts.join(' ') || '0s';
  };

  if (mode === 'join') {
    return (
      <div className="min-h-screen flex flex-col text-white" style={{ background: 'var(--color-background)' }}>
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <p className="text-sm text-center mb-2 opacity-60" style={{ fontStyle: 'italic', fontFamily: 'var(--font-main)' }}>
              title
            </p>
            <h1 className="text-4xl text-center mb-8 uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
              {quizData?.title || 'UNTITLED QUIZ'}
            </h1>

            {quizData?.bannerImage && (
              <div className="w-full h-48 mb-8 rounded-2xl overflow-hidden">
                <img 
                  src={quizData.bannerImage} 
                  alt="Quiz Banner" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-2xl" style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic' }}>
                  Time
                </span>
                <span className="text-2xl" style={{ fontFamily: 'var(--font-main)' }}>
                  {formatDuration()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-2xl" style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic' }}>
                  Starts at
                </span>
                <div className="text-right">
                  <div className="text-base" style={{ fontFamily: 'var(--font-main)' }}>
                    {quizData?.startTime || '00:00'} {quizData?.startTime >= '12:00' ? 'PM' : 'AM'}
                  </div>
                  <div className="text-base" style={{ fontFamily: 'var(--font-main)' }}>
                    {quizData?.startDate ? new Date(quizData.startDate).toLocaleDateString('en-GB', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    }) : 'Not set'}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-2xl" style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic' }}>
                  Code
                </span>
                <span className="text-base" style={{ fontFamily: 'var(--font-main)' }}>
                  #{quizData?.quizCode}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-8">
              <button
                onClick={() => navigate('/home')}
                className="w-32 rounded-full py-4 transition-all"
                style={{ background: 'rgba(255, 255, 255, 0.1)', fontFamily: 'var(--font-main)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                Back
              </button>

              <button
                onClick={handleProceed}
                className="rounded-full px-8 py-4 transition-all"
                style={{ background: 'var(--color-join)', fontFamily: 'var(--font-heading)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1f0450'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-join)'}
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-white" style={{ background: 'var(--color-background)' }}>
      <div className="w-full" style={{ background: '#D9D9D9' }}>
        <div className="max-w-md mx-auto">
          <label 
            htmlFor="banner-upload"
            className="w-full h-48 flex items-center justify-center cursor-pointer transition-all"
            style={{ 
              background: bannerImage ? 'transparent' : 'rgba(90, 132, 255, 0.2)',
              backgroundImage: bannerImage ? `url(${bannerImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!bannerImage && !uploading && (
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p style={{ fontFamily: 'var(--font-main)' }}>Upload Banner Image</p>
              </div>
            )}
            {uploading && <p>Uploading...</p>}
          </label>
          <input
            id="banner-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-6 py-8">
        <div className="w-full max-w-md">
          <div className="rounded-3xl p-6 mb-8" style={{ background: 'var(--color-create)' }}>
            <p className="text-sm text-center mb-2 opacity-60" style={{ fontStyle: 'italic', fontFamily: 'var(--font-main)' }}>
              title
            </p>
            <input
              type="text"
              placeholder="Enter Quiz Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-white text-center text-3xl uppercase outline-none placeholder-white placeholder-opacity-40"
              style={{ fontFamily: 'var(--font-heading)', border: 'none' }}
            />
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-xl mb-2" style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic' }}>
                Time
              </label>
              <div className="flex gap-2 items-center justify-center">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={duration.hours}
                  onChange={(e) => setDuration({ ...duration, hours: parseInt(e.target.value) || 0 })}
                  className="w-20 px-3 py-2 rounded-lg text-center"
                  style={{ background: 'rgba(90, 132, 255, 0.3)', fontFamily: 'var(--font-main)', color: 'white' }}
                  placeholder="00"
                />
                <span>:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={duration.minutes}
                  onChange={(e) => setDuration({ ...duration, minutes: parseInt(e.target.value) || 0 })}
                  className="w-20 px-3 py-2 rounded-lg text-center"
                  style={{ background: 'rgba(90, 132, 255, 0.3)', fontFamily: 'var(--font-main)', color: 'white' }}
                  placeholder="00"
                />
                <span>:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={duration.seconds}
                  onChange={(e) => setDuration({ ...duration, seconds: parseInt(e.target.value) || 0 })}
                  className="w-20 px-3 py-2 rounded-lg text-center"
                  style={{ background: 'rgba(90, 132, 255, 0.3)', fontFamily: 'var(--font-main)', color: 'white' }}
                  placeholder="00"
                />
              </div>
            </div>

            <div>
              <label className="block text-xl mb-2" style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic' }}>
                Starts on
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg"
                style={{ background: 'rgba(90, 132, 255, 0.3)', fontFamily: 'var(--font-main)', color: 'white' }}
              />
            </div>

            <div>
              <label className="block text-xl mb-2" style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic' }}>
                Starts at
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 rounded-lg"
                style={{ background: 'rgba(90, 132, 255, 0.3)', fontFamily: 'var(--font-main)', color: 'white' }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-8">
            <button
              onClick={() => navigate('/home')}
              className="w-32 rounded-full py-4 transition-all"
              style={{ background: 'rgba(255, 255, 255, 0.1)', fontFamily: 'var(--font-main)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              Back
            </button>

            <button
              onClick={handleProceed}
              className="rounded-full px-8 py-4 transition-all"
              style={{ background: 'var(--color-create)', fontFamily: 'var(--font-heading)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#4a74ef'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-create)'}
            >
              Add/Edit Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizFront;