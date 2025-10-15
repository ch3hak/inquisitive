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
              // status: quizData.published ? "Published" : "Draft",
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
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col relative overflow-hidden">
      <Header />

      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(90, 132, 255, 0.25) 0%, transparent 70%)",
          filter: "blur(100px)"
        }}
      />

      <div className="max-w-[600px] mx-auto px-4 py-8 relative z-10 w-full">
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
          {createdQuizzes.map(({ id, title, quizCode, hashtag, status, takenBy }) => (
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
                <p className="text-sm text-white/70 mb-2 italic"
                  style={{ fontFamily: "var(--font-main)" }}>
                  {status}
                </p>
                <p className="text-base text-main my-1 font-semibold"
                  style={{ fontFamily: "var(--font-main)" }}>
                  #{quizCode}
                </p>
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
                    transform: hoveredCard === id ? "rotate(-45deg)" : "rotate(0deg)"
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