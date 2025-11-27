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
import Header from "./Header";

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
  const [editQuestionIndex, setEditQuestionIndex] = useState(null);
  const [titleEdit, setTitleEdit] = useState("");
  const [questionsEdit, setQuestionsEdit] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(null); // Changed from hoveredQuestionIndex
  const [hoveredOwnerCard, setHoveredOwnerCard] = useState(null);
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

        if (snap.empty) throw new Error("Quiz not found");

        const quizDoc = snap.docs[0];
        const quizData = quizDoc.data();
        setQuizMeta(quizData);
        setQuizId(quizDoc.id);

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

  useEffect(() => {
    if (!timerActive || timeRemaining === null || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          submitQuiz();
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
    setTimerActive(true);
  };

  const handleEdit = () => {
    setTitleEdit(quizMeta.title);
    setQuestionsEdit(questions.map(q => ({ ...q })));
    setEditMode(true);
    setEditQuestionIndex(null);
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
    setEditQuestionIndex(null);
    setQuizMeta(meta => ({ ...meta, title: titleEdit }));
    setQuestions(questionsEdit);
  };

  const handleDeleteQuestion = (index) => {
    if (window.confirm("Delete this question?")) {
      const updatedQuestions = questionsEdit.filter((_, i) => i !== index);
      setQuestionsEdit(updatedQuestions);
      setExpandedQuestionIndex(null);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this quiz permanently?")) {
      await deleteDoc(doc(db, "quizzes", quizId));
      navigate("/home");
    }
  };

  const toggleAcceptingResponses = async () => {
    const newStatus = !quizMeta.acceptingResponses;
    await updateDoc(doc(db, "quizzes", quizId), { acceptingResponses: newStatus });
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

  const handleNavigateEditQuestion = (direction) => {
    if (questionsEdit.length <= 1) return;
    let newIndex = editQuestionIndex + direction;
    if (newIndex < 0) newIndex = questionsEdit.length - 1;
    if (newIndex >= questionsEdit.length) newIndex = 0;
    setEditQuestionIndex(newIndex);
  };

  const handleCardClick = (index) => {
    if (expandedQuestionIndex === index) {
      if (editMode) {
        setEditQuestionIndex(index);
      } else {
        handleQuestionClick(index);
      }
    } else {
      setExpandedQuestionIndex(index);
    }
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
    

      const timeTakenInSeconds = quizMeta.duration ? (quizMeta.duration - timeRemaining) : 0;
      const answeredCount = Object.values(answers).filter(a => a !== null).length;
    
      if (auth.currentUser && quizId) {
        await setDoc(
          doc(db, "quizzes", quizId, "responses", auth.currentUser.uid),
          {
            uid: auth.currentUser.uid,
            answers: userAnswersWithCorrect,
            score: s,
            takenAt: timestamp(),
            timeTaken: timeTakenInSeconds,
            user: auth.currentUser.displayName || auth.currentUser.email,
          }
        );
      }
    
      navigate(`/quiz/${code}/score`, {
        state: { 
          score: s, 
          total: questions.length,
          quizTitle: quizMeta.title,
          bannerImage: quizMeta.bannerImage,
          timeTaken: timeTakenInSeconds,
          startedAt: new Date().toISOString(),
          quizCode: code,
          answeredCount: answeredCount
        }
      });
    };

  if (loading) return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />
      <p className="text-white text-center mt-20 dm-sans-regular">Loading quiz…</p>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />
      <p className="text-red-500 text-center mt-20 dm-sans-regular">{error}</p>
    </div>
  );

  const isOwner = quizMeta.createdBy === auth.currentUser?.uid;
  const allAnswered = questions.length > 0 && Object.values(answers).every(v => v !== null);

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

  //edit mode
  if (editMode && editQuestionIndex === null) {
    return (
      <div className="min-h-screen text-white" style={{ background: 'var(--color-background)', fontFamily: 'var(--font-main)' }}>
        <Header />
        
        <div 
          className="max-w-md mx-auto px-4 py-8"
          onClick={(e) => {
            if (!e.target.closest('.question-card')) {
              setExpandedQuestionIndex(null);
            }
          }}
        >
          <div className="text-center mb-12">
            <p className="text-sm mb-2 opacity-60" style={{ fontStyle: 'italic' }}>
              title
            </p>
            <input
              value={titleEdit}
              onChange={(e) => setTitleEdit(e.target.value)}
              className="w-full bg-transparent text-white text-center text-5xl uppercase mb-6 outline-none font-semibold"
              style={{ fontFamily: 'var(--font-main)', fontStyle:'bold' }}
              placeholder="Quiz Title"
            />
          </div>

          <div className="space-y-3 mb-4">
            {questionsEdit.map((q, index) => (
              <div
                key={q.id}
                className="question-card rounded-3xl overflow-hidden transition-all cursor-pointer"
                style={{ 
                  background: 'var(--color-create)',
                  height: expandedQuestionIndex === index ? '100px' : '70px'
                }}
                onClick={() => handleCardClick(index)}
              >
                <div className="h-full p-4 flex items-center justify-between gap-3">
                  {expandedQuestionIndex === index && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteQuestion(index);
                      }}
                      className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0 transition-all"
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.2)',
                        animation: 'fadeIn 0.3s ease-out'
                      }}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14"/>
                      </svg>
                    </button>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
                      Q{index + 1}.
                    </h3>
                    {expandedQuestionIndex === index && (
                      <p className="text-sm mt-1 opacity-90 truncate" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                        {q.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '2px solid white'
                    }}
                  >
                    <svg 
                      className="w-6 h-6 transition-transform duration-300" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      style={{ transform: expandedQuestionIndex === index ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveEdit}
            className="w-full rounded-3xl py-4 transition-all text-2xl cursor-pointer"
            style={{ background: 'var(--color-create)', fontFamily: 'var(--font-heading)' }}
          >
            Save Changes
          </button>

          <button
            onClick={() => {
              setEditMode(false);
              setEditQuestionIndex(null);
            }}
            className="w-full mt-4 rounded-3xl p-4 transition-all text-xl cursor-pointer"
            style={{ fontFamily: 'var(--font-heading)', background: 'rgba(255, 255, 255, 0.1)' }}
          >
            Cancel
          </button>
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
  }

  //edit mode ques view
  if (editMode && editQuestionIndex !== null) {
    const q = questionsEdit[editQuestionIndex];
    
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-create)' }}>
        <Header />
        
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center text-white">
              <h2 className="text-4xl mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Q{editQuestionIndex + 1}.
              </h2>
              
              <input
                type="text"
                value={q.description}
                onChange={(e) => {
                  const copy = [...questionsEdit];
                  copy[editQuestionIndex].description = e.target.value;
                  setQuestionsEdit(copy);
                }}
                className="w-full bg-transparent text-white text-center text-xl dm-sans-regular px-4 py-3 rounded-md outline-none placeholder-white placeholder-opacity-60"
                placeholder="Enter question..."
              />
            </div>
          </div>
        </div>

        <div className="px-6 pb-6" style={{ background: 'var(--color-background)' }}>
          <div className="w-full max-w-md mx-auto space-y-3 pt-5 pb-5">
            {q.options.map((opt, index) => (
              <div
                key={index}
                className="flex items-center gap-3"
              >
                <input
                  type="radio"
                  checked={q.correctOption === index}
                  onChange={() => {
                    const copy = [...questionsEdit];
                    copy[editQuestionIndex].correctOption = index;
                    setQuestionsEdit(copy);
                  }}
                  className="w-5 h-5"
                />
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const copy = [...questionsEdit];
                    copy[editQuestionIndex].options[index] = e.target.value;
                    setQuestionsEdit(copy);
                  }}
                  className="flex-1 py-4 px-5 rounded-3xl dm-sans-regular outline-none text-white"
                  style={{ background: 'var(--color-join)' }}
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => handleNavigateEditQuestion(-1)}
              disabled={questionsEdit.length <= 1}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-30"
              style={{
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.5)'
              }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5m7 7l-7-7 7-7"/>
              </svg>
            </button>

            <button onClick={() => setEditQuestionIndex(null)}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_633_89" style={{maskType: "alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
                <rect width="40" height="40" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_633_89)">
                <path d="M11.5383 31.0893C10.4167 31.0893 9.46319 30.6967 8.67792 29.9114C7.89264 29.1264 7.5 28.1729 7.5 27.051C7.5 25.9293 7.89264 24.9759 8.67792 24.1906C9.46319 23.4053 10.4167 23.0127 11.5383 23.0127C12.6603 23.0127 13.6139 23.4053 14.3992 24.1906C15.1844 24.9759 15.5771 25.9293 15.5771 27.051C15.5771 28.1729 15.1844 29.1264 14.3992 29.9114C13.6139 30.6967 12.6603 31.0893 11.5383 31.0893ZM28.4617 31.0893C27.3397 31.0893 26.3861 30.6967 25.6008 29.9114C24.8156 29.1264 24.4229 28.1729 24.4229 27.051C24.4229 25.9293 24.8156 24.9759 25.6008 24.1906C26.3861 23.4053 27.3397 23.0127 28.4617 23.0127C29.5833 23.0127 30.5368 23.4053 31.3221 24.1906C32.1074 24.9759 32.5 25.9293 32.5 27.051C32.5 28.1729 32.1074 29.1264 31.3221 29.9114C30.5368 30.6967 29.5833 31.0893 28.4617 31.0893ZM20 16.9868C18.8783 16.9868 17.9249 16.5942 17.1396 15.8089C16.3543 15.0236 15.9617 14.0702 15.9617 12.9485C15.9617 11.8265 16.3543 10.8731 17.1396 10.0881C17.9249 9.3028 18.8783 8.91016 20 8.91016C21.1217 8.91016 22.0751 9.3028 22.8604 10.0881C23.6457 10.8731 24.0383 11.8265 24.0383 12.9485C24.0383 14.0702 23.6457 15.0236 22.8604 15.8089C22.0751 16.5942 21.1217 16.9868 20 16.9868Z" fill="#F2F2F2"/>
                </g>
              </svg>
            </button>

            <button
              onClick={() => handleNavigateEditQuestion(1)}
              disabled={questionsEdit.length <= 1}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-30"
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

  //review mode
  if (userResponse && !isOwner && currentQuestionIndex !== null) {
    const q = questions[currentQuestionIndex];
    const userAnswer = userResponse.answers[currentQuestionIndex];
    const isCorrect = userAnswer?.isCorrect;
  
    return (
      <div className="min-h-screen flex flex-col" style={{ 
        background: isCorrect ? 'var(--color-join)' : 'var(--color-bg-wrong)' 
      }}>
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center" style={{ 
              color: isCorrect ? 'white' : 'var(--color-text-wrong)' 
            }}>
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
            {q.options.map((opt, optIdx) => {
              const isUserSelection = userAnswer?.selectedOption === optIdx;
              const isCorrectOption = q.correctOption === optIdx;
              
              let optionBg = 'var(--color-join)';
              let optionText = 'white';
              let fontSize = 'text-base';
              let labelText = '';
              
              if (isCorrect) {
                if (isCorrectOption) {
                  optionBg = 'var(--color-join)';
                  optionText = 'white';
                  fontSize = 'text-lg';
                  labelText = 'Correct Option';
                } else {
                  optionBg = 'var(--color-join)';
                  optionText = 'white';
                }
              } else {
                if (isCorrectOption) {
                  optionBg = 'var(--color-join-highlight)';
                  optionText = 'white';
                  labelText = 'Correct Option';
                } else if (isUserSelection) {
                  optionBg = 'var(--color-bg-wrong)';
                  optionText = 'var(--color-text-wrong)';
                  labelText = 'User Selected';
                } else {
                  optionBg = 'var(--color-join)';
                  optionText = 'white';
                }
              }
              
              return (
                <div
                  key={optIdx}
                  className={`w-full py-5 px-6 rounded-3xl text-center ${fontSize} dm-sans-regular transition-all`}
                  style={{
                    background: optionBg,
                    color: optionText
                  }}
                >
                  {opt}
                  {labelText && <div className="text-xs mt-1 opacity-80">{labelText}</div>}
                </div>
              );
            })}
          </div>
  
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => handleNavigateQuestion(-1)}
              disabled={questions.length <= 1}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-30"
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
              className="rounded-full px-3 py-3 transition-all flex items-center cursor-pointer justify-center gap-2"
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
              className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all disabled:opacity-30"
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
  
  //review mode ques list
  if (userResponse && !isOwner) {
    return (
      <div className="min-h-screen px-6 py-12" style={{ background: 'var(--color-background)' }}>
        <div 
          className="max-w-md mx-auto"
          onClick={(e) => {
            if (!e.target.closest('.question-card')) {
              setExpandedQuestionIndex(null);
            }
          }}
        >
          <div className="text-center mb-12 text-white">
            <p className="text-xs mb-2 dm-sans-italic opacity-60">title</p>
            <h1 className="text-5xl mb-3 font-semibold" style={{ fontFamily: 'var(--font-main)', fontStyle:'bold' , textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              {quizMeta.title || "Untitled"}
            </h1>
            {/* <p className="text-xs dm-sans-italic opacity-80">
              By: {auth.currentUser.displayName}
            </p> */}
          </div>
  
          <div className="space-y-3 mb-6">
            {questions.map((q, index) => {
              const userAnswer = userResponse.answers[index];
              const isCorrect = userAnswer?.isCorrect;
              
              return (
                <div
                  key={q.id}
                  className="question-card rounded-3xl overflow-hidden transition-all cursor-pointer"
                  style={{
                    background: isCorrect
                      ? (expandedQuestionIndex === index ? 'var(--color-join-highlight)' : 'var(--color-join)')
                      : (expandedQuestionIndex === index ? 'var(--color-bg-wrong)' : 'var(--color-bg-wrong)'),
                    height: expandedQuestionIndex === index ? '120px' : '70px',
                    transform: expandedQuestionIndex === index ? 'scale(1.02)' : 'scale(1)'
                  }}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="h-full p-5 flex items-center justify-between gap-3" style={{
                    color: isCorrect ? 'white' : 'var(--color-text-wrong)'
                  }}>
                    <div className="flex-1">
                      <h3 className="text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
                        Q{index + 1}.
                      </h3>
                      {expandedQuestionIndex === index && (
                        <p className="text-sm mt-2 dm-sans-regular" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                          {q.description}
                        </p>
                      )}
                    </div>
  
                    <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform duration-300" style={{
                      borderColor: isCorrect ? 'white' : 'var(--color-text-wrong)'
                    }}>
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isCorrect ? 'white' : 'var(--color-text-wrong)'}
                        strokeWidth="2"
                        className="w-6 h-6 transition-transform duration-300"
                        style={{ transform: expandedQuestionIndex === index ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                      >
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
  
          <button
            onClick={() => navigate('/joined-quizzes')}
            className="w-full py-5 px-6 rounded-3xl text-xl transition-all cursor-pointer text-white"
            style={{ background: 'var(--color-join)', fontFamily: 'var(--font-heading)' }}
          >
            Back to Joined Quizzes
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
  }

  //single ques view
  if (currentQuestionIndex !== null && !userResponse) {
    const q = questions[currentQuestionIndex];
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-join)' }}>
        <Header />
        {timeRemaining !== null && (
        <div className="absolute top-20 right-6 z-50">
          <div 
            className="px-3 py-1 rounded-2xl shadow-lg"
            style={{ 
              height: 35,
              width: 100,
              background: timeRemaining < 60 
                ? 'var(--color-text-wrong)'
                : timeRemaining < 300 
                  ? 'rgba(255, 165, 0, 0.8)'
                  : 'var(--color-background)',
              backdropFilter: 'blur(10px)',
              
            }}
          >
            <p className="text-white text-lg" style={{ fontFamily: 'var(--font-main)' }}>
              {formatTime(timeRemaining)}
            </p>
          </div>
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

        <div className="px-2 pb-5" style={{ background: 'var(--color-background)' }}>
          <div className="w-full max-w-md mx-auto space-y-3 pt-5 pb-5">
            {q.options.map((opt, index) => (
              <button
                key={index}
                onClick={() => pickAnswer(currentQuestionIndex, index)}
                className="w-full py-5 px-6 rounded-3xl text-center text-base cursor-pointer dm-sans-regular transition-all"
                style={{
                  background: answers[currentQuestionIndex] === index 
                    ? 'var(--color-create)' 
                    : 'var(--color-join)',
                  color: 'white'
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
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-30"
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
              className="rounded-full px-3 py-3 transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{ background: 'transparent' }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40"/>
                <path d="M11.5383 31.0893C10.4167 31.0893 9.46319 30.6967 8.67792 29.9114C7.89264 29.1264 7.5 28.1729 7.5 27.051C7.5 25.9293 7.89264 24.9759 8.67792 24.1906C9.46319 23.4053 10.4167 23.0127 11.5383 23.0127C12.6603 23.0127 13.6139 23.4053 14.3992 24.1906C15.1844 24.9759 15.5771 25.9293 15.5771 27.051C15.5771 28.1729 15.1844 29.1264 14.3992 29.9114C13.6139 30.6967 12.6603 31.0893 11.5383 31.0893ZM28.4617 31.0893C27.3397 31.0893 26.3861 30.6967 25.6008 29.9114C24.8156 29.1264 24.4229 28.1729 24.4229 27.051C24.4229 25.9293 24.8156 24.9759 25.6008 24.1906C26.3861 23.4053 27.3397 23.0127 28.4617 23.0127C29.5833 23.0127 30.5368 23.4053 31.3221 24.1906C32.1074 24.9759 32.5 25.9293 32.5 27.051C32.5 28.1729 32.1074 29.1264 31.3221 29.9114C30.5368 30.6967 29.5833 31.0893 28.4617 31.0893ZM20 16.9868C18.8783 16.9868 17.9249 16.5942 17.1396 15.8089C16.3543 15.0236 15.9617 14.0702 15.9617 12.9485C15.9617 11.8265 16.3543 10.8731 17.1396 10.0881C17.9249 9.3028 18.8783 8.91016 20 8.91016C21.1217 8.91016 22.0751 9.3028 22.8604 10.0881C23.6457 10.8731 24.0383 11.8265 24.0383 12.9485C24.0383 14.0702 23.6457 15.0236 22.8604 15.8089C22.0751 16.5942 21.1217 16.9868 20 16.9868Z" fill="#F2F2F2"/>
              </svg>
            </button>

            <button
              onClick={() => handleNavigateQuestion(1)}
              disabled={questions.length <= 1}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all disabled:opacity-30 cursor-pointer"
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

  //owner page ques list
  return (
    <>
    <Header/>
    <div className= "min-h-screen px-3 pt-5" style={{ background: 'var(--color-background)' }}>
      <div 
        className="max-w-md md:mx-auto md:max-w-2xl"
        onClick={(e) => {
          if (!e.target.closest('.question-card') && !e.target.closest('.owner-card')) {
            setExpandedQuestionIndex(null);
          }
        }}
      >
        <div className="text-center mb-10 text-white">
          <p className="text-sm mb-2 opacity-80" style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic'}}>title</p>
          <h1 className="text-5xl mb-3 font-semibold" style={{ fontFamily: 'var(--font-main)', fontStyle: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            {quizMeta.title || "Untitled"}
          </h1>
        </div>

        {isOwner && (
          <div className="mb-8 space-y-3">
            <div 
              className="owner-card rounded-3xl p-4 flex items-center justify-between cursor-pointer transition-all"
              style={{ 
                background: !quizMeta.acceptingResponses 
                  ? 'var(--color-bg-wrong)' 
                  : 'var(--color-bg-wrong)',
                height: '85px'
              }}
              onClick={toggleAcceptingResponses}
            >
              <div className="flex-1">
                <h2 className="text-2xl" style={{ 
                  fontFamily: 'var(--font-heading)', 
                  color: !quizMeta.acceptingResponses ? 'var(--color-insights-blue)' : 'var(--color-text-wrong)',
                  fontStyle: 'italic'
                }}>
                  {!quizMeta.acceptingResponses ? 'Start Further' : 'Stop Further'}
                </h2>
                <h2 className="text-2xl" style={{ 
                  fontFamily: 'var(--font-heading)', 
                  color: !quizMeta.acceptingResponses ? 'var(--color-insights-blue)' : 'var(--color-text-wrong)',
                  fontStyle: 'italic'
                }}>
                  Responses
                </h2>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center">
                {!quizMeta.acceptingResponses ? (
                  <svg width="60" height="60" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_392_337" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="70" height="70">
                  <rect x="0.5" y="0.5" width="69" height="69" fill="#D9D9D9" stroke="black"/>
                  </mask>
                  <g mask="url(#mask0_392_337)">
                  <path d="M20.9827 43.1287V45.0457H10.2991L10.6301 45.7566C12.9216 50.6778 16.2313 54.5786 20.5579 57.446C24.8877 60.3151 29.7066 61.7498 35.0002 61.7498C40.8851 61.7497 46.1796 59.9898 50.8674 56.4734C55.4327 53.0488 58.5969 48.6164 60.3557 43.1902L62.2629 43.575C60.4398 49.5071 57.0767 54.3059 52.1663 57.9861C47.1124 61.7737 41.3961 63.6667 35.0002 63.6667C29.6038 63.6667 24.7195 62.3241 20.3362 59.6423L19.9133 59.3787C15.4214 56.52 11.8476 52.486 9.19556 47.2595L8.25024 47.4861V57.8337H6.33325V43.1287H20.9827ZM44.5071 34.9998L29.6663 44.5183V25.4812L44.5071 34.9998ZM57.3665 17.3113C59.0478 19.385 60.3859 21.6229 61.3821 24.0261C62.3784 26.4291 63.0343 28.9482 63.3499 31.5837H61.4329C61.0944 29.0099 60.4662 26.6459 59.5442 24.4958C58.6326 22.3711 57.4508 20.4315 55.9993 18.6785L57.3665 17.3113ZM13.8606 18.6511C12.4125 20.5931 11.2703 22.5514 10.4426 24.5291C9.60691 26.5261 8.96018 28.8798 8.49243 31.5837H6.55005C6.93522 28.8142 7.58433 26.3241 8.49438 24.1101C9.4075 21.8898 10.7235 19.6242 12.4504 17.3152L13.8606 18.6511ZM31.5833 8.5603C29.3205 8.83528 27.0933 9.4297 24.9026 10.3406L24.9016 10.3416C22.7039 11.2561 20.625 12.4412 18.6663 13.8972L17.3293 12.4871C19.5172 10.8322 21.8142 9.51331 24.219 8.52612C26.6112 7.54411 29.0655 6.91672 31.5833 6.64331V8.5603ZM38.4163 6.64526C40.9444 6.92902 43.407 7.56709 45.8049 8.56128C48.2098 9.55789 50.4823 10.8802 52.6223 12.53L51.26 13.8923C49.5229 12.5022 47.4878 11.329 45.1604 10.3689C42.8366 9.41029 40.5881 8.80368 38.4163 8.5564V6.64526Z" fill="#29055F" stroke="black"/>
                  </g>
                  </svg>
                  
                ) : (
                  <svg width="60" height="60" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_390_259" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="70" height="70">
                  <rect width="70" height="70" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask0_390_259)">
                  <path d="M24.7917 45.2083H45.2083V24.7917H24.7917V45.2083ZM35.0095 61.25C31.3797 61.25 27.9669 60.5612 24.7712 59.1835C21.576 57.8059 18.7965 55.9363 16.4325 53.5748C14.0685 51.2133 12.1973 48.4361 10.8186 45.2433C9.43955 42.051 8.75 38.6398 8.75 35.0095C8.75 31.3797 9.43882 27.9669 10.8165 24.7712C12.1941 21.576 14.0637 18.7965 16.4252 16.4325C18.7867 14.0685 21.5639 12.1973 24.7567 10.8186C27.949 9.43955 31.3602 8.75 34.9905 8.75C38.6203 8.75 42.0331 9.43882 45.2288 10.8165C48.424 12.1941 51.2035 14.0637 53.5675 16.4252C55.9315 18.7867 57.8027 21.5639 59.1814 24.7567C60.5605 27.949 61.25 31.3602 61.25 34.9905C61.25 38.6203 60.5612 42.0331 59.1835 45.2288C57.8059 48.424 55.9363 51.2035 53.5748 53.5675C51.2133 55.9315 48.4361 57.8027 45.2433 59.1814C42.051 60.5605 38.6398 61.25 35.0095 61.25ZM35 58.3333C41.5139 58.3333 47.0312 56.0729 51.5521 51.5521C56.0729 47.0312 58.3333 41.5139 58.3333 35C58.3333 28.4861 56.0729 22.9688 51.5521 18.4479C47.0312 13.9271 41.5139 11.6667 35 11.6667C28.4861 11.6667 22.9688 13.9271 18.4479 18.4479C13.9271 22.9688 11.6667 28.4861 11.6667 35C11.6667 41.5139 13.9271 47.0312 18.4479 51.5521C22.9688 56.0729 28.4861 58.3333 35 58.3333Z" fill="#A62F24"/>
                  </g>
                  </svg>
                )}
              </div>
            </div>

            <div 
              className="owner-card rounded-3xl p-4 flex items-center justify-between cursor-pointer transition-all"
              style={{ 
                background: 'var(--color-insights-blue)',
                height: '85px'
              }}
              onClick={handleEdit}
            >
              <h2 className="text-2xl text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Edit Quiz
              </h2>
              <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>

            <div 
              className="owner-card rounded-3xl p-4 flex items-center justify-between cursor-pointer transition-all"
              style={{ 
                background: 'var(--color-insights-blue)',
                height: '85px'
              }}
              onClick={handleViewResponses}
            >
              <h2 className="text-2xl text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                View Responses
              </h2>
              <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>

            <div 
              className="owner-card rounded-3xl p-4 flex items-center justify-between cursor-pointer transition-all"
              style={{ 
                background: 'var(--color-bg-wrong)',
                height: '85px'
              }}
              onClick={handleDelete}
            >
              <h2 className="text-2xl" style={{ 
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-wrong)'
              }}>
                Delete Quiz
              </h2>
              <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center" style={{
                borderColor: 'var(--color-text-wrong)'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-wrong)" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3 mb-6">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="question-card rounded-3xl overflow-hidden transition-all cursor-pointer"
              style={{
                background: expandedQuestionIndex === index ? 'var(--color-join-highlight)' : 'var(--color-join)',
                height: expandedQuestionIndex === index ? '120px' : '70px',
                transform: expandedQuestionIndex === index ? 'scale(1.02)' : 'scale(1)'
              }}
              onClick={() => !userResponse && handleCardClick(index)}
            >
              <div className="h-full p-5 flex items-center justify-between gap-3 text-white">
                <div className="flex-1">
                  <h3 className="text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
                    Q{index + 1}.
                  </h3>
                  {expandedQuestionIndex === index && (
                    <p className="text-sm mt-2 dm-sans-regular" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                      {q.description}
                    </p>
                  )}
                </div>

                <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-300">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className="w-6 h-6 transition-transform duration-300"
                    style={{ transform: expandedQuestionIndex === index ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isOwner && !userResponse && quizMeta.acceptingResponses && (
          <button
            onClick={submitQuiz}
            disabled={!allAnswered}
            className="w-full py-5 px-6 rounded-3xl text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white cursor-pointer"
            style={{
              background: allAnswered ? 'var(--color-join)' : 'rgba(41, 5, 95, 0.5)',
              fontFamily: 'var(--font-heading)'
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
    </>
  );
};

export default QuizPage;