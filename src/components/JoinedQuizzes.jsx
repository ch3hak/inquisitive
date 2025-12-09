import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collectionGroup, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header";

const JoinedQuizzes = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const [attemptedQuizzes, setAttemptedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (!user) return;

    const loadAttemptedQuizzes = async () => {
      try {
        const uid = user.uid;
        const attemptedSnap = await getDocs(
          query(collectionGroup(db, "responses"), where("uid", "==", uid))
        );
        
        const attemptedList = [];
        for (let respDoc of attemptedSnap.docs) {
          const quizId = respDoc.ref.parent.parent.id;
          const quizMeta = await getDoc(doc(db, "quizzes", quizId));
          
          if (quizMeta.exists()) {
            const quizData = quizMeta.data();
            attemptedList.push({
              quizId,
              quizTitle: quizData.title || "Untitled Quiz",
              quizCode: quizData.quizCode,
              createdBy: quizData.createdByName || "Unknown",
              score: respDoc.data().score,
              hashtag: quizData.hashtag || quizData.subject || "GENERAL",
              attemptedAt: respDoc.data().takenAt || respDoc.data().createdAt || 0,
              docId: respDoc.id
            });
          }
        }
        
        attemptedList.sort((a, b) => {
          if (typeof a.attemptedAt === 'object' && a.attemptedAt?.seconds) {
            return b.attemptedAt.seconds - a.attemptedAt.seconds;
          }
          return b.attemptedAt - a.attemptedAt;
        });

        setAttemptedQuizzes(attemptedList);
      } catch (error) {
        console.error("Error loading attempted quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAttemptedQuizzes();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col overflow-x-hidden">
        <Header />
        <div className="flex-1 flex items-center justify-center text-main">
          <p style={{ fontFamily: "var(--font-main)" }}>Loading your joined quizzes...</p>
        </div>
      </div>
    );
  }

  if (attemptedQuizzes.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-main text-center p-8">
          <h2 className="text-3xl mb-2 font-normal"
            style={{ fontFamily: "var(--font-heading)" }}>
            No Joined Quizzes Yet
          </h2>
          <p className="opacity-70" style={{ fontFamily: "var(--font-main)" }}>
            Start taking quizzes to see them here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(41, 5, 95, 0.3) 0%, transparent 70%)",
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
              fill="var(--color-join)"
            />
          </svg>
          <h1 className="text-5xl text-main m-0 font-normal"
            style={{ fontFamily: "var(--font-heading)" }}>
            Joined Quizzes
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          {attemptedQuizzes.map(({ quizId, quizTitle, quizCode, createdBy, score, hashtag }) => (
            <div
              key={quizId}
              className="bg-primary rounded-xl p-6 flex justify-between items-center cursor-pointer transition-transform duration-300 ease-out relative"
              style={{
                transform: hoveredCard === quizId ? "scale(1.03)" : "scale(1)"
              }}
              onClick={() => quizCode && navigate(`/quiz/${quizCode}`)}
              onMouseEnter={() => setHoveredCard(quizId)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex-1">
                <h3 className="text-2xl text-main mb-1 font-normal"
                  style={{ fontFamily: "var(--font-heading)" }}>
                  {quizTitle}
                </h3>
                <p className="text-sm text-white/70 mb-2 italic"
                  style={{ fontFamily: "var(--font-main)" }}>
                  By - {createdBy}
                </p>
                <p className="text-base text-main my-1 font-semibold"
                  style={{ fontFamily: "var(--font-main)" }}>
                  #{quizCode}
                </p>
                <p className="text-base text-main mt-2"
                  style={{ fontFamily: "var(--font-main)" }}>
                  Scored : <span className="font-semibold">{score}</span>
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
                    transform: hoveredCard === quizId ? "rotate(-90deg)" : "rotate(0deg)"
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

export default JoinedQuizzes;