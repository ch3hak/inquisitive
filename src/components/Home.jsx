import React, { useState, useEffect } from 'react';
import Header from "./Header";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [quizCode, setQuizCode] = useState("");
  const navigate = useNavigate();

  const handleJoinQuiz = () => {
    if (!quizCode.trim()) {
      alert("Enter a quiz code");
      return;
    }
    navigate(`/quiz/${quizCode.trim()}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showInput && !e.target.closest('.join-card')) {
        setShowInput(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showInput]);

  return (
    <div className="min-h-screen flex flex-col text-white relative" style={{ background: 'var(--color-background)' }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute -left-20 top-0">
          <svg width="350" height="500" viewBox="0 0 261 376" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <g filter="url(#filter0_f_502_54)">
              <ellipse cx="57.782" cy="187.682" rx="112" ry="75" transform="rotate(33.0969 57.782 187.682)" fill="#29055F"/>
            </g>
            <defs>
              <filter id="filter0_f_502_54" x="-144.62" y="0" width="404.805" height="375.364" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_502_54"/>
              </filter>
            </defs>
          </svg>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 -top-10">
          <svg width="500" height="450" viewBox="0 0 392 356" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <g filter="url(#filter0_f_502_55)">
              <ellipse cx="188.817" cy="177.553" rx="112" ry="63.671" transform="rotate(-28.7201 188.817 177.553)" fill="#5A84FF"/>
            </g>
            <defs>
              <filter id="filter0_f_502_55" x="-14.0865" y="0" width="405.808" height="355.106" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_502_55"/>
              </filter>
            </defs>
          </svg>
        </div>

        <div className="absolute -right-20 top-0">
          <svg width="350" height="480" viewBox="0 0 280 361" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <g filter="url(#filter0_ddf_502_57)">
              <ellipse cx="200.674" cy="180.426" rx="112" ry="63.671" transform="rotate(32.2254 200.674 180.426)" fill="#06007B"/>
            </g>
            <defs>
              <filter id="filter0_ddf_502_57" x="0" y="0" width="401.349" height="360.851" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_502_57"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="effect1_dropShadow_502_57" result="effect2_dropShadow_502_57"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_502_57" result="shape"/>
                <feGaussianBlur stdDeviation="50" result="effect3_foregroundBlur_502_57"/>
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-4 relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-15">
          <h1 className="text-5xl md:text-6xl italic leading-tight" style={{ fontFamily: 'Bodoni72, serif' }}>
            Quizzes, Surveys<br/>& Insights
          </h1>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <div
            className="join-card rounded-3xl overflow-hidden transition-all duration-300 ease-out cursor-pointer relative"
            style={{ 
              background: showInput ? 'var(--color-join-highlight)' : (hoveredCard === 'join' ? 'var(--color-join-highlight)' : 'var(--color-join)'),
              height: showInput ? '160px' : '100px'
            }}
            onClick={() => !showInput && setShowInput(true)}
            onMouseEnter={() => setHoveredCard('join')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute right-0 top-0 opacity-25 pointer-events-none" style={{ transform: 'translateX(30%)', filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5))' }}>
              <svg width="200" height="100" viewBox="0 0 222 111" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M221.497 0.5C221.432 14.8409 218.578 29.0338 213.089 42.2861C207.536 55.6926 199.397 67.8749 189.136 78.1357C178.875 88.3966 166.693 96.5357 153.286 102.089C139.88 107.642 125.511 110.5 111 110.5C96.4891 110.5 82.1202 107.642 68.7139 102.089C55.3074 96.5357 43.1251 88.3966 32.8643 78.1357C22.6034 67.8749 14.4643 55.6926 8.91113 42.2861C3.42188 29.0338 0.567816 14.8409 0.50293 0.5H221.497Z" fill="#37087E"/>
              </svg>
            </div>

            <div className="p-6 h-full flex flex-col justify-between relative z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-4xl" style={{ fontFamily: 'Bodoni72, serif' }}>Join Quiz</h2>
                
                {!showInput && (
                  <button className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-300" style={{
                    transform: hoveredCard === 'join' ? 'rotate(-90deg)' : 'rotate(0deg)',
                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                )}
              </div>
              
              {showInput && (
                <div className="flex items-center gap-3" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <div className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2" style={{ background: 'rgba(255, 255, 255, 0.15)', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' }}>
                    <span className="text-sm opacity-70">#</span>
                    <input
                      type="text"
                      placeholder="Enter Code"
                      value={quizCode}
                      onChange={e => setQuizCode(e.target.value)}
                      className="bg-transparent flex-1 outline-none text-white placeholder-white placeholder-opacity-50"
                      onKeyPress={(e) => e.key === 'Enter' && handleJoinQuiz()}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                    <svg className="w-4 h-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinQuiz();
                    }}
                    className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center transition-all"
                    style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))' }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" style={{ transform: 'rotate(-90deg)' }}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className="rounded-3xl overflow-hidden transition-all duration-300 ease-out cursor-pointer relative"
            style={{ 
              background: hoveredCard === 'create' ? 'var(--color-create-highlight)' : 'var(--color-create)',
              height: '100px'
            }}
            onClick={() => navigate("/create-quiz")}
            onMouseEnter={() => setHoveredCard('create')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" style={{ transform: 'translateY(-50%) translateX(20%)', filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5))' }}>
              <svg width="110" height="75" viewBox="0 0 123 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="28.5166" cy="56.8437" rx="28.5166" ry="28.1562" fill="#789AFF"/>
                <ellipse cx="56.4951" cy="56.8437" rx="28.5166" ry="28.1562" fill="#789AFF"/>
                <ellipse cx="94.1584" cy="56.8437" rx="28.5166" ry="28.1562" fill="#789AFF"/>
                <ellipse cx="43.5819" cy="28.1562" rx="28.5166" ry="28.1562" fill="#789AFF"/>
                <ellipse cx="76.9409" cy="37.7187" rx="28.5166" ry="28.1562" fill="#789AFF"/>
              </svg>
            </div>

            <div className="p-6 h-full flex items-center justify-between relative z-10">
              <h2 className="text-4xl" style={{ fontFamily: 'Bodoni72, serif' }}>Create Quiz</h2>
              <button className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-300" style={{
                transform: hoveredCard === 'create' ? 'rotate(-90deg)' : 'rotate(0deg)',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

          <div
            className="rounded-3xl overflow-hidden transition-all duration-300 ease-out cursor-pointer relative"
            style={{ 
              background: hoveredCard === 'insights' ? 'var(--color-insights-blue)' : 'var(--color-insight)',
              height: '100px'
            }}
            onClick={() => navigate("/insights")}
            onMouseEnter={() => setHoveredCard('insights')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none" style={{ filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5))' }}>
              <svg width="90" height="75" viewBox="0 0 109 91" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M92.5 0H23.5L0 36.5978H58.2639L39.5 68.7446H66.5L58.2639 91L109 54.4022H81.7568L98.5 25.7174H66.5L92.5 0Z" fill="#06034C"/>
              </svg>
            </div>

            <div className="p-6 h-full flex items-center justify-between relative z-10">
              <h2 className="text-4xl" style={{ fontFamily: 'Bodoni72, serif' }}>Get Insights</h2>
              <button className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-300" style={{
                transform: hoveredCard === 'insights' ? 'rotate(-90deg)' : 'rotate(0deg)',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Home;
