import React, { useState } from 'react';
import Header from './Header';

const QuizFront = ({ mode, onProceed, quizData }) => {
  const [title, setTitle] = useState(quizData?.title || '');
  const [bannerImage, setBannerImage] = useState(quizData?.bannerImage || null);
  const [duration, setDuration] = useState(
    quizData?.duration || { hours: 0, minutes: 0, seconds: 0 }
  );
  const [startDate, setStartDate] = useState(quizData?.startDate || '');
  const [startTime, setStartTime] = useState(quizData?.startTime || '00:00');

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleProceed = () => {
    if (mode === 'create' && !title.trim()) {
      alert('Please enter a quiz title');
      return;
    }

    onProceed({
      title: title.trim(),
      bannerImage,
      duration,
      startDate,
      startTime
    });
  };

  if (mode === 'join') {
    const formatDuration = (duration) => {
      if (!duration) return '00:00:00';
      const hrs = duration.hours || 0;
      const mins = duration.minutes || 0;
      const secs = duration.seconds || 0;
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
  
    const formatDateTime = () => {
      if (!quizData?.startDate || !quizData?.startTime) {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        return { time, date: dateStr };
      }
      
      const time = quizData.startTime;
      const date = new Date(quizData.startDate);
      const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      return { time, date: dateStr };
    };
  
    const { time: startTime, date: startDate } = formatDateTime();
  
    return (
      <div className="h-screen flex flex-col overflow-hidden" style={{ background:  'var(--color-background)'  }}>
        <Header />
        
        {quizData?.bannerImage && (
          <div className="w-full mt-4 h-30 flex-shrink-0 relative" style={{ background: bannerImage ? 'transparent' : '#CCC'}}>
            <img 
              src={quizData.bannerImage} 
              alt="Quiz Banner" 
              className="w-full h-full object-cover"
              style={{ opacity: 0.6 }}
            />
          </div>
        )}
        
        <div className="flex-1 flex flex-col px-6 py-6 overflow-hidden">
          <div className="text-center text-white mb-6">
            <p className="text-sm dm-sans-italic text-white opacity-80">
              title
            </p>
            <h1 
              className="text-5xl leading-tight uppercase font-semibold"
              style={{ 
                fontFamily: '(--font-main)',
                letterSpacing: '0.05em',
                lineHeight: '1.2'
              }}
            >
              {quizData?.title || 'Untitled'}
            </h1>
            <p className="text-sm dm-sans-italic mb-5" style={{ color: 'rgba(255,255,255,0.8)' }}>
              By: {quizData?.createdName || ''}
            </p>
          </div>
  
          <div className="space-y-8 mb-16 text-white">
            <div className="flex justify-between items-baseline">
              <p className="text-2xl dm-sans-italic text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Time
              </p>
              <p className="text-xl" style={{ fontFamily: 'var(--font-main)' }}>
                {formatDuration(quizData?.duration)}
              </p>
            </div>
  
            <div className="flex justify-between items-start">
              <p className="dm-sans-italic text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
                Starts at
              </p>
              <div className="text-right">
                <div className="text-xl" style={{ fontFamily: 'var(--font-main)' }}>{startTime}</div>
                <div className="text-base" style={{ fontFamily: 'var(--font-main)', color: 'rgba(255,255,255,0.7)' }}>
                  {startDate}
                </div>
              </div>
            </div>
  
            <div className="flex justify-between items-baseline">
              <p className="text-2xl" style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic' }}>
                Code
              </p>
              <p className="text-xl" style={{ fontFamily: 'var(--font-main)' }}>
                #{quizData?.quizCode || '5SUMI23'}
              </p>
            </div>
          </div>
  
          <div className="mt-auto flex gap-4 pb-4">
            <button
              onClick={() => window.history.back()}
              className="flex-1 px-2 py-2 rounded-full transition-all"
              style={{ 
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: 'none'
              }}
            >
              Back
            </button>
            <button
              onClick={handleProceed}
              className="flex-1 px-2 py-2 rounded-full transition-all text-white"
              style={{ 
                background: '#5A2D8C',
                color: 'white',
                border: 'none'
              }}
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }
  // Create mode
  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--color-background)' }}>
      <Header />
      
      <div className="w-full mt-4 h-30 flex-shrink-0 relative" style={{ background: bannerImage ? 'transparent' : '#CCC' }}>
        {bannerImage ? (
          <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <label className="w-full h-full flex items-center justify-center cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="absolute top-4 right-4 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
          </label>
        )}
      </div>
      
      <div className="flex-1 flex flex-col px-6 py-6 overflow-hidden">
        <div className="max-w-md mx-auto w-full flex flex-col h-full">
          <div className="mb-6">
            <p className="text-sm dm-sans-italic text-white opacity-80 mb-4">title</p>
            <div 
              className="rounded-3xl px-6 py-7 mb-3"
              style={{ background: 'var(--color-create)' }}
            >
              <input
                type="text"
                placeholder="Enter Quiz Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-white text-center text-3xl outline-none placeholder-white"
                style={{ 
                  fontFamily: 'var(--font-main)',
                  fontStyle: 'bold',
                  opacity: title ? 1 : 0.8
                }}
              />
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <p className="text-2xl dm-sans-italic text-white" style={{ fontFamily: 'var(--font-heading)' }}>Time</p>
            <div className="flex gap-1">
              <input
                type="number"
                min="0"
                max="999"
                value={duration.hours || ''}
                onChange={(e) => setDuration({ ...duration, hours: parseInt(e.target.value) || 0 })}
                className="w-16 px-2 py-2 rounded-lg text-center text-white text-lg outline-none dm-sans-regular"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)' 
                }}
                placeholder="00"
              />
              <input
                type="number"
                min="0"
                max="59"
                value={duration.minutes || ''}
                onChange={(e) => setDuration({ ...duration, minutes: parseInt(e.target.value) || 0 })}
                className="w-16 px-2 py-2 rounded-lg text-center text-white text-lg outline-none dm-sans-regular"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)' 
                }}
                placeholder="00"
              />
              <input
                type="number"
                min="0"
                max="59"
                value={duration.seconds || ''}
                onChange={(e) => setDuration({ ...duration, seconds: parseInt(e.target.value) || 0 })}
                className="w-16 px-2 py-2 rounded-lg text-center text-white text-lg outline-none dm-sans-regular"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)' 
                }}
                placeholder="00"
              />
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <p className="text-2xl dm-sans-italic text-white" style={{ fontFamily: 'var(--font-heading)' }}>Starts on</p>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 rounded-lg text-white text-center dm-sans-regular outline-none"
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255, 255, 255, 0.2)',
                colorScheme: 'dark',
                width: '200px'
              }}
            />
          </div>

          <div className="mb-8 flex items-center justify-between">
            <p className="text-2xl dm-sans-italic text-white" style={{ fontFamily: 'var(--font-heading)' }}>Starts at</p>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="px-4 py-2 rounded-lg text-white text-center dm-sans-regular outline-none"
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255, 255, 255, 0.2)',
                colorScheme: 'dark',
                width: '200px'
              }}
            />
          </div>

          <div className="mt-auto flex gap-4 pb-4">
            <button
              onClick={() => window.history.back()}
              className="flex-1 px-2 py-2 rounded-full transition-all"
              style={{ 
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'white',
                fontFamily: 'var(--font-main)'
              }}
            >
              Back
            </button>
            <button
              onClick={handleProceed}
              className="flex-1 px-2 py-2 rounded-full transition-all text-white"
              style={{ 
                background: 'var(--color-create)',
                fontFamily: 'var(--font-main)'
              }}
            >
              Add/Edit Question
            </button>
          </div>
        </div>
      </div>

      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          opacity: 0.5;
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.4;
        }
      `}</style>
    </div>
  );
};

export default QuizFront;
