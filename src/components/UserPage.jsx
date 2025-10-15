import React, { useState, useEffect } from "react";
import { auth, db } from "../utils/firebase";
import { collection, collectionGroup, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header";

const UserPage = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const [quizCode, setQuizCode] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [attemptedQuizzes, setAttemptedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleJoinQuiz = () => {
    if (!quizCode.trim()) {
      alert("Enter a quiz code");
      return;
    }
    navigate(`/quiz/${quizCode.trim()}`);
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const loadUserData = async () => {
      try {
        const uid = user.uid;

        const createdQuizSnap = await getDocs(query(collection(db, "quizzes"), where("createdBy", "==", uid)));
        const createdQuizList = createdQuizSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCreatedQuizzes(createdQuizList);

        const attemptedSnap = await getDocs(query(collectionGroup(db, "responses"), where("uid", "==", uid)));
        const attemptedList = [];
        for (let respDoc of attemptedSnap.docs) {
          const quizId = respDoc.ref.parent.parent.id;
          const quizMeta = await getDoc(doc(db, "quizzes", quizId));
          attemptedList.push({
            quizId,
            quizTitle: quizMeta.exists() ? quizMeta.data().title : "Deleted Quiz",
            score: respDoc.data().score
          });
        }
        setAttemptedQuizzes(attemptedList);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white dm-sans-regular" style={{ background: '#191023' }}>
        Loading your dashboard…
      </div>
    );
  }

  console.log("Redux User:", user);
  console.log("Auth User:", auth.currentUser);

  return (
    <div className="min-h-screen text-white" style={{ background: '#191023' }}>
      <Header/>
      
      <div className="flex flex-col items-center mt-8 px-6">
        <div className="w-56 h-56 rounded-full bg-gray-300 mb-8 overflow-hidden flex items-center justify-center">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-6xl text-gray-500">👤</div>
          )}
        </div>

        <div className="w-full max-w-md space-y-3 mb-12 dm-sans-regular">
          <div className="flex justify-between items-baseline">
            <span className="italic text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Username</span>
            <span className="text-white text-right text-base">{user?.displayName || "User"}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="italic text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Name</span>
            <span className="text-white text-right text-base">{user?.displayName || "User"}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="italic text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Email ID</span>
            <span className="text-white text-right text-sm break-all">{user?.email}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-w-md mx-auto px-2">
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
    </div>
  );
};

export default UserPage;