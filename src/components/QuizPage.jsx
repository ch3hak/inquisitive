import React, { useState, useEffect } from "react";
import { auth, timestamp, db } from "../utils/firebase";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import QuizFront from "./QuizFront";

const QuizPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [quizMeta, setQuizMeta] = useState(null);
  const [quizId, setQuizId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [titleEdit, setTitleEdit] = useState("");
  const [questionsEdit, setQuestionsEdit] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [hoveredQuestionIndex, setHoveredQuestionIndex] = useState(null);
  const [showQuizFront, setShowQuizFront] = useState(true);
  const [userResponse, setUserResponse] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const loadByCode = async () => {
      setLoading(true);
      try {
        const colRef = collection(db, "quizzes");
        const snap = await getDocs(query(colRef, where("quizCode", "==", code)));

        if (snap.empty) {
          throw new Error("Quiz not found");
        }

        const quizDoc = snap.docs[0];
        const quizData = quizDoc.data();
        setQuizMeta(quizData);
        setQuizId(quizDoc.id);

        // Check if user already attempted
        if (auth.currentUser) {
          const responseDoc = await getDoc(
            doc(db, "quizzes", quizDoc.id, "responses", auth.currentUser.uid)
          );
          if (responseDoc.exists()) {
            setUserResponse(responseDoc.data());
          }
        }

        const qsSnap = await getDocs(collection(db, "quizzes", quizDoc.id, "questions"));
        const qs = qsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setQuestions(qs);

        const init = {};
        qs.forEach((_, idx) => { init[idx] = null; });
        setAnswers(init);

        // Set timer if quiz has duration
        if (quizData.duration) {
          setTimeRemaining(quizData.duration);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadByCode();
  }, [code]);

  // Timer effect
  useEffect(() => {
    if (!timerActive || timeRemaining === null || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          submitQuiz(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFrontProceed = () => {
    setShowQuizFront(false);
    setTimerActive(true); // Start timer when quiz begins
  };

  const handleEdit = () => {
    setTitleEdit(quizMeta.title);
    setQuestionsEdit(questions.map(q => ({ ...q })));
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    await updateDoc(doc(db, "quizzes", quizId), { title: titleEdit });

    await Promise.all(questionsEdit.map(q =>
      updateDoc(doc(db, "quizzes", quizId, "questions", q.id), {
        description: q.description,
        options: q.options,
        correctOption: q.correctOption
      })
    ));

    setEditMode(false);
    setQuizMeta(meta => ({ ...meta, title: titleEdit }));
    setQuestions(questionsEdit);
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this quiz permanently?")) {
      await deleteDoc(doc(db, "quizzes", quizId));
      navigate("/home");
    }
  };

  const toggleAcceptingResponses = async () => {
    const newStatus = !quizMeta.acceptingResponses;
    await updateDoc(doc(db, "quizzes", quizId), { 
      acceptingResponses: newStatus 
    });
    setQuizMeta(meta => ({ ...meta, acceptingResponses: newStatus }));
  };

  const handleViewResponses = () => {
    navigate(`/quiz/${code}/responses`);
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleNavigateQuestion = (direction) => {
    if (questions.length <= 1) return;
    let newIndex = currentQuestionIndex + direction;
    if (newIndex < 0) newIndex = questions.length - 1;
    if (newIndex >= questions.length) newIndex = 0;
    setCurrentQuestionIndex(newIndex);
  };

  const pickAnswer = (qIdx, optIdx) =>
    setAnswers(a => ({ ...a, [qIdx]: optIdx }));

  const submitQuiz = async () => {
    let s = 0;
    const userAnswersWithCorrect = {};
    
    questions.forEach((q, idx) => {
      const isCorrect = answers[idx] === q.correctOption;
      if (isCorrect) s++;
      
      userAnswersWithCorrect[idx] = {
        selectedOption: answers[idx],
        correctOption: q.correctOption,
        isCorrect: isCorrect
      };
    });

    if (auth.currentUser && quizId) {
      await setDoc(
        doc(db, "quizzes", quizId, "responses", auth.currentUser.uid),
        {
          uid: auth.currentUser.uid,
          answers: userAnswersWithCorrect,
          score: s,
          takenAt: timestamp(),
          user: auth.currentUser.displayName || auth.currentUser.email,
        }
      );
    }

    navigate(`/quiz/${code}/score`, {
      state: { score: s, total: questions.length }
    });
  };

  if (loading) return <p className="text-white text-center mt-20 dm-sans-regular">Loading quiz…</p>;
  if (error) return <p className="text-red-500 text-center mt-20 dm-sans-regular">{error}</p>;

  const isOwner = quizMeta.createdBy === auth.currentUser?.uid;
  const allAnswered = questions.length > 0 && Object.values(answers).every(v => v !== null);

  // Show QuizFront for join mode (non-owners)
  if (showQuizFront && !isOwner && !userResponse) {
    const formattedQuizData = {
      ...quizMeta,
      duration: {
        hours: Math.floor(quizMeta.duration / 3600),
        minutes: Math.floor((quizMeta.duration % 3600) / 60),
        seconds: quizMeta.duration % 60
      }
    };
    return <QuizFront mode="join" quizData={formattedQuizData} onProceed={handleFrontProceed} />;
  }

  // Show review mode if user already attempted
  if (userResponse && !isOwner) {
    return (
      <div className="min-h-screen px-6 py-12" style={{ background: 'var(--color-background)' }}>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12 text-white">
            <h1 className="text-4xl mb-3" style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              {quizMeta.title || "Untitled"}
            </h1>
            <p className="text-lg dm-sans-regular mb-2">
              Your Score: {userResponse.score} / {questions.length}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {questions.map((q, index) => {
              const userAnswer = userResponse.answers[index];
              const isCorrect = userAnswer?.isCorrect;
              
              return (
                <div
                  key={q.id}
                  className="rounded-3xl p-5 text-white"
                  style={{
                    background: isCorrect ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
                    border: `2px solid ${isCorrect ? '#4CAF50' : '#F44336'}`
                  }}
                >
                  <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                    Q{index + 1}. {q.description}
                  </h3>
                  
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isUserSelection = userAnswer?.selectedOption === optIdx;
                      const isCorrectOption = q.correctOption === optIdx;
                      
                      return (
                        <div
                          key={optIdx}
                          className="py-3 px-4 rounded-2xl dm-sans-regular"
                          style={{
                            background: isCorrectOption 
                              ? 'rgba(76, 175, 80, 0.5)' 
                              : isUserSelection 
                                ? 'rgba(244, 67, 54, 0.5)'
                                : 'rgba(255, 255, 255, 0.1)',
                            border: isCorrectOption 
                              ? '2px solid #4CAF50'
                              : isUserSelection
                                ? '2px solid #F44336'
                                : 'none'
                          }}
                        >
                          {opt}
                          {isCorrectOption && <span className="ml-2">✓</span>}
                          {isUserSelection && !isCorrectOption && <span className="ml-2">✗</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/joined-quizzes')}
            className="w-full py-5 px-6 rounded-3xl text-xl transition-all text-white"
            style={{ background: 'var(--color-join)', fontFamily: 'var(--font-heading)' }}
          >
            Back to Joined Quizzes
          </button>
        </div>
      </div>
    );
  }

  // Question view for taking quiz
  if (currentQuestionIndex !== null && !userResponse) {
    const q = questions[currentQuestionIndex];
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-join)' }}>
        {/* Timer Display */}
        {timeRemaining !== null && (
          <div className="text-center py-4 text-white text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Time Remaining: {formatTime(timeRemaining)}
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center text-white">
              <h2 className="text-4xl mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Q{currentQuestionIndex + 1}.
              </h2>
              <p className="text-xl dm-sans-regular">
                {q.description}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-5" style={{ background: 'var(--color-background)' }}>
          <div className="w-full max-w-md mx-auto space-y-3 pt-5 pb-5">
            {q.options.map((opt, index) => (
              <button
                key={index}
                onClick={() => pickAnswer(currentQuestionIndex, index)}
                className="w-full py-5 px-6 rounded-3xl text-center text-base dm-sans-regular transition-all"
                style={{
                  background: answers[currentQuestionIndex] === index 
                    ? 'var(--color-create)' 
                    : 'var(--color-join)',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  if (answers[currentQuestionIndex] !== index) {
                    e.target.style.background = 'var(--color-join-highlight)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (answers[currentQuestionIndex] !== index) {
                    e.target.style.background = 'var(--color-join)';
                  }
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => handleNavigateQuestion(-1)}
              disabled={questions.length <= 1}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
              style={{
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.5)'
              }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5m7 7l-7-7 7-7"/>
              </svg>
            </button>

            <button
              onClick={() => setCurrentQuestionIndex(null)}
              className="rounded-full px-3 py-3 transition-all flex items-center justify-center gap-2"
              style={{ background: 'transparent' }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_330_843" style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
                  <rect width="40" height="40" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_330_843)">
                  <path d="M11.5383 31.0893C10.4167 31.0893 9.46319 30.6967 8.67792 29.9114C7.89264 29.1264 7.5 28.1729 7.5 27.051C7.5 25.9293 7.89264 24.9759 8.67792 24.1906C9.46319 23.4053 10.4167 23.0127 11.5383 23.0127C12.6603 23.0127 13.6139 23.4053 14.3992 24.1906C15.1844 24.9759 15.5771 25.9293 15.5771 27.051C15.5771 28.1729 15.1844 29.1264 14.3992 29.9114C13.6139 30.6967 12.6603 31.0893 11.5383 31.0893ZM28.4617 31.0893C27.3397 31.0893 26.3861 30.6967 25.6008 29.9114C24.8156 29.1264 24.4229 28.1729 24.4229 27.051C24.4229 25.9293 24.8156 24.9759 25.6008 24.1906C26.3861 23.4053 27.3397 23.0127 28.4617 23.0127C29.5833 23.0127 30.5368 23.4053 31.3221 24.1906C32.1074 24.9759 32.5 25.9293 32.5 27.051C32.5 28.1729 32.1074 29.1264 31.3221 29.9114C30.5368 30.6967 29.5833 31.0893 28.4617 31.0893ZM20 16.9868C18.8783 16.9868 17.9249 16.5942 17.1396 15.8089C16.3543 15.0236 15.9617 14.0702 15.9617 12.9485C15.9617 11.8265 16.3543 10.8731 17.1396 10.0881C17.9249 9.3028 18.8783 8.91016 20 8.91016C21.1217 8.91016 22.0751 9.3028 22.8604 10.0881C23.6457 10.8731 24.0383 11.8265 24.0383 12.9485C24.0383 14.0702 23.6457 15.0236 22.8604 15.8089C22.0751 16.5942 21.1217 16.9868 20 16.9868Z" fill="#F2F2F2"/>
                </g>
              </svg>
            </button>

            <button
              onClick={() => handleNavigateQuestion(1)}
              disabled={questions.length <= 1}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
              style={{
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.5)'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (editMode) {
    return (
      <div style={{ maxWidth: 600, margin: "2em auto", padding: "1em" }} className="text-white">
        <h2 className="dm-sans-bold">Edit Quiz</h2>
        <input
          value={titleEdit}
          onChange={e => setTitleEdit(e.target.value)}
          style={{ width: "100%", fontSize: "1.2em", marginBottom: "1em" }}
          className="bg-transparent text-white dm-sans-regular"
        />

        {questionsEdit.map((q, idx) => (
          <div key={q.id} style={{ marginBottom: "1em" }}>
            <input
              value={q.description}
              onChange={e => {
                const copy = [...questionsEdit];
                copy[idx].description = e.target.value;
                setQuestionsEdit(copy);
              }}
              style={{ width: "100%", marginBottom: "0.5em" }}
              className="bg-transparent text-white dm-sans-regular"
            />
            {q.options.map((opt, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="radio"
                  checked={q.correctOption === i}
                  onChange={() => {
                    const copy = [...questionsEdit];
                    copy[idx].correctOption = i;
                    setQuestionsEdit(copy);
                  }}
                />
                <input
                  value={opt}
                  onChange={e => {
                    const copy = [...questionsEdit];
                    copy[idx].options[i] = e.target.value;
                    setQuestionsEdit(copy);
                  }}
                  style={{ flex: 1, marginLeft: "0.5em" }}
                  className="bg-transparent text-white dm-sans-regular"
                />
              </div>
            ))}
          </div>
        ))}

        <button onClick={handleSaveEdit} style={{ marginRight: 8 }} className="dm-sans-regular">Save</button>
        <button onClick={() => setEditMode(false)} className="dm-sans-regular">Cancel</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: 'var(--color-background)' }}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12 text-white">
          <p className="text-xs mb-2 dm-sans-italic opacity-60">
            title
          </p>
          <h1 className="text-5xl mb-3" style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            {quizMeta.title || "Untitled"}
          </h1>
          <p className="text-xs dm-sans-italic opacity-80">
            By: {quizMeta.createdName}
          </p>
        </div>

        {isOwner && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: 'rgba(90, 132, 255, 0.2)' }}>
              <span className="dm-sans-regular text-white">
                {quizMeta.acceptingResponses ? 'Accepting Responses' : 'Responses Stopped'}
              </span>
              <button
                onClick={toggleAcceptingResponses}
                className="w-14 h-7 rounded-full relative transition-all"
                style={{ 
                  background: quizMeta.acceptingResponses ? '#4CAF50' : '#F44336'
                }}
              >
                <div
                  className="w-5 h-5 rounded-full bg-white absolute top-1 transition-all"
                  style={{ 
                    left: quizMeta.acceptingResponses ? '32px' : '4px'
                  }}
                />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="flex-1 px-4 py-3 rounded-2xl dm-sans-regular text-white transition-all"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                Edit Quiz
              </button>
              <button
                onClick={handleViewResponses}
                className="flex-1 px-4 py-3 rounded-2xl dm-sans-regular text-white transition-all"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                View Responses
              </button>
            </div>
            
            <button
              onClick={handleDelete}
              className="w-full px-4 py-3 rounded-2xl dm-sans-regular text-white transition-all"
              style={{ background: 'rgba(255, 0, 0, 0.3)' }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 0, 0, 0.4)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 0, 0, 0.3)'}
            >
              Delete Quiz
            </button>
          </div>
        )}

        <div className="space-y-3 mb-6">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="rounded-3xl overflow-hidden transition-all cursor-pointer"
              style={{
                background: hoveredQuestionIndex === index ? 'var(--color-join-highlight)' : 'var(--color-join)',
                height: hoveredQuestionIndex === index ? '120px' : '70px',
                transform: hoveredQuestionIndex === index ? 'scale(1.02)' : 'scale(1)'
              }}
              onMouseEnter={() => setHoveredQuestionIndex(index)}
              onMouseLeave={() => setHoveredQuestionIndex(null)}
              onClick={() => !userResponse && handleQuestionClick(index)}
            >
              <div className="h-full p-5 flex items-center justify-between gap-3 text-white">
                <div className="flex-1">
                  <h3 className="text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
                    Q{index + 1}.
                  </h3>
                  {hoveredQuestionIndex === index && (
                    <p className="text-sm mt-2 dm-sans-regular" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                      {q.description}
                    </p>
                  )}
                </div>

                <button className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-300">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className="w-6 h-6 transition-transform duration-300"
                    style={{ transform: hoveredQuestionIndex === index ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {!isOwner && !userResponse && !quizMeta.acceptingResponses && (
          <div className="text-center text-red-400 mb-4 dm-sans-regular">
            This quiz is not currently accepting responses.
          </div>
        )}

        {!isOwner && !userResponse && quizMeta.acceptingResponses && (
          <button
            onClick={submitQuiz}
            disabled={!allAnswered}
            className="w-full py-5 px-6 rounded-3xl text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
            style={{
              background: allAnswered ? 'var(--color-join)' : 'rgba(41, 5, 95, 0.5)',
              fontFamily: 'var(--font-heading)'
            }}
            onMouseEnter={(e) => {
              if (allAnswered) e.target.style.background = 'var(--color-join-highlight)';
            }}
            onMouseLeave={(e) => {
              if (allAnswered) e.target.style.background = 'var(--color-join)';
            }}
          >
            Submit Quiz
          </button>
        )}
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
      `}</style>
    </div>
  );
};

export default QuizPage;