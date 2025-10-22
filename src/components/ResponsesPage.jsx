import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../utils/firebase";
import Header from "./Header";

const ResponsesPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredResponse, setHoveredResponse] = useState(null);

  useEffect(() => {
    const loadResponses = async () => {
      setLoading(true);
      try {
        const colRef = collection(db, "quizzes");
        const snap = await getDocs(query(colRef, where("quizCode", "==", code)));
        if (snap.empty) throw new Error("Quiz not found");
        
        const quizDoc = snap.docs[0];
        setQuizTitle(quizDoc.data().title);

        const respSnap = await getDocs(collection(db, "quizzes", quizDoc.id, "responses"));
        setResponses(respSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadResponses();
  }, [code]);

  if (loading) return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />
      <div className="flex items-center justify-center h-screen">
        <p className="text-white dm-sans-regular">Loading responses…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />
      
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-5xl text-center text-white mb-12" style={{ fontFamily: 'var(--font-heading)' }}>
          View Responses
        </h1>

        {responses.length === 0 ? (
          <div className="text-center text-white dm-sans-regular opacity-70">
            No responses yet
          </div>
        ) : (
          <div className="space-y-4">
            {responses.map((r) => (
              <div
                key={r.id}
                className="rounded-3xl overflow-hidden cursor-pointer transition-all"
                style={{
                  background: 'var(--color-insights-blue)',
                  height: hoveredResponse === r.id ? '160px' : '100px',
                  transform: hoveredResponse === r.id ? 'scale(1.02)' : 'scale(1)'
                }}
                onMouseEnter={() => setHoveredResponse(r.id)}
                onMouseLeave={() => setHoveredResponse(null)}
              >
                <div className="h-full p-6 flex items-center justify-between text-white">
                  <div className="flex-1">
                    <h3 className="text-2xl mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                      {r.user || 'Anonymous'}
                    </h3>
                    <p className="text-sm opacity-70 dm-sans-regular mb-1">
                      ID: {r.id.slice(0, 12)}...
                    </p>
                    {hoveredResponse === r.id && (
                      <p className="text-base dm-sans-regular mt-2" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                        Scored: {r.score}/{responses.length > 0 ? Object.keys(r.answers || {}).length : 0}
                      </p>
                    )}
                  </div>
                  
                  <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-300" style={{
                    transform: hoveredResponse === r.id ? 'rotate(-90deg)' : 'rotate(0deg)'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate(`/quiz/${code}`)}
          className="w-full mt-8 py-4 px-6 rounded-3xl text-xl transition-all text-white"
          style={{ background: 'rgba(255, 255, 255, 0.1)', fontFamily: 'var(--font-heading)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        >
          Back to Quiz
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ResponsesPage;