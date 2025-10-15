import React, { useState } from 'react';
import Header from "./Header";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [quizCode, setQuizCode] = useState("");
  const navigate = useNavigate();


  const handleJoinQuiz = () => {
    if (!quizCode.trim()) {
      alert("Enter a quiz code");
      return;
    }
    navigate(`/quiz/${quizCode.trim()}`);
  };

  return (
    <div className="min-h-screen text-white font-sans" style={{ background: '#191023' }}>
      <Header />

      <div 
        className="text-center mt-12 mb-16 relative"
        
      >
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-blue-500 rounded-full opacity-30 blur-3xl" style={{ filter: 'blur(120px)' }}/>
        </div> */}
        <h1 className="relative px-6 text-5xl md:text-6xl italic tracking-wide" style={{ fontFamily: 'Bodoni72, serif' }}>
          Quizzes, Surveys & Insights<br/>
        </h1>
      </div>

      <div className="flex flex-col gap-3 max-w-md mx-auto px-2 h-[calc(100vh-120px)]">
        <div
          className="rounded-3xl py-3 overflow-hidden transition-all duration-300 ease-out"
          style={{ 
            background: '#29055F',
            height: hoveredCard === 'join' ? '280px' : '140px'
          }}
          onMouseEnter={() => setHoveredCard('join')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl" style={{ fontFamily: 'Bodoni72, serif' }}>Join Quiz</h2>
              <button className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-300">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="w-6 h-6 transition-transform duration-300"
                  style={{ transform: hoveredCard === 'join' ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            {hoveredCard === 'join' && (
              <div className="mt-auto space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <div className="flex items-center rounded-2xl px-4 py-3" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                  <span className="text-sm mr-2">#</span>
                  <input
                    type="text"
                    placeholder="Enter Code"
                    value={quizCode}
                    onChange={e => setQuizCode(e.target.value)}
                    className="bg-transparent flex-1 outline-none text-white"
                    style={{ 
                      '::placeholder': { color: 'rgba(255, 255, 255, 0.6)' }
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleJoinQuiz()}
                  />
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <button 
                  onClick={handleJoinQuiz}
                  className="w-full rounded-2xl py-3 transition-all"
                  style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                >
                  Join Quiz
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          className="rounded-3xl py-3 overflow-hidden transition-all duration-300 ease-out cursor-pointer"
          style={{ 
            background: '#5A84FF',
            height: hoveredCard === 'create' ? '200px' : '140px'
          }}
          onMouseEnter={() => setHoveredCard('create')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => navigate("/create-quiz")}
        >
          <div className="p-8 h-full flex flex-col relative">
            
            <div className="flex justify-between items-center">
              <h2 className="text-4xl" style={{ fontFamily: 'Bodoni72, serif' }}>Create Quiz</h2>
              <button className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-300">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="w-6 h-6 transition-transform duration-300"
                  style={{ transform: hoveredCard === 'create' ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            {/* {hoveredCard === 'create' && (
              <p className="mt-auto text-lg opacity-90" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                Your Quiz is always a<br/>click away
              </p>
            )} */}
          </div>
        </div>

        <div
          className="rounded-3xl py-3 overflow-hidden transition-all duration-300 ease-out cursor-pointer"
          style={{ 
            background: '#06034C',
            height: hoveredCard === 'insights' ? '200px' : '140px'
          }}
          onMouseEnter={() => setHoveredCard('insights')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => navigate("/insights")}
        >
          <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl" style={{ fontFamily: 'Bodoni72, serif' }}>Get Insights</h2>
              <button className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-300">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="w-6 h-6 transition-transform duration-300"
                  style={{ transform: hoveredCard === 'insights' ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                >
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
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default Home;