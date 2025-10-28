import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header";

const CreatedQuizzes = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    if (!user) return;

    const loadCreatedQuizzes = async () => {
      try {
        const uid = user.uid;
        const createdQuizSnap = await getDocs(
          query(collection(db, "quizzes"), where("createdBy", "==", uid))
        );
        
        const createdQuizList = await Promise.all(
          createdQuizSnap.docs.map(async (quizDoc) => {
            const quizData = quizDoc.data();
            
            const responsesSnap = await getDocs(
              collection(db, "quizzes", quizDoc.id, "responses")
            );
            const uniqueUsers = new Set(
              responsesSnap.docs.map(doc => doc.data().uid)
            );
            
            return {
              id: quizDoc.id,
              title: quizData.title || "Untitled Quiz",
              quizCode: quizData.quizCode,
              hashtag: quizData.hashtag || quizData.subject || "GENERAL",
              acceptingResponses: quizData.acceptingResponses ?? true,
              takenBy: uniqueUsers.size
            };
          })
        );
        
        setCreatedQuizzes(createdQuizList);
      } catch (error) {
        console.error("Error loading created quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCreatedQuizzes();
  }, [user]);

  const handleCopyCode = async (e, quizCode) => {
    e.stopPropagation(); 
    
    try {
      await navigator.clipboard.writeText(quizCode);
      setCopiedCode(quizCode);
      
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      const textArea = document.createElement('textarea');
      textArea.value = quizCode;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedCode(quizCode);
        setTimeout(() => setCopiedCode(null), 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-main">
          <p style={{ fontFamily: "var(--font-main)" }}>Loading your created quizzes...</p>
        </div>
      </div>
    );
  }

  if (createdQuizzes.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-main text-center p-8">
          <h2 className="text-3xl mb-2 font-normal"
            style={{ fontFamily: "var(--font-heading)" }}>
            No Created Quizzes Yet
          </h2>
          <p className="opacity-70" style={{ fontFamily: "var(--font-main)" }}>
            Create your first quiz to see it here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] ">
      <Header />
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(90, 132, 255, 0.25) 0%, transparent 70%)",
          filter: "blur(100px)"
        }}
      />

      <div className="max-w-[600px] mx-auto px-4 pb-8 relative z-10 w-full">
        <div className="flex items-center gap-4 mb-8">
          <svg 
            width="60" 
            height="80" 
            viewBox="0 0 60 80" 
            fill="none"
            className="flex-shrink-0"
          >
            <path 
              d="M0 0 L60 0 L30 40 L45 40 L0 80 L20 45 L0 45 Z" 
              fill="#5A84FF"
            />
          </svg>
          <h1 className="text-5xl text-main m-0 font-normal"
            style={{ fontFamily: "var(--font-heading)" }}>
            Created Quizzes
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          {createdQuizzes.map(({ id, title, quizCode, hashtag, acceptingResponses, takenBy }) => (
            <div
              key={id}
              className="bg-accent rounded-xl p-6 flex justify-between items-center cursor-pointer transition-transform duration-300 ease-out relative"
              style={{
                transform: hoveredCard === id ? "scale(1.03)" : "scale(1)"
              }}
              onClick={() => quizCode && navigate(`/quiz/${quizCode}`)}
              onMouseEnter={() => setHoveredCard(id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex-1">
                <h3 className="text-2xl text-main mb-1 font-normal"
                  style={{ fontFamily: "var(--font-heading)" }}>
                  {title}
                </h3>
                <div className="flex justify-center gap-2 mb-2">
                  <p className= "text-sm text-white/70 italic"
                    style={{ fontFamily: "var(--font-main)" }}>
                    {acceptingResponses ? 'Accepting Responses' : 'Stopped'}
                  </p>
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ background: acceptingResponses ? '#4CAF50' : '#F44336' }}
                  />
                </div>
                
                <div 
                  className="inline-flex items-center gap-2 group cursor-pointer px-3 py-1 rounded-lg transition-all"
                  style={{ 
                    fontFamily: "var(--font-main)",
                    background: copiedCode === quizCode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)'
                  }}
                  onClick={(e) => handleCopyCode(e, quizCode)}
                  onTouchStart={(e) => {
                    const timer = setTimeout(() => {
                      handleCopyCode(e, quizCode);
                    }, 500);
                    e.currentTarget.dataset.timer = timer;
                  }}
                  onTouchEnd={(e) => {
                    clearTimeout(e.currentTarget.dataset.timer);
                  }}
                  title="Click to copy quiz code"
                >
                  <span className="text-base text-main font-semibold">
                    #{quizCode}
                  </span>
                  {copiedCode === quizCode ? (
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#4CAF50" 
                      strokeWidth="2.5"
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </div>

                <p className="text-base text-main mt-2"
                  style={{ fontFamily: "var(--font-main)" }}>
                  Quiz Taken By : <span className="font-semibold">{takenBy}</span>
                </p>
              </div>

              <div className="w-[50px] h-[50px] rounded-full border-2 border-white flex items-center justify-center flex-shrink-0 ml-4">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="transition-transform duration-300 ease-out"
                  style={{
                    transform: hoveredCard === id ? "rotate(-90deg)" : "rotate(0deg)"
                  }}
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatedQuizzes;