import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { db, auth, timestamp } from '../utils/firebase';
import { generateQuizCode } from '../utils/quizCode';
import Header from './Header';
import QuizFront from './QuizFront';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [showFront, setShowFront] = useState(true);
  const [frontData, setFrontData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [hoveredQuestionIndex, setHoveredQuestionIndex] = useState(null);

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correct, setCorrect] = useState(0);

  const handleFrontProceed = (data) => {
    setFrontData(data);
    setShowFront(false);
  };

  const handleAddQuestion = () => {
    setEditingQuestion(questions.length);
    setQuestionText("");
    setOptions(["", ""]);
    setCorrect(0);
    setCurrentQuestionIndex(questions.length);
  };

  const handleSaveQuestion = () => {
    if (!questionText.trim()) {
      alert("Please enter a question.");
      return;
    }
    if (options.some(opt => !opt.trim())) {
      alert("Please fill out all options.");
      return;
    }

    const questionData = {
      question: questionText,
      options: options.filter(opt => opt.trim()),
      correct
    };

    if (editingQuestion !== null && editingQuestion < questions.length) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestion] = questionData;
      setQuestions(updatedQuestions);
    } else {
      setQuestions([...questions, questionData]);
    }

    setEditingQuestion(null);
    setCurrentQuestionIndex(null);
    setQuestionText("");
    setOptions(["", "", ""]);
    setCorrect(0);
  };

  const handleQuestionClick = (index) => {
    setEditingQuestion(index);
    setCurrentQuestionIndex(index);
    const q = questions[index];
    setQuestionText(q.question);
    setOptions([...q.options, "", ""].slice(0, Math.max(q.options.length, 2)));
    setCorrect(q.correct);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const updatedOptions = options.filter((_, i) => i !== index);
      setOptions(updatedOptions);
      if (correct >= updatedOptions.length) {
        setCorrect(0);
      }
    }
  };

  const handleNavigateQuestion = (direction) => {
    if (questions.length <= 1) return;
    
    let newIndex = currentQuestionIndex + direction;
    if (newIndex < 0) newIndex = questions.length - 1;
    if (newIndex >= questions.length) newIndex = 0;
    
    handleQuestionClick(newIndex);
  };

  const onSaveQuiz = async () => {
    if (!frontData?.title?.trim() || questions.length === 0) {
      alert("Add a title and at least one question.");
      return;
    }

    try {
      const quizCode = await generateQuizCode(8);
      const totalDurationInSeconds = (frontData.duration.hours * 3600) + 
                                     (frontData.duration.minutes * 60) + 
                                     frontData.duration.seconds;

      const quizData = {
        title: frontData.title,
        quizCode,
        createdBy: auth.currentUser.uid,
        createdName: auth.currentUser.displayName,
        createdAt: timestamp(),
        bannerImage: frontData.bannerImage || null,
        duration: totalDurationInSeconds,
        startDate: frontData.startDate || null,
        startTime: frontData.startTime || '00:00',
        acceptingResponses: true
      };

      const quizRef = await addDoc(collection(db, 'quizzes'), quizData);
      
      await Promise.all(
        questions.map((q, idx) => {
          const questionRef = doc(db, 'quizzes', quizRef.id, 'questions', `question${idx+1}`);
          return setDoc(questionRef, {
            description: q.question,
            options: q.options,
            correctOption: q.correct,
            createdAt: timestamp(),
          });
        })
      );

      alert(`Quiz created! Code = ${quizCode}`);
      navigate(`/quiz/${quizCode}`);
    } catch(err) {
      console.error(err);
      alert("Error saving quiz: " + err.message);
    }
  };

  if (showFront) {
    return <QuizFront mode="create" onProceed={handleFrontProceed} />;
  }

  if (currentQuestionIndex !== null) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-create)' }}>
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center text-white">
              <h2 className="text-4xl mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Q{currentQuestionIndex + 1}.
              </h2>

              <input
                type="text"
                placeholder="Enter question..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full bg-transparent text-white text-center text-xl dm-sans-regular px-4 py-3 rounded-md outline-none"
                style={{ border: 'none', fontFamily: 'var(--font-main)' }}
              />
            </div>
          </div>
        </div>

        <div className="px-6 pb-6" style={{ background: 'var(--color-background)' }}>
          <div className="w-full max-w-md mx-auto space-y-3 pt-5 pb-5">
            {options.map((opt, index) => {
              const isCorrect = correct === index;
              const baseBg = isCorrect ? 'var(--color-create)' : 'var(--color-create-highlight)';
              return (
                <div
                  key={index}
                  className="w-full py-4 px-5 rounded-3xl text-left dm-sans-regular transition-all flex items-center gap-3"
                  style={{
                    background: baseBg,
                    color: 'white',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (!isCorrect) e.currentTarget.style.background = 'var(--color-create-highlight)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isCorrect) e.currentTarget.style.background = 'var(--color-create)';
                  }}
                >
                  <input
                    type="radio"
                    name="correctOption"
                    checked={isCorrect}
                    onChange={() => setCorrect(index)}
                    className="w-5 h-5 cursor-pointer flex-shrink-0"
                    style={{ accentColor: 'var(--color-create)' }}
                  />
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 bg-transparent text-white outline-none placeholder-white placeholder-opacity-60"
                    style={{ fontFamily: 'var(--font-main)' }}
                  />

                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                      style={{ background: 'rgba(255, 255, 255, 0.12)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14"/>
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}

            {options.length < 6 && (
              <button
                onClick={addOption}
                className="w-full rounded-3xl p-4 transition-all flex items-center justify-center"
                style={{ background: 'rgba(90, 132, 255, 0.2)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(90, 132, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(90, 132, 255, 0.2)'}
              >
                <span className="text-2xl">+</span>
              </button>
            )}
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
              onClick={() => {
                handleSaveQuestion();
                setCurrentQuestionIndex(null);
                setEditingQuestion(null);
              }}
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

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--color-background)', fontFamily: 'var(--font-main)' }}>
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-12">
          {frontData?.title && (
            <>
              <p className="text-sm mb-2 opacity-60" style={{ fontStyle: 'italic' }}>
                By: {auth.currentUser?.displayName}
              </p>
              <h1 className="text-4xl mb-6" style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
                {frontData.title}
              </h1>
            </>
          )}
        </div>

        <div className="space-y-3 mb-4">
          {questions.map((q, index) => (
            <div
              key={index}
              className="rounded-3xl overflow-hidden transition-all cursor-pointer"
              style={{ 
                background: 'var(--color-create)',
                height: hoveredQuestionIndex === index ? '100px' : '70px'
              }}
              onMouseEnter={() => setHoveredQuestionIndex(index)}
              onMouseLeave={() => setHoveredQuestionIndex(null)}
            >
              <div className="h-full p-4 flex items-center justify-between gap-3">
                {hoveredQuestionIndex === index && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuestion(index);
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.2)',
                      animation: 'fadeIn 0.3s ease-out'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14"/>
                    </svg>
                  </button>
                )}
                
                <div className="flex-1" onClick={() => handleQuestionClick(index)}>
                  <h3 className="text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
                    Q{index + 1}.
                  </h3>
                  {hoveredQuestionIndex === index && (
                    <p className="text-sm mt-1 opacity-90 truncate" style={{ animation: 'fadeIn 0.3s ease-out', fontFamily: 'var(--font-main)' }}>
                      {q.question}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => handleQuestionClick(index)}
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
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
                    style={{ transform: hoveredQuestionIndex === index ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddQuestion}
          className="w-full rounded-3xl p-6 mb-4 transition-all flex items-center justify-center"
          style={{ background: 'rgba(90, 132, 255, 0.3)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(90, 132, 255, 0.4)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(90, 132, 255, 0.3)'}
        >
          <span className="text-4xl">+</span>
        </button>

        <button
          onClick={onSaveQuiz}
          className="w-full rounded-3xl p-6 transition-all"
          style={{ background: 'var(--color-create)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#4a74ef'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-create)'}
        >
          <span className="text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Create Quiz
          </span>
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
        input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default CreateQuiz;